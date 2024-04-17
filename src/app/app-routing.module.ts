import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'confirmacao', canActivate: [AuthGuardService], loadChildren: './confirmacao/confirmacao.module#ConfirmacaoPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'impressoras', canActivate: [AuthGuardService],  loadChildren: './impressoras/impressoras.module#ImpressorasPageModule' },
  { path: 'forma-pagamento',
          canActivate: [AuthGuardService], loadChildren: './forma-pagamento/forma-pagamento.module#FormaPagamentoPageModule' },
  { path: 'configuracao', canActivate: [AuthGuardService], loadChildren: './configuracao/configuracao.module#ConfiguracaoPageModule' },
  { path: 'pagamento', canActivate: [AuthGuardService], loadChildren: './pagamento/pagamento.module#PagamentoPageModule' },
  { path: 'comprador', canActivate: [AuthGuardService], loadChildren: './comprador/comprador.module#CompradorPageModule' },
  { path: 'trechos-viagens',
          canActivate: [AuthGuardService], loadChildren: './trechos-viagens/trechos-viagens.module#TrechosViagensPageModule' },
  { path: 'grupo-passageiros',
          canActivate: [AuthGuardService], loadChildren: './grupo-passageiros/grupo-passageiros.module#GrupoPassageirosPageModule' },
  { path: 'grupo-comodos', canActivate: [AuthGuardService], loadChildren: './grupo-comodos/grupo-comodos.module#GrupoComodosPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
