import { Component, OnInit, Input } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})

export class WeatherComponent implements OnInit {
  constructor(private http: HttpClient, private snackBar: MatSnackBar){}
  link = ''
  x = ''
  buttonClicked = false
  inputEmpty = false
  foggy = false
  cloudyL = false
  partially_cloudyL = false
  cloudyM = false
  partially_cloudyM = false
  cloudyH = false
  partially_cloudyH = false
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2500,
    })
  }
  onNewLocation(){
    this.buttonClicked = true
    if (this.x == ""){
      this.inputEmpty = true
      this.openSnackBar("Input field is empty!","Warning")
      this.buttonClicked = false
      return
    }
    if ((this.x[0] >= 'a' && this.x[0] <='z') || (this.x[0] >= 'A' && this.x[0] <='Z')){
      this.getGPS()
    }
    else{
      this.link = 'https://api.met.no/weatherapi/locationforecast/2.0/complete?lat='+
        this.x.split(',')[0]+'&lon=' + this.x.split(',')[1]  
      this.getWeather()
    }
    
  }
  onUpdateLocation(event: Event){
    this.x=(<HTMLInputElement>event.target).value;

  }
  private getGPS(){
    this.http.get('https://api.opencagedata.com/geocode/v1/json?q='+this.x+'&key=18465d5c0ec5408fb6083f9b16bd61e6')
    .subscribe(data1 => {
      console.log(data1["results"]["0"]["geometry"])
      this.lat = data1["results"]["0"]["geometry"].lat
      this.lon = data1["results"]["0"]["geometry"].lng
      this.x = this.lat + ',' +this.lon
      this.link = 'https://api.met.no/weatherapi/locationforecast/2.0/complete?lat='+
        this.x.split(',')[0]+'&lon=' + this.x.split(',')[1]  
      this.getWeather()
    })
  }
  
  private getWeather(){
    //this.http.get('https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=11.43&lon=12.12',{headers:headers})
    //this.http.get('https://api.met.no/weatherapi/locationforecast/1.9/?lat=11.43;lon=12.12', { responseType: 'text' })
    this.http.get(this.link)
    .subscribe(data => {
      console.log(data["properties"]["timeseries"]["0"]["data"]["instant"]["details"])
      this.dataH = data["properties"]["timeseries"]["0"]["data"]["instant"]["details"].relative_humidity
      this.dewPoint = data["properties"]["timeseries"]["0"]["data"]["instant"]["details"].dew_point_temperature
      this.temp = data["properties"]["timeseries"]["0"]["data"]["instant"]["details"].air_temperature
      this.fog = data["properties"]["timeseries"]["0"]["data"]["instant"]["details"].fog_area_fraction
      this.LowClouds = data["properties"]["timeseries"]["0"]["data"]["instant"]["details"].cloud_area_fraction_low
      this.MediumClouds = data["properties"]["timeseries"]["0"]["data"]["instant"]["details"].cloud_area_fraction_medium
      this.HighClouds = data["properties"]["timeseries"]["0"]["data"]["instant"]["details"].cloud_area_fraction_high
      if (this.fog > 50){
        this.foggy = true
      }
      if (this.LowClouds > 20 && this.LowClouds <= 50){
        this.partially_cloudyL = true
      }
      if (this.LowClouds > 50){
        this.cloudyL = true
      }
      if (this.MediumClouds > 20 && this.MediumClouds <= 50){
        this.partially_cloudyM = true
      }
      if (this.MediumClouds > 50){
        this.cloudyM = true
      }
      if (this.HighClouds > 20 && this.HighClouds <= 50){
        this.partially_cloudyH = true
      }
      if (this.HighClouds > 50){
        this.cloudyH = true
      }
    })
  
  }

  @Input() name: string;
  @Input() dataH: number;
  @Input() dewPoint: number;
  @Input() temp: number;
  @Input() lat: number;
  @Input() lon: number;
  @Input() fog: number;
  @Input() LowClouds: number;
  @Input() MediumClouds: number;
  @Input() HighClouds: number;

  ngOnInit() {
    
    //this.getWeather();
  }
  
}

