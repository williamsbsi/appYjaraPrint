import { AuthenticationService } from './../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PoseidonService } from '../api/poseidon.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  message;
  loader;
  constructor(
    private servicePoseidon: PoseidonService,
    public formBuilder: FormBuilder,
    private router: Router,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private authService: AuthenticationService,
  ) { }

  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }
  async presentToastWithOptions(message) {
    this.message = message;
    const toast = await this.toastController.create({
      message: this.message,
      showCloseButton: true,
      position: 'bottom',
      closeButtonText: 'Ok',
      color: 'danger',
    });
    toast.present();
  }

  async onSubmit(value: any) {
    this.loader = await this.loadingController.create({
      message: 'Autenticando...',
    });
    await this.loader.present();
    console.log(value);
    this.servicePoseidon.login(value).subscribe(res => {
      console.log('Resposta:', res);
      if (res.success) {
        this.authService.login(res.success, this.loader);

        this.router.navigate(['/trechos-viagens']);
      } else if (res.error) {
        this.presentToastWithOptions(res.error);
        this.loader.dismiss();
      }
    }, (err) => {
      this.loader.dismiss();
      this.presentToastWithOptions(err.error);
      console.log('error 1: ', err);
    });
  }
}

