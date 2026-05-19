import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClimaService {
  constructor(private http: HttpClient) {}

  async buscarCidade(cidade: string) {

    const geoUrl =
      `https://geocoding-api.open-meteo.com/v1/search?name=${cidade}`;

    const geoData: any = await firstValueFrom(
      this.http.get(geoUrl)
    );

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error('Cidade não encontrada');
    }

    const latitude = geoData.results[0].latitude;
    const longitude = geoData.results[0].longitude;

    const nomeCidade = `${geoData.results[0].name}, ${geoData.results[0].country}`;

    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;

    const weather: any = await firstValueFrom(this.http.get(weatherUrl));

    return {
      cidade: nomeCidade,
      current: weather.current,
    };
  }
}
