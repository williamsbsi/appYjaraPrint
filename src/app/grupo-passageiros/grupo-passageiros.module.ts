import { BrMaskerModule } from 'br-mask';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GrupoPassageirosPage } from './grupo-passageiros.page';

const routes: Routes = [
  {
    path: '',
    component: GrupoPassageirosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrMaskerModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GrupoPassageirosPage]
})
export class GrupoPassageirosPageModule {}
