import { BrMaskerModule } from 'br-mask';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PagamentoPage } from './pagamento.page';

const routes: Routes = [
  {
    path: '',
    component: PagamentoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrMaskerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PagamentoPage]
})
export class PagamentoPageModule {}
