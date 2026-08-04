import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { DashboardComponent } from './admin/dashboard/dashboard';
import { notAuthGuard } from './auth/guards/not-auth.guard';
import { authGuard } from './auth/guards/auth.guard';
import { AdminLayoutComponent } from './admin/layout/admin-layout/admin-layout';
import { InicioComponent } from './admin/inicio/inicio';
import { ConfiguracionComponent } from './admin/configuracion/configuracion';
import { CompartirComponent } from './admin/compartir/compartir';
import { FormularioPedidoComponent } from './public/formulario-pedido/formulario-pedido';
import { GestionEnviosComponent } from './admin/envios/gestion-envios/gestion-envios';
import { DatosPublicosComponent } from './admin/configuracion/datos-publicos/datos-publicos';
import { SeguridadComponent } from './admin/configuracion/seguridad/seguridad';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login', 
    component: LoginComponent,
    canActivate: [notAuthGuard]
  },
  {
    path: 'form/:marca',
    component: FormularioPedidoComponent
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: InicioComponent },
      { 
        path: 'configuracion', 
        children: [
          { path: '', redirectTo: 'datos-publicos', pathMatch: 'full' },
          { path: 'datos-publicos', component: DatosPublicosComponent },
          { path: 'seguridad', component: SeguridadComponent }
        ]
      },
      { 
        path: 'envios', 
        children: [
          { path: '', redirectTo: 'shalom', pathMatch: 'full' },
          { path: 'shalom', component: GestionEnviosComponent },
          { path: 'olva', component: GestionEnviosComponent },
          { path: 'delivery', component: GestionEnviosComponent }
        ]
      },
      { path: 'compartir', component: CompartirComponent }
    ]
  }
];