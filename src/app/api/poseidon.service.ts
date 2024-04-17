import { Convenio } from './../models/convenio';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Passageiro } from '../models/passageiro';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { NetworkService, ConnectionStatus } from '../services/network.service';
import { OfflineManagerService } from '../services/offline-manager.service';

import { Imprimir } from '../printer/Imprimir';
import { Comodo } from '../models/comodo';

const API_STORAGE_KEY = 'specialkey-jyara';

@Injectable({
  providedIn: 'root'
})
export class PoseidonService {

  poseidonUrl = 'https://yjaraviagens.com/api/';
  //poseidonUrl = 'http://yjara.desenv.br/api/';
  //poseidonUrl = 'http://10.0.1.120/yjara/public/api/';
  //poseidonUrl = 'https://homologacao.yjaraviagens.com/api/';  

  constructor(
    private http: HttpClient,
    public alertController: AlertController,
    private networkService: NetworkService,
    private storage: Storage,
    private offlineManager: OfflineManagerService,
    public imprimir: Imprimir
  ) {
  }

  login(credenciais: any): Observable<any> {
    console.log('credencias: ', credenciais);
    return this.http.post(this.poseidonUrl + 'login', credenciais)
    .pipe(
      catchError(this.handleError('login', []))
    );
  }

  setReservaComodo(data: any): Observable<any> {
    const url = this.poseidonUrl + 'reserva-comodos';
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
      return from(this.offlineManager.storeRequest(url, 'POST', data));
    } else {
      return this.http.post(url, data)
      .pipe(
        catchError(err => {
          console.log(err);
          throw new Error(err);
        })
      );
    }
  }


  setPassagemNovo(data: any, nVia: number, empresa: any): Observable<any> {
    const url = this.poseidonUrl + 'passageiro-viagem-novo';
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {

      let i = 0;
      while (i < nVia) {
        this.imprimir.print(data, null, empresa);
        i++;
      }

      return from(this.offlineManager.storeRequest(url, 'POST', data));
    } else {
        return this.http.post(url, data)
      .pipe(
        catchError(err => {
          let i = 0;
          while (i < nVia) {
            this.imprimir.print(data, null, empresa);
            i++;
          }

          this.offlineManager.storeRequest(url, 'POST', data);
          console.log(err);
          throw new Error(err);
        })
      );
    }
  }
  getConvenios(idEmbarcacao, forceRefresh: boolean = false): Observable<any[]> {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline || !forceRefresh) {
      return from(this.getLocalData('convenios-' + idEmbarcacao));
    } else {
      return this.http.get<Convenio[]>(this.poseidonUrl + 'convenios?idEmbarcacao=' + idEmbarcacao)
        .pipe(
          tap(convenios => {
            console.log('res convenios online:', convenios);
            this.setLocalData('convenios-' + idEmbarcacao, convenios);
          }),
          catchError(this.handleError('getConvenios', []))
      );
    }
  }

  
  getMunicipios(value, forceRefresh: boolean = false): Observable<any> {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline || !forceRefresh) {
      return from(this.getLocalData('municipios?q=' + value));
    } else {
      return this.http.get<any>(this.poseidonUrl + 'municipios?q=' + value)
        .pipe(
          tap(municipios => {
            console.log('res municipios online:', municipios);
            this.setLocalData('municipios?q=' + value, municipios);
          }),
          catchError(this.handleError('getMunicipios', []))
        );
    }
  }
  getEstados(forceRefresh: boolean = false): Observable<any[]> {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline || !forceRefresh) {
      return from(this.getLocalData('estados'));
    } else {
      return this.http.get<any[]>(this.poseidonUrl + 'estados')
        .pipe(
          tap(municipios => {
            console.log('res estados online:', municipios);
            this.setLocalData('estados', municipios);
          }),
          catchError(this.handleError('getEstados', []))
        );
    }
  }

  getTrechosViagens(forceRefresh: boolean = false, page: number): Observable<any> {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline || !forceRefresh) {
      return from(this.getLocalData('trechos-viagens?page=' + page));
    } else {
      return this.http.get<any>(this.poseidonUrl + 'trechos-viagens?page=' + page)
        .pipe(
          tap(trechos => {
            console.log('res trechos online:', trechos);
            this.setLocalData('trechos-viagens?page=' + page, trechos);
        }),
        catchError(this.handleError('getTrechos', []))
      );
    }
  }

  getComodosOcupados(trecho: any, viagem: any, embarcacao: any, forceRefresh: boolean = false): Observable<any[]> {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline || !forceRefresh) {
      return from(this.getLocalData('comodosOcupados/' + trecho + '/' + viagem+'/'+embarcacao));
    } else {
      return this.http.get<Comodo[]>(this.poseidonUrl + 'comodos-ocupados/' + trecho + '/' + viagem)
        .pipe(
          tap(comodos => {
            /*console.log('res comodos ocupados online:', comodos);*/
            this.setLocalData('comodosOcupados/' + trecho + '/' + viagem+'/'+embarcacao, comodos);
        }),
        catchError(this.handleError('getComodosOcupados/' + trecho + '/' + viagem, []))
      );
    }
  }


  getPassageiro(cpf: any, forceRefresh: boolean = false): Observable<Passageiro> {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline || !forceRefresh) {
      console.log('off Passageiro');
      return from(this.getLocalData('passageiros/' + cpf));
    } else {
      console.log('on Passageiro');
      return this.http.get<Passageiro>(this.poseidonUrl + 'passageiros/' + cpf).pipe(
        tap(res => {
          console.log('res passageiro online:', res);
          this.setLocalData('passageiros/' + cpf, res);
        })
      );
    }
  }

  getComprador(value: any, forceRefresh: boolean = false): Observable<any> {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline || !forceRefresh) {
      console.log('off Comprador');
      return from(this.getLocalData('comprador/' + value));
    } else {
      console.log('on Comprador');
      return this.http.get<any>(this.poseidonUrl + 'comprador/' + value).pipe(
        tap(res => {
          console.log('res comprador online:', res);
          this.setLocalData('comprador/' + value, res);
        })
      );
    }
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      subHeader: 'Mensagem de Erro',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(operation + ' failed: ' + error.message);
      this.presentAlert(error.message);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  // Save result of API requests
  private setLocalData(key, data) {
    this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
  }

  // Get cached API result
  private getLocalData(key) {
    return this.storage.get(`${API_STORAGE_KEY}-${key}`);
  }

}
