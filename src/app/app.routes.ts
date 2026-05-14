import { Routes } from '@angular/router';
import { ListaPersonajes } from './Componentes/lista-personajes/lista-personajes';
import { DetallePersonaje } from './Componentes/detalle-personajes/detalle-personajes';
import { ListaItems } from './Componentes/lista-items/lista-items';
import { Login } from './Componentes/login/login';
import { Registro } from './Componentes/registro/registro';

import { MisItems } from './Componentes/mis-items/mis-items';
import { MisPersonajes } from './Componentes/mis-personajes/mis-personajes';

import { Perfil } from './Componentes/perfil/perfil';

import { authGuard } from './auth-guard';

export const routes: Routes = [
  { path: '', component: ListaPersonajes },

  { path: 'personajes', component: ListaPersonajes },

  { path: 'personajes/:id', component: DetallePersonaje },

  { path: 'items', component: ListaItems },

  // LOGIN
  { path: 'login', component: Login },

  // REGISTRO
  { path: 'registro', component: Registro },

  // RUTAS PRIVADAS
  {
    path: 'mis-items',
    component: MisItems,
    canActivate: [authGuard],
  },

  {
    path: 'mis-personajes',
    component: MisPersonajes,
    canActivate: [authGuard],
  },

  {
    path: 'perfil',
    component: Perfil,
    canActivate: [authGuard],
  },

  { path: '**', redirectTo: '' },
];