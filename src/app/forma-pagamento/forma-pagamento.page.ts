import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-forma-pagamento',
  templateUrl: './forma-pagamento.page.html',
  styleUrls: ['./forma-pagamento.page.scss'],
})
export class FormaPagamentoPage implements OnInit {

  formas: any[];
  params: any = {};
  formasSelecionadas: any[] = [];
  xFormaOutro: boolean = false;
  xForma: any = '';

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    public toastController: ToastController,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.params = params;
    });
    this.formas = [
      {id: '01', nome: 'Dinheiro', valor: '0', parcela: 0, checked: false },
      {id: '02', nome: 'Cheque', valor: '0', parcela: 0, checked: false},
      {id: '03', nome: 'Cartão de Crédito', valor: '0', parcela: 1, checked: false},
      {id: '04', nome: 'Cartão de Débito', valor: '0', parcela: 0, checked: false},
      {id: '05', nome: 'Vale Transporte', valor: '0', parcela: 0, checked: false},
      {id: '99', nome: 'Outros', valor: '0', parcela: 0, checked: false}
    ];

  }

  onVoltar() {
    this.location.back();
  }

  checkbox(forma) {
    if (forma.id === '99') {
      this.xFormaOutro = forma.checked;
    }

    console.log(forma);
  }
  getFormaPagamento() {
    this.formasSelecionadas = [];
    for (let i = 0; i < this.formas.length; i++) {
      if (this.formas[i].checked) {
        this.formasSelecionadas.push(this.formas[i]);
      }
    }
    if (this.formasSelecionadas.length > 0) {
        if (this.xFormaOutro === true) {
          if (this.xForma.length > 2) {
            this.enviarFormaPagamento();
          } else {
            this.presentToastWithOptions('Informe a forma de pagamento');
          }
        } else {
          this.enviarFormaPagamento();
        }
    } else {
      this.presentToastWithOptions('Selecione uma forma de pagamento!');
    }
  }

  enviarFormaPagamento() {
    const data = {
      formasPagamento: JSON.stringify(this.formasSelecionadas),
      descricaoFormaPagamento: this.xForma
    };
    const data1 = Object.assign(data, this.params);

    this.router.navigate(['/pagamento', data1]);
  }
  async presentToastWithOptions(msg) {
    const toast = await this.toastController.create({
      message: msg,
      showCloseButton: true,
      position: 'top',
      duration: 2000,
      closeButtonText: 'Ok',
    });
    toast.present();
  }
}
