import { Component } from '@angular/core';
import * as L from 'leaflet';
import * as geojson from 'geojson'; // Opsional untuk tipe GeoJSON

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  map!: L.Map;

  constructor() {}

  ngOnInit() {
    // Fix for missing marker icons when deployed
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }

  ionViewDidEnter() {
    // Inisialisasi peta
    this.map = L.map('mapId').setView([-7.157302570855502, 110.04615381902656], 10);

    // Basemap OpenStreetMap
    const openStreetMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    openStreetMap.addTo(this.map);

    // Muat data pendakian
    this.loadGeoJSON('/assets/Pendakian.geojson', {
      style: {
        color: 'green',
        weight: 3,
        opacity: 1,
      },
      popup: true,
    });
  }

  loadGeoJSON(url: string, options: { style?: L.PathOptions; popup?: boolean }) {
    fetch(url)
      .then(response => response.json())
      .then((data: geojson.FeatureCollection) => {
        // Tentukan ikon gunung
        const mountainIcon = L.icon({
          iconUrl: 'assets/icon/Gunung.png', // Ganti dengan URL gambar ikon gunung
          iconSize: [32, 32], // Ukuran ikon
          iconAnchor: [16, 32], // Titik jangkar ikon
          popupAnchor: [0, -32], // Jarak popup dari ikon
        });

        // Tambahkan GeoJSON ke peta
        const layer = L.geoJSON(data, {
          style: options.style,
          pointToLayer: (feature, latlng) => {
            // Gunakan ikon gunung pada marker
            return L.marker(latlng, { icon: mountainIcon });
          },
          onEachFeature: (feature, layer) => {
            if (options.popup && feature.properties) {
              // Ambil informasi dari properti
              const namaGunung = feature.properties["Nama Gunung"];
              const hargaSimaksi = feature.properties["Harga Simaksi"];
              const jalurPendakian = feature.properties["Jalur Pendakian"];
              const tinggiGunung = feature.properties["Tinggi Gunung"];
              const viewGunung = feature.properties["View"]

              // Konten popup yang akan ditampilkan
              const popupContent = `

                <b>Nama Gunung:</b> ${namaGunung}<br>
                <b>Harga Simaksi:</b> ${hargaSimaksi}<br>
                <b>Jalur Pendakian:</b> ${jalurPendakian}<br>
                <b>Tinggi Gunung:</b> ${tinggiGunung}<br>
                <img src="${viewGunung}" alt="${viewGunung}" style="width: 100%; max-width: 200px;"/>
              `;

              // Menambahkan popup pada layer
              layer.bindPopup(popupContent);
            }
          },
        }).addTo(this.map);

        // Sesuaikan tampilan peta berdasarkan layer pertama
        if (options.popup) {
          this.map.fitBounds(layer.getBounds());
        }
      })
      .catch(error => console.error(`Error loading GeoJSON from ${url}:`, error));
  }
}
