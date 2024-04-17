import { Passageiro } from './../models/passageiro';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.page.html',
  styleUrls: ['./pagamento.page.scss'],
})
export class PagamentoPage implements OnInit {

  params: any = {};
  formasPagamento: any = [];
  convenio: any;
  trechoValor = 0;
  numeroDigitado = '';
  passageiros: Array<Passageiro>;
  viagem: any;
  
  valorComodo: number;
  valorDesconto: number;
  valorTotal: number;

  constructor (
    private route: ActivatedRoute,
    private router: Router,
    public toastController: ToastController,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params);
      this.formasPagamento = JSON.parse(params['formasPagamento']);
      this.passageiros = JSON.parse(params['passageiros']);
      this.viagem = JSON.parse(params['viagem']);
      this.valorDesconto = 0;
      this.valorComodo = 0;

      for (let i = 0; i < this.passageiros.length; i++) {
        if (this.passageiros[i].comodo.id === 4) {
          this.valorComodo = this.passageiros[i].comodo.valor;
          this.valorDesconto = parseFloat((( this.passageiros[i].comodo.valor * this.passageiros[i].convenio.desconto) / 100)
                                  .toFixed(2));
        } else {
          console.log('Passageiro: ', this.passageiros[i]);
          console.log('Valor Comodo: ', this.passageiros[i].comodo.valor);
          if (typeof this.passageiros[i].comodo.valor !== 'undefined') {
            this.valorComodo += parseFloat(this.passageiros[i].comodo.valor.toString());
          } else {
            console.log('valor undefined');
            this.valorComodo += parseFloat(this.viagem.valor);
            this.passageiros[i].comodo.valor = parseFloat(this.viagem.valor);
          }
          console.log('Desconto: ', this.passageiros[i].convenio.desconto);
          if (typeof this.passageiros[i].convenio.desconto !== 'undefined') {
            console.log('entrou');
            this.valorDesconto += parseFloat((( this.passageiros[i].comodo.valor * this.passageiros[i].convenio.desconto) / 100)
                                  .toFixed(2));
          }
          console.log('Valor Desconto: ', this.valorDesconto);
          console.log('Valor Comodo Total: ', this.valorComodo);
        }
      }

      this.valorTotal = this.valorComodo - this.valorDesconto + this.viagem.taxa_embarque;
      console.log('Valor Total: ', this.valorTotal);
      this.params = params;

    });

  }
  isCredito(forma) {
    if (forma.id === '03') {
      return true;
    }
    return false;
  }
  getPagamento( url = '/confirmacao') {
    let valor = 0;
    for (let i = 0; i < this.formasPagamento.length; i++) {
      let v = this.formasPagamento[i].valor;
      v = v.replace(/[^0-9]/g, '');
      v = v * 0.01;
      this.formasPagamento[i].valor = parseFloat(v);
      valor += this.formasPagamento[i].valor;
    }
    console.log('Valor', valor);
    console.log('Valor Trecho', this.valorTotal);
    if ((valor + 0.005)  >= this.valorTotal) {
      const data = {
        pagamento: JSON.stringify(this.formasPagamento),
        valorTotal: this.valorTotal,
        valorComodo: this.valorComodo,
        valorDesconto: this.valorDesconto
      };
      const data1 = Object.assign(data, this.params);
      this.router.navigate([url, data1]);
    } else {
      this.presentToastWithOptions();
    }
  }

  getAddComprador() {
    this.getPagamento('/comprador');
  }
  money(event) {
    let valor = event.target.value;
    valor = valor.replace(/[^0-9]/g, '');
    valor = valor * 0.01;
    valor =  parseFloat(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    return valor;
  }
  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      message: 'A soma dos valores informados devem ser igual ou maior que o valor da passagem.',
      showCloseButton: true,
      position: 'top',
      duration: 2000,
      closeButtonText: 'Ok',
    });
    toast.present();
  }

}
