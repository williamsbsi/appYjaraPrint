import { LoadingController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading = false;

  constructor(public loadingController: LoadingController) { }

  async present(msg: any) {
    this.isLoading = true;
    return await this.loadingController.create({
      message: msg,
      showBackdrop: true,
      duration: 30000,
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });
  }

  async dismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss();
  }
}
