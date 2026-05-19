import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { ClimaService } from '../../../services/clima.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clima',
  imports: [CommonModule, FormsModule],
  templateUrl: './clima.component.html',
  styleUrl: './clima.component.css',
})
export class ClimaComponent {
  cidade = '';
  cidadePesquisada = '';
  clima: any;
  backgroundClass = 'default';
  iconeClima = '☀️';

  constructor(private climaService: ClimaService, private cdr: ChangeDetectorRef, private ngZone: NgZone ) {}

  async buscarClima() {

    if (!this.cidade.trim()) {
      return;
    }

    const cidadeDigitada = this.cidade;

    try {
      const dados: any = await this.climaService.buscarCidade(cidadeDigitada);

      this.ngZone.run(() => {
        this.clima = dados.current;
        this.cidadePesquisada = dados.cidade;

        const codigo = dados.current.weather_code;
        const temperatura = dados.current.temperature_2m;

        if (codigo === 0 && temperatura >= 30) {
          this.backgroundClass = 'sunny';
          this.iconeClima = '☀️';
        } else if (codigo === 0) {
          this.backgroundClass = 'sunny';
          this.iconeClima = '🌤';
        } else if (codigo >= 1 && codigo <= 3) {
          this.backgroundClass = 'cloudy';
          this.iconeClima = '☁️';
        } else if (codigo >= 51 && codigo <= 67) {
          this.backgroundClass = 'rainy';
          this.iconeClima = '🌧';
        } else if (temperatura <= 10) {
          this.backgroundClass = 'cold';
          this.iconeClima = '❄️';
        } else {
          this.backgroundClass = 'default';
          this.iconeClima = '🌈';
        }

        this.cdr.detectChanges();
      });

    } catch (error) {
      alert('Erro ao buscar clima: ' + (error as Error).message);
      this.clima = null;
      this.cidadePesquisada = '';
      this.backgroundClass = 'default';
      this.iconeClima = '🌈';
    }
  }
}
