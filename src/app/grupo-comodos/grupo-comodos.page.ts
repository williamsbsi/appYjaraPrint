import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { PoseidonService } from 'src/app/api/poseidon.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grupo-comodos',
  templateUrl: './grupo-comodos.page.html',
  styleUrls: ['./grupo-comodos.page.scss'],
})
export class GrupoComodosPage implements OnInit {

  params: any;
  viagem: any;
  comodos: any;
  passageiros: any;
  isLancha: boolean;
  url: string;
  passageiro: any;
  countPassageiro: number;
  qtdIdoso: number;
  constructor(
    private route: ActivatedRoute,
    private servicePoseidon: PoseidonService,
    private router: Router,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.qtdIdoso = 0;
    this.url = '/forma-pagamento';
    this.route.params.subscribe(params => {
      this.params = params;
      console.log('Params Comodo', this.params);
      this.viagem = JSON.parse(params['viagem']);
      console.log('Params Viagem', this.viagem);
      this.passageiros = JSON.parse(params['passageiros']);

      this.isLancha = false;
      if (this.viagem.categoriaEmbarcacao === '3') {
        this.isLancha = true;
        for (let i = 0; i < this.passageiros.length; i++) {
          console.log('comodo', this.passageiros[i].comodo);
          if (typeof this.passageiros[i].comodo === 'undefined') {
            console.log('entrou: ', i);
            this.passageiro = this.passageiros[i];
            this.countPassageiro = i;
            this.url = '/grupo-comodos';
            break;
          }
        }
      }

      this.servicePoseidon.getComodosOcupados(
        this.viagem.trecho_id, this.viagem.viagem_id, this.viagem.embarcacao_id, true).subscribe(comodos => {

        this.comodos = [];
        

        for (let j = 0; j < comodos.length; j++) {
          for (let i = 0; i < comodos[j].length; i++) {
            console.log('comodo: ', comodos[j][i]);
            for (let a = 0; a < comodos[j][i].length; a++) {
              if (comodos[j][i][a].convenio_tipo && comodos[j][i][a].convenio_tipo === 2) {
                this.qtdIdoso++;
              }
            }
            this.comodos.push(comodos[j][i]);
          }
        }

      console.log('Comodos OCupados', this.comodos);
      });
    });
  }

  getConfirmacao(comodo: any ) {
    this.reservaComodo(comodo);
    if (this.viagem.categoriaEmbarcacao === '3') {
      this.confirmaComodoLancha(comodo);
    } else {
      if (comodo.quantidade < this.passageiros.length) {
        this.presentAlert();
      } else {
        this.confirmaComodoNavio(comodo);
      }
    }
  }
  
  enviarConfirmacao() {
    console.log(this.passageiros);
    const data = {
      viagem: JSON.stringify(this.viagem),
      passageiros: JSON.stringify(this.passageiros)
    };

    if ((this.countPassageiro + 1) === this.passageiros.length) {
      this.url = '/forma-pagamento';
    }
    this.router.navigate([this.url, data]);
  }

  confirmaComodoLancha(comodo: any) {
    this.passageiros[this.countPassageiro].comodo = comodo;
    this.enviarConfirmacao();
  }

  confirmaComodoNavio(comodo: any) {
    for (let i = 0; i < this.passageiros.length; i++) {
      this.passageiros[i].comodo = comodo;
    }
    this.enviarConfirmacao();
  }

  reservaComodo(comodo: any) {
    comodo.status = 'reservado';
    if (typeof comodo.comodo_id !== null) {
      const data = {
        'comodo_id': comodo.comodo_id,
        'viagem_id': this.viagem.viagem_id,
        'trecho_id': this.viagem.trecho_id
      };
      this.servicePoseidon.setReservaComodo(data)
      .subscribe(res => {
        console.log('respota: ', res);
      }, (err) => {
        console.log(err);
      });
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Capacidade do Cômodo',
      message: 'A capacidade de passageiros do cômodo é menor do que a quantidade de passageiros informado. Selecione outro cômodo.',
      buttons: ['OK']
    });
    await alert.present();
  }


}
