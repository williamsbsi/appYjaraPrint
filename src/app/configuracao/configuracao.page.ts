import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.page.html',
  styleUrls: ['./configuracao.page.scss'],
})
export class ConfiguracaoPage implements OnInit {

  lPapel: string;
  constructor(
    public toastController: ToastController,
  ) { }

  ngOnInit() {
    this.lPapel = localStorage.getItem('lPapel');
  }

  onSalvar() {
    localStorage.setItem('lPapel', this.lPapel);
    this.presentToastWithOptions();
  }

  async presentToastWithOptions() {
    
    const toast = await this.toastController.create({
      message: 'Configuração salva!',
      showCloseButton: true,
      position: 'top',
      duration: 2000,
      closeButtonText: 'Ok',
    });
    toast.present();
  }

}
