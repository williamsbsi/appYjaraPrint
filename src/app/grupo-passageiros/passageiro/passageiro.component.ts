import { PoseidonService } from 'src/app/api/poseidon.service';
import { Convenio } from './../../models/convenio';
import { Passageiro } from './../../models/passageiro';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-passageiro',
  templateUrl: './passageiro.component.html',
  styleUrls: ['./passageiro.component.scss'],
})
export class PassageiroComponent implements OnInit {

  tpDoc: any;
  optionSelect: any;
  passageiros_form: FormGroup;
  disabledButton: boolean;
  passageiro: Passageiro;
  convenios: Array<Convenio>;
  optionConvenio: Convenio;
  viagem: any;

  constructor(
    public modalController: ModalController,
    private formBuilder: FormBuilder,
    public navParams: NavParams,
    private servicePoseidon: PoseidonService
  ) {
    
  }

  ngOnInit() {
    this.tpDoc = [
      { id: 1, nome: 'RG'},
      { id: 2, nome: 'Título de eleitor'},
      { id: 3, nome: 'Passaporte'},
      { id: 4, nome: 'CNH'},
      { id: 5, nome: 'CPF'},
    ];
    this.passageiro = new Passageiro();
    this.passageiro.cpf = '';
    this.passageiro.nome = '';
    this.passageiro.email = '';
    this.passageiro.nascimento = '';
    this.passageiro.ndoc = '';
    this.passageiro.tdoc = '';

    this.optionConvenio = new Convenio();
    this.optionConvenio.id = 0;
    this.optionConvenio.nome = 'Nenhum';
    this.optionConvenio.desconto =  0;
    this.optionConvenio.checked = true;

    this.passageiro.convenio = this.optionConvenio;
    
    this.optionSelect = this.tpDoc[0];

    //this.convenios = this.navParams.get('convenios');
    this.viagem = this.navParams.get('viagem');
    this.servicePoseidon.getConvenios(this.viagem.embarcacao_id, true).subscribe(convenios => {
      this.convenios = convenios;
      console.log(this.convenios);
      this.convenios.push(this.optionConvenio);
    });

    //this.convenios.push(this.optionConvenio);

    this.disabledButton = false;
    this.passageiros_form = this.formBuilder.group({
      tdoc: new FormControl(this.passageiro.tdoc),
      convenio: new FormControl(this.passageiro.convenio),
      ndoc: new FormControl(this.passageiro.ndoc, Validators.required),
      nome: new FormControl(this.passageiro.nome, Validators.required),
      email: new FormControl(this.passageiro.email, Validators.email),
      nascimento: new FormControl(this.passageiro.nascimento, [Validators.required]),
      telefone: new FormControl(this.passageiro.telefone),
      voucher: new FormControl(this.passageiro.voucher, []),

    });
    this.passageiros_form.get('tdoc').setValue(this.optionSelect.nome);
  }

  async dismissModal() {
    await this.modalController.dismiss(this.passageiro);
  }

  async dismissModal2() {
    await this.modalController.dismiss(null);
  }

  getDoc($event) {
    
    this.optionSelect = $event.target.value;
    this.passageiros_form.get('ndoc').setValue('');
    this.passageiros_form.get('tdoc').setValue(this.optionSelect.nome);
  }

  getConvenio($event) {
    this.passageiro.convenio = $event.target.value;
    this.optionConvenio = $event.target.value;
    this.passageiros_form.get('convenio').setValue($event.target.value);
  }

  onSubmit(passageiro: Passageiro) {
    this.passageiro = passageiro;
    this.dismissModal();
  }

  buscarPassageiro(value) {
    if(value.length > 0){
      this.servicePoseidon.getPassageiro(value, true).subscribe(passageiro => {
        this.passageiro = passageiro;
        this.passageiros_form.get('nome').setValue(passageiro.nome);
        this.passageiros_form.get('email').setValue(passageiro.email);
        this.passageiros_form.get('nascimento').setValue(passageiro.nascimento);
        this.passageiros_form.get('telefone').setValue(passageiro.telefone);
        console.log('Comprador: ', this.passageiro);
      });
    }
  }

}
