import { Passageiro } from './../models/passageiro';
import { Storage } from '@ionic/storage';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PoseidonService } from '../api/poseidon.service';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { Imprimir } from '../printer/Imprimir';

@Component({
  selector: 'app-confirmacao',
  templateUrl: './confirmacao.page.html',
  styleUrls: ['./confirmacao.page.scss'],
})
export class ConfirmacaoPage implements OnInit {
  params: any;
  valorTotal: number;
  valorComodo: number;
  valorDesconto: number;
  user: any;
  empresa: any;
  message: any;
  disabledButton: boolean;
  data: any;
  data1: any;
  pagamentos: any;
  convenio: any;
  passageiros: Array<Passageiro>;
  viagem: any;
  trecho: any;
  embarcacao: any;
  passageirosCamarote: any = [];
  comprador: any;
  totalPagamento = 0;
  troco = 0;

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private servicePoseidon: PoseidonService,
    public toastController: ToastController,
    private storage: Storage,
    public imprimir: Imprimir,
    public alertController: AlertController
  ) { }
  ionViewWillEnter() {
    this.disabledButton = false;
  }
  ngOnInit() {
    /*this.storage.get('user').then(res => {
      if (res) {
        this.user = res;
      }
    });*/

    this.route.params.subscribe(params => {

      console.log(params);
      this.data = params;
      this.viagem = JSON.parse(params['viagem']);
      this.passageiros = JSON.parse(params['passageiros']);
      this.valorTotal = params.valorTotal;
      this.valorComodo = params.valorComodo;
      this.valorDesconto = params.valorDesconto;
      this.pagamentos = JSON.parse(params['pagamento']);
      this.comprador = false;
      if (params['comprador']) {
        this.comprador = JSON.parse(params['comprador']);
      }
      this.getEmpresa();
      for (let i = 0; i < this.pagamentos.length; i++) {
        this.totalPagamento += this.pagamentos[i].valor;
      }
      this.troco = this.totalPagamento - this.valorTotal;
      console.log(this.troco);
    });
  }

  getEmpresa() {
    this.storage.get('empresa').then(res => {
      if (res) {
        this.empresa = res;
        console.log('Empresa: ', this.empresa);
      } else {
        this.storage.get('embarcacoes').then(embarcacoes => {
          for ( let i = 0; i < embarcacoes.length; i++) {
            if (embarcacoes[i].id == this.viagem.embarcacao_id) {
              this.empresa = embarcacoes[i].empresa;
              console.log('Empresa: ', this.empresa);
            }

          }
        });
      }
      console.log('Empresa: ', this.empresa);
    });
  }

  onVoltar() {
    this.location.back();
  }
  onCancelar() {
    this.router.navigate(['/trechos-viagens']);
  }

  async onConfirmar(nVia: number) {
    this.disabledButton = true;
    await this.servicePoseidon.setPassagemNovo(this.data, nVia, this.empresa)
    .subscribe(res => {

      console.log('respota: ', res);
      let isImprimir: boolean = false;
      if (res.codigo) {
        for ( let i = 0; i < res.codigo.length; i++) {
          if (res.codigo[i] == 1002) {
            this.presentAlert(res.message[i]);
          }
        }
        for ( let i = 0; i < res.codigo.length; i++) {
          isImprimir = true;
          this.presentToastWithOptions(res.message[i]);
          this.router.navigate(['/trechos-viagens']);
        }

        if (isImprimir) {
          for (let j = 0; j < nVia; j++) {
            this.imprimir.print(this.data, res.retorno, this.empresa, res.urlPDF417);
            //this.imprimir.printPassagem(res.imprimir);
          }
        }
      } else {
        isImprimir = true;
        this.presentToastWithOptions('Passagem emitida em contigência.');
        if (isImprimir) {
          for (let j = 0; j < nVia; j++) {
            this.imprimir.print(this.data, null, this.empresa);
            //this.imprimir.printPassagem(res.imprimir);
          }
        }
        this.router.navigate(['/trechos-viagens']);
      }

    }, (err) => {
      console.log(err);
    });

  }

  async presentToastWithOptions(message: any) {
    this.message = message;
    const toast = await this.toastController.create({
      message: this.message,
      showCloseButton: true,
      position: 'top',
      duration: 2000,
      closeButtonText: 'Ok',
    });
    toast.present();
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  isCredito(forma: any) {
    if (forma.id === '03') {
      return true;
    }
    return false;
  }
  getDate () {
    const now = new Date();
    const year = '' + now.getFullYear();
    let month = '' + (now.getMonth() + 1); if (month.length == 1) { month = '0' + month; }
    let day = '' + now.getDate(); if (day.length == 1) { day = '0' + day; }
    let hour = '' + now.getHours(); if (hour.length == 1) { hour = '0' + hour; }
    let minute = '' + now.getMinutes(); if (minute.length == 1) { minute = '0' + minute; }
    let second = '' + now.getSeconds(); if (second.length == 1) { second = '0' + second; }
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
  }

  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Cômodo Ocupado',
      message: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            let passageiros: Array<Passageiro> = this.passageiros;
            for (let i = 0; i < passageiros.length; i++) {
              passageiros[i].comodo = undefined;
            }
            const data = {
              'passageiros': JSON.stringify(passageiros),
              'viagem': JSON.stringify(this.viagem),
            };
            this.router.navigate(['/grupo-comodos', data]);
          }
        }
      ]
    });

    await alert.present();
  }
}
