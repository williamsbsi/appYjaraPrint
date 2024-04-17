import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FormaPagamentoPage } from './forma-pagamento.page';

const routes: Routes = [
  {
    path: '',
    component: FormaPagamentoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FormaPagamentoPage]
})
export class FormaPagamentoPageModule {}
