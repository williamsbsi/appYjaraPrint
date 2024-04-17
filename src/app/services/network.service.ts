import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx'
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastController, Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);
 
  constructor(
    private network: Network,
    private toastController: ToastController,
    private plt: Platform
  ) {
    this.plt.ready().then(() => {
      this.initializeNetworkEvents();
      console.log('status network: ', this.network.type);
      let status =  this.network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
      console.log('status : ', status);
      this.status.next(status);
    });
  }
 
  public initializeNetworkEvents() {
 
    this.network.onDisconnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Online) {
        console.log('WE ARE OFFLINE');
        this.updateNetworkStatus(ConnectionStatus.Offline);
      }
    });
 
    this.network.onConnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Offline) {
        console.log('WE ARE ONLINE');
        this.updateNetworkStatus(ConnectionStatus.Online);
      }
    });
  }
 
  private async updateNetworkStatus(status: ConnectionStatus) {
    this.status.next(status);
 
    let connection = status == ConnectionStatus.Offline ? 'Offline' : 'Online';
    let toast = this.toastController.create({
      message: `Você está agora ${connection}`,
      duration: 3000,
      position: 'bottom'
    });
    toast.then(toast => toast.present());
  }
 
  public onNetworkChange(): Observable<ConnectionStatus> {
    return this.status.asObservable();
  }
 
  public getCurrentNetworkStatus(): ConnectionStatus {
    return this.status.getValue();
  }

}

export enum ConnectionStatus {
  Online,
  Offline
}
