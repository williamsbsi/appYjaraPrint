import { PopoverController } from '@ionic/angular';
import { PoseidonService } from 'src/app/api/poseidon.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MoreMenuComponent } from './more-menu/more-menu.component';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-trechos-viagens',
  templateUrl: './trechos-viagens.page.html',
  styleUrls: ['./trechos-viagens.page.scss'],
})
export class TrechosViagensPage implements OnInit {
   @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  trechos: any;
  page: number;
  constructor(
    private servicePoseidon: PoseidonService,
    private router: Router,
    private location: Location,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.page = 1;
    this.servicePoseidon.getTrechosViagens(true, this.page).subscribe(trechos => {
      if (trechos.data.length > 0) {
        this.trechos = JSON.parse(atob(trechos.data));
        console.log(this.trechos);
      }
   });
  }

  avancar(viagem) {
    const data = {
      viagem: JSON.stringify(viagem)
    };
    this.router.navigate(['/grupo-passageiros', data]);
  }

  onVoltar() {
    this.location.back();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: MoreMenuComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  loadData(event) {
    this.page++;
    console.log('page: ', this.page);
    this.servicePoseidon.getTrechosViagens(true, this.page).subscribe(trechos => {
      event.target.complete();
      
      if(trechos.data.length > 0){
        let novosTrechos = JSON.parse(atob(trechos.data));
        for (var i = 0; i < novosTrechos.length; i++) {
          this.trechos.push(novosTrechos[i]);  
        }
        
        console.log(this.trechos);
      }
   });
    console.log(event);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

}
