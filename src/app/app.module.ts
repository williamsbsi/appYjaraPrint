import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';


import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { MoreMenuComponent } from './trechos-viagens/more-menu/more-menu.component';
import { PassageiroComponent } from './grupo-passageiros/passageiro/passageiro.component';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { BrMaskerModule } from 'br-mask';
import { IonicStorageModule } from '@ionic/storage';



import { HideHeaderDirective } from './directives/hide-header.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { InterceptorService } from './interceptor.service';
import { Network } from '@ionic-native/network/ngx';



@NgModule({
  declarations: [AppComponent, PassageiroComponent, MoreMenuComponent],
  entryComponents: [PassageiroComponent, MoreMenuComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    BrMaskerModule,
    ReactiveFormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BluetoothSerial,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    Network
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
