import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/inicio',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./pages/cadastro/cadastro.page').then( m => m.CadastroPage)
  },
  {
    path: 'detalhes/:id',
    loadComponent: () => import('./pages/detalhes/detalhes.page').then( m => m.DetalhesPage),
    canActivate: [authGuard]
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then( m => m.TabsPage),
    canActivate: [authGuard], // Protege todas as rotas filhas do 'tabs'
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('./pages/inicio/inicio.page').then( m => m.InicioPage)
      },
      {
        path: 'perfil',
        loadComponent: () => import('./pages/perfil/perfil.page').then( m => m.PerfilPage)
      },
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'produtos',
    loadComponent: () => import('./pages/produtos/produtos.page').then( m => m.ProdutosPage),
    canActivate: [authGuard]
  },
  {
    path: 'configuracoes',
    loadComponent: () => import('./pages/configuracoes/configuracoes.page').then( m => m.ConfiguracoesPage),
    canActivate: [authGuard]
  }
];
