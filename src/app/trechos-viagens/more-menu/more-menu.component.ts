import { AuthenticationService } from './../../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PoseidonService } from './../../api/poseidon.service';
import { LoadingController, PopoverController } from '@ionic/angular';
import { LoadingService } from './../../services/loading.service';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { from, Observable } from 'rxjs';

const API_STORAGE_KEY = 'specialkey-jyara';

@Component({
  selector: 'app-more-menu',
  templateUrl: './more-menu.component.html',
  styleUrls: ['./more-menu.component.scss'],
})
export class MoreMenuComponent implements OnInit {

  embarcacoes: any;
  viagens: any;
  page: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private popoverController: PopoverController,
    private servicePoseidon: PoseidonService,
    public loadingController: LoadingController,
    private storage: Storage,
    public loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.page = 1;
    this.storage.get('embarcacoes').then(embarcacoes => {
      this.embarcacoes = embarcacoes;
    });
    this.getTrechosViagens().subscribe( viagens => {
      console.log(viagens);
      this.viagens = JSON.parse(atob(viagens.data));
    });
  }

  getTrechosViagens(): Observable<any> {
      return from(this.getLocalData('trechos-viagens?page=' + this.page));
  }

  // Get cached API result
  private getLocalData(key) {
    return this.storage.get(`${API_STORAGE_KEY}-${key}`);
  }


  async onSincronizacao() {
      if (this.embarcacoes !== undefined && this.embarcacoes !== null) {
        for (let i = 0; i < this.embarcacoes.length; i++) {
          await this.sincronizarConvenios(this.embarcacoes[i]);
        }
        this.sincronizarViagens();
        this.DismissClick();
      }
      this.servicePoseidon.getEstados().subscribe((estados) => {
        for (let i = 0; i < estados.length; i++) {
          this.servicePoseidon.getMunicipios(estados[i].uf).subscribe(() => {
          });
        }
      });
  }

  async sincronizarViagens() {
      for (let  v = 0; v < this.viagens.length; v++) {
        const trechos = this.viagens[v].trechos;

        for (let  t = 0; t < trechos.length; t++) {
          await this.delay(this.getRandomInt(500, 1000)).then(() => {
            this.sincronizarComodos(trechos[t].viagem_id, trechos[t].trecho_id);
          });
        }
      }
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms));
  }

  public async sincronizarComodos(viagem: any, trecho: any) {
    this.loadingService.present('Sincronizando cômodos');
    return await this.servicePoseidon.getComodosOcupados(trecho, viagem, true).subscribe(comodos => {
      console.log('Comodos:', comodos);
      this.loadingService.dismiss();
    });
  }

  async sincronizarConvenios(embarcacao) {
    this.loadingService.present('Sincronizando convênios: ' + embarcacao.nome);
    return await this.servicePoseidon.getConvenios(embarcacao.id, true).subscribe(convenios => {
      console.log('Convenios: ', convenios);
      this.loadingService.dismiss();
    });
  }
  onLogout() {
    this.DismissClick();
    this.authService.logout();
  }

  onImpressoras() {
    this.DismissClick();
    this.router.navigate(['/impressoras']);
  }
  onConfiguracao() {
    this.DismissClick();
    this.router.navigate(['/configuracao']);
  }

  async DismissClick() {
    await this.popoverController.dismiss();
  }

}
