import { Router } from '@angular/router';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';

import { RasterMode, Position, QRErrorCorrectLevel, Barcode, CodeTable, PDF417Type } from './../printer/Commands';
import Printer from './../printer/Printer';
import { Console } from '../printer/Adapters';
import { Font, Justification, TextMode } from '../printer/Commands';
import Image from '../printer/Image';

@Component({
  selector: 'app-impressoras',
  templateUrl: './impressoras.page.html',
  styleUrls: ['./impressoras.page.scss'],
})
export class ImpressorasPage implements OnInit {

  pairedList: Pairedlist;
  listToggle = false;
  pairedDeviceID = 0;
  dataSend: any = '';

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private bluetoothSerial: BluetoothSerial,
    private toastCtrl: ToastController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.checkBluetoothEnabled();
  }
  checkBluetoothEnabled() {
    this.bluetoothSerial.isEnabled().then(success => {
      this.listPairedDevices();
    }, error => {
      this.showError('Por favor, ative o Bluetooth');
    });
  }

  listPairedDevices() {
    this.bluetoothSerial.list().then(success => {
      this.pairedList = success;
      this.listToggle = true;
    }, error => {
      this.showError('Por favor, ative o Bluetooth');
      this.listToggle = false;
    });
  }

  selectDevice() {
    const connectedDevice = this.pairedList[this.pairedDeviceID];
    if (!connectedDevice.address) {
      this.showError('Selecione o dispositivo emparelhado para conectar');
      return;
    }
    const address = connectedDevice.address;
    const name = connectedDevice.name;

    this.connect(address);
  }

  connect(address) {
    // Attempt to connect device with specified address, call app.deviceConnected if success
    this.bluetoothSerial.connect(address).subscribe(success => {
      this.deviceConnected();
      this.showToast('Conectado com sucesso');
    }, error => {
      this.showError('Erro: Conectando dispositivo');
    });
  }

  deviceConnected() {
    // Subscribe to data receiving as soon as the delimiter is read
    this.bluetoothSerial.subscribe('\n').subscribe(success => {
      this.handleData(success);
      this.showToast('Conectado com sucesso');
    }, error => {
      this.showError(error);
    });
  }

  deviceDisconnected() {
    // Unsubscribe from data receiving
    this.bluetoothSerial.disconnect();
    this.showToast('Dispositivo desconectado');
  }

  handleData(data) {
    this.showToast(data);
  }

  async sendData() {

    const adapter = new Console(console.log, 64);
    const printer = await new Printer(adapter).open();
    const image = await Image.load("http://i.imgur.com/uJUPbC3.png");

    await printer.init()
       .setFont(Font.C)
       .setJustification(Justification.Center)
       .raster(image, RasterMode.Normal)
       //.setTextMode(TextMode.DualWidthAndHeight)
       .writeLine("Programação é")
       .setTextMode(TextMode.Normal)
       .setJustification(Justification.Left)
       .writeLine("Some normal text ção é")
       .barcode("1234567890123", Barcode.EAN13, 50, 2, Font.A, Position.Below)
       .writeLine('pdf417 çãpo é');
       
       await printer.pdf417('Williams');

       await printer.writeLine('qrCode')
       .qr("We can put all kinds of cool things in these...", QRErrorCorrectLevel.M, 8)
       .feed(4)
       .cut();
       //.close()
       //.then(() => console.log("Done printing..."));

    const output = await printer.flushReturn();
    console.log('output: ', output);

    this.bluetoothSerial.write(output).then(success => {
      this.showToast(success);
    }, error => {
      this.showError(error);
    });
  }

  async convertDataURIToBinary() {
    var BASE64_MARKER = ';base64,';
    //var dataURI = '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';
    var dataURI = 'data:image/png;base64,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';
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    console.log('base64Index',base64Index);
    var base64 = dataURI.substring(base64Index);
    console.log('base64',base64);
    var raw = atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for(let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    console.log('array: ', array);
    
    const adapter = new Console(console.log, 64);
    const printer = await new Printer(adapter).open();
    //const image = await Image.load(dataURI);

    await printer.init()
       .setFont(Font.A)
       
       .setJustification(Justification.Center)
       //.raster(image, RasterMode.Normal)
       //.setTextMode(TextMode.DualWidthAndHeight)
       .writeLine("Programação é")
       .setTextMode(TextMode.Normal)
       .setJustification(Justification.Left)
       .writeLine("Some normal text ção é")
       .barcode("1234567890123", Barcode.EAN13, 50, 2, Font.A, Position.Below)
       .writeLine('pdf417 çãpo é');
       
       await printer.pdf417('Williams');

       await printer.writeLine('qrCode')
       .qr("We can put all kinds of cool things in these...", QRErrorCorrectLevel.M, 8)
       .write(array)
       .feed(4)
       .cut();
       //.close()
       //.then(() => console.log("Done printing..."));

    const output = await printer.flushReturn();
    console.log('output: ', output);

    this.bluetoothSerial.write(output).then(success => {
      this.showToast(success);
    }, error => {
      this.showError(error);
    });
    //return array;

}

  async showError(error) {
    const alert = await this.alertCtrl.create({
      header: 'Erro',
      message: error,
      buttons: ['ok']
    });
    return await alert.present();
  }

  async showToast(msj) {
    const toast = await this.toastCtrl.create({
      message: msj,
      duration: 1000
    });
    toast.present();

  }

  onVoltar() {
    this.router.navigate(['/trechos-viagens']);
  }
}

interface Pairedlist {
  'class': number;
  'id': string;
  'address': string;
  'name': string;
}
