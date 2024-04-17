import { HideHeaderDirective } from './../directives/hide-header.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConfirmacaoPage } from './confirmacao.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmacaoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ConfirmacaoPage]
})
export class ConfirmacaoPageModule {}
