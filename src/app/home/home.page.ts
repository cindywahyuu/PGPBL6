import { Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  map!: L.Map;

  constructor() {}

  ngOnInit() {}

  ionViewDidEnter(){
    // Inisialisasi peta
    this.map = L.map('mapId').setView([51.505, -0.09], 13);

    // Basemap OpenStreetMap
    const openStreetMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Basemap ESRI World Imagery
    const esriWorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    // Basemap CartoDB Positron
    const cartoDBPositron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.carto.com/">CartoDB</a>'
    });



    // Menambahkan layer control untuk memilih basemap
    const baseMaps = {
      "OpenStreetMap": openStreetMap,
      "ESRI World Imagery": esriWorldImagery,
      "CartoDB Positron": cartoDBPositron
    };

    L.control.layers(baseMaps).addTo(this.map);

    // Set default basemap
    openStreetMap.addTo(this.map);

    // Menambahkan marker dengan popup informasi
    const marker = L.marker([51.5, -0.09]).addTo(this.map)
      .bindPopup('<b>Hello world!</b><br>I am in london.')
      .openPopup();
  }
}
