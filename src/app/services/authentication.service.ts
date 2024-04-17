import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

const TOKEN_KEY = 'token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authenticationState = new BehaviorSubject(false);

  constructor(
    private storage: Storage,
    private plt: Platform
  ) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
   }

   checkToken() {
    this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        this.authenticationState.next(true);
      }
    });
  }

    login(resposta, loader) {
      this.storage.set('user', resposta.user).then( () => {
        console.log('user gravado');
        localStorage.setItem('token', resposta.token);
      });
      this.storage.set('embarcacao', resposta.embarcacao).then( () => {
        console.log('embarcacao gravado');
      });
      this.storage.set('embarcacoes', resposta.embarcacoes).then( () => {
        console.log('embarcacoes gravado');
      });
      if (resposta.empresa) {
        this.storage.set('empresa', resposta.empresa).then( () => {
          console.log('empresa gravado');
        });
      }
      if (resposta.agencia) {
        this.storage.set('agencia', resposta.agencia).then( () => {
          console.log('agencia gravado');
        });
      }


      return this.storage.set(TOKEN_KEY, resposta.token).then(() => {
        this.authenticationState.next(true);
        loader.dismiss();
      });
    }

    logout() {
      this.storage.clear().then(() => {
        localStorage.removeItem('token');
        console.log('apagou todo o storage');
        this.authenticationState.next(false);
      });
    }

    isAuthenticated() {
      return this.authenticationState.value;
    }

    getAuthorizationToken() {
      this.storage.get(TOKEN_KEY).then(res => {
        if (res) {
          return res;
        }
      });
    }
  }