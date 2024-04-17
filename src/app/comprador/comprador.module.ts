import { BrMaskerModule } from 'br-mask';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CompradorPage } from './comprador.page';

const routes: Routes = [
  {
    path: '',
    component: CompradorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BrMaskerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CompradorPage]
})
export class CompradorPageModule {}
