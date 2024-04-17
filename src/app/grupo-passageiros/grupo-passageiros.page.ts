import { PoseidonService } from 'src/app/api/poseidon.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Passageiro } from './../models/passageiro';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PassageiroComponent } from './passageiro/passageiro.component';

@Component({
  selector: 'app-grupo-passageiros',
  templateUrl: './grupo-passageiros.page.html',
  styleUrls: ['./grupo-passageiros.page.scss'],
})
export class GrupoPassageirosPage implements OnInit {

  passageiros: Array<Passageiro>;
  params: any;
  viagem: any;
  convenios: any;

  constructor(
    public modalController: ModalController,
    private route: ActivatedRoute,
    private servicePoseidon: PoseidonService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.passageiros = [];
    this.convenios = [];
    this.route.params.subscribe(params => {
      this.params = params;
      this.viagem = JSON.parse(this.params.viagem);
      console.log(this.viagem);
      if (this.passageiros.length === 0) {
        this.modalPassageiro();
      }
    });
  }

  async modalPassageiro() {
    const modal = await this.modalController.create({
      component: PassageiroComponent,
      componentProps: {
        viagem: this.viagem
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data !== null && dataReturned.data !== undefined && dataReturned.data !== 'null') {
        this.passageiros.push(dataReturned.data);
      }
    });
    return await modal.present();
  }

  removerPassageiro(passageiro: Passageiro) {
    const index = this.passageiros.indexOf(passageiro);
    this.passageiros.splice(index, 1);
  }

  avancar() {
    const data = {
      passageiros: JSON.stringify(this.passageiros)
    };
    const data1 = Object.assign(data, this.params);
    this.router.navigate(['/grupo-comodos', data1]);
  }

}
