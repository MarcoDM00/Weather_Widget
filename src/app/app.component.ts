import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Service } from './service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  weather:any;
  subscription:Subscription;
  url:string = environment.apiEndpoint + "?q=milan&appid=" + environment.apiKey;

  constructor(private service:Service) {}

  ngOnInit(): void {
      this.weather = {main:{}, isDay:true};
      let observable = this.service.get(this.url);
      this.subscription = observable.subscribe(
        res => {
          this.setData(res);
        }
      );
  }

  setData(data:any) {
    this.weather = data;
    let sunsetTime = new Date(this.weather.sys.sunset * 1000);
    this.weather.sunset_time = sunsetTime.toLocaleTimeString();
    let currentDate = new Date();
    this.weather.isDay = (currentDate.getTime() < sunsetTime.getTime());
    this.weather.temp_celcius = (this.weather.main.temp - 273.15).toFixed(0);
    this.weather.temp_min = (this.weather.main.temp_min - 273.15).toFixed(0);
    this.weather.temp_max = (this.weather.main.temp_max - 273.15).toFixed(0);
    this.weather.temp_feels_like = (this.weather.main.feels_like - 273.15).toFixed(0);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}