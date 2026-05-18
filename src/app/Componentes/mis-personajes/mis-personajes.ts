import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../Servicio/supabase';
import { DialogService } from '../../Servicio/dialog';

import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-mis-personajes',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
  ],
  templateUrl: './mis-personajes.html',
  styleUrl: './mis-personajes.css',
})
export class MisPersonajes implements OnInit {
  misPersonajes: any[] = [];

  constructor(
    private supabaseService: SupabaseService,
    private cd: ChangeDetectorRef,
    private dialogService: DialogService,
  ) {}

  async ngOnInit() {
    await this.cargarMisPersonajes();
  }

  async cargarMisPersonajes() {
    const {
      data: { user },
    } = await this.supabaseService.supabase.auth.getUser();

    if (!user) {
      this.misPersonajes = [];
      return;
    }

    const { data, error } = await this.supabaseService.supabase
      .from('user_personajes')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error(error);
      alert('Error al cargar tus personajes');
      return;
    }

    this.misPersonajes = data || [];
    this.cd.detectChanges();
  }

  async eliminarPersonaje(personaje: any) {
    const confirmado = await this.dialogService.confirmarBorrar(this.getPersonajeName(personaje));

    if (!confirmado) {
      await this.dialogService.mostrarInfo('Operación cancelada');
      return;
    }

    const { data, error } = await this.supabaseService.supabase
      .from('user_personajes')
      .delete()
      .eq('user_id', personaje.user_id)
      .eq('personaje_id', personaje.personaje_id)
      .select();

    console.log('PERSONAJE BORRADO:', data);
    console.log('ERROR:', error);

    if (error) {
      console.error(error);
      await this.dialogService.mostrarError('Error al eliminar personaje');
      return;
    }

    if (!data || data.length === 0) {
      await this.dialogService.mostrarError(
        'No se pudo borrar. Revisa la policy DELETE de user_personajes.',
      );
      return;
    }

    this.misPersonajes = this.misPersonajes.filter(
      (p) => p.personaje_id !== personaje.personaje_id,
    );

    this.cd.detectChanges();

    await this.dialogService.mostrarExito('Personaje eliminado de favoritos');
  }

  getPersonajeImage(personaje: any): string {
    return personaje?.imagen || personaje?.image || '';
  }

  getPersonajeName(personaje: any): string {
    return personaje?.nombre || personaje?.name || 'Sin nombre';
  }

  getPersonajeStatus(personaje: any): string {
    return personaje?.estado || personaje?.status || 'Sin estado';
  }

  getPersonajeSpecies(personaje: any): string {
    return personaje?.especie || personaje?.species || 'Sin especie';
  }

  getPersonajeGender(personaje: any): string {
    return personaje?.genero || personaje?.gender || 'Sin género';
  }
}
