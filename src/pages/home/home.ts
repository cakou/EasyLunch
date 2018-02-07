import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import leaflet from 'leaflet';
// import L from 'leaflet';
import { RestProvider } from '../../providers/rest/rest';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  restaurant: any;
  errorMessage: string;

  constructor(public navCtrl: NavController, public rest: RestProvider) {

  }

  ionViewDidEnter() {
    this.loadmap();
  }

  ionViewDidLoad() {
    this.getRestaurants();
  }

  loadmap() {
    if (this.map) {
      this.map.remove();
    }
    this.map = leaflet.map("map").fitWorld();
    leaflet.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2Frb3UiLCJhIjoiY2pkMXNjamlxMGNvazM0cXF5d2FnazM1MiJ9.7CivBv0jVrL9YJem_YZ1AQ', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(this.map);
    this.map.locate({
      setView: true,
      maxZoom: 10
    }).on('locationfound', (e) => {
      let markerGroup = leaflet.featureGroup();
      let marker: any = leaflet.marker([e.latitude, e.longitude]).on('click', () => {
        alert('Vous êtes ici !');
      })
      markerGroup.addLayer(marker);
      this.map.addLayer(markerGroup);
    }).on('locationerror', (err) => {
      alert(err.message);
    })
  }

  // L.marker([property.lat, property.long]).addTo(this.map)

  getRestaurants() {
    console.log(this.restaurant);
    this.rest.getRestaurants()
      .subscribe(
      restaurant => this.restaurant = restaurant,
      error => this.errorMessage = <any>error);
  }

}


