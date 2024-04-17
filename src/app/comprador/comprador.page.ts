import { PoseidonService } from 'src/app/api/poseidon.service';
import { Comprador } from './../models/comprador';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comprador',
  templateUrl: './comprador.page.html',
  styleUrls: ['./comprador.page.scss'],
})
export class CompradorPage implements OnInit {

  compradors_form: FormGroup;
  disabledButton: boolean;
  comprador: Comprador;
  estrangeiro: boolean;
  municipios;
  estados;
  estado;
  params;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private servicePoseidon: PoseidonService,
  ) {
      this.comprador = new Comprador();
   }

  ionViewWillEnter() {
    this.disabledButton = false;
  }
  ngOnInit() {
    this.disabledButton = false;
    this.route.params.subscribe(params => {
      console.log(params);
      this.params = params;
    });
    this.compradors_form = this.formBuilder.group({
      estrangeiro: new FormControl(this.comprador.estrangeiro),
      xnome: new FormControl(this.comprador.xnome, Validators.required),
      cpf_cnpj: new FormControl(this.comprador.cpf_cnpj, Validators.required),
      xlgr: new FormControl(this.comprador.xlgr, [Validators.required]),
      nro: new FormControl(this.comprador.nro, [Validators.required]),
      bairro: new FormControl(this.comprador.bairro, [Validators.required]),
      uf: new FormControl(this.estado, [Validators.required]),
      cmun: new FormControl(this.comprador.cmun, [Validators.required]),
    });
    this.servicePoseidon.getEstados(true).subscribe(estados => {
      this.estados = estados;
      console.log(this.estados);
    });
    this.servicePoseidon.getMunicipios('PA', true).subscribe(municipios => {
      this.municipios = JSON.parse(atob(municipios));
      console.log(this.municipios);
    });
  }

  getMunicipio(value) {
    this.servicePoseidon.getMunicipios(value, true).subscribe(municipios => {
      this.municipios = JSON.parse(atob(municipios));
      console.log(this.municipios);
   });
  }
  changeEstrangeiro() {
    console.log('Estrangeiro: ', this.estrangeiro);
    this.estrangeiro = (this.estrangeiro) ? false : true;
    this.compradors_form.get('cpf_cnpj').setValue('');
  }
  onSubmit(comprador) {
    this.disabledButton = true;
    const data = {
      comprador: JSON.stringify(comprador),
    };
    var data1 = Object.assign(data, this.params);

    this.router.navigate(['/confirmacao', data1]);
  }

  buscarComprador(value) {
    this.servicePoseidon.getComprador(value, true).subscribe(comprador => {
      this.comprador = comprador;
      this.compradors_form.get('xnome').setValue(comprador.xnome);
      this.compradors_form.get('xlgr').setValue(comprador.xlgr);
      this.compradors_form.get('nro').setValue(comprador.nro);
      this.compradors_form.get('bairro').setValue(comprador.bairro);
      this.compradors_form.get('uf').setValue(comprador.uf);
      this.compradors_form.get('cmun').setValue(comprador.cmun.toString());
      console.log('Comprador: ', this.comprador);
    });
  }

}
