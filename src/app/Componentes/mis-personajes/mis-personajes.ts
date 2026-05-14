import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SupabaseService } from '../../Servicio/supabase';

import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonImg,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-mis-personajes',
  standalone: true,
  imports: [CommonModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg],
  templateUrl: './mis-personajes.html',
  styleUrl: './mis-personajes.css',
})
export class MisPersonajes implements OnInit {
  misPersonajes: any[] = [];

  constructor(
    private supabaseService: SupabaseService,
    private cd: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    await this.cargarMisPersonajes();
  }

  async cargarMisPersonajes() {
    const { data, error } = await this.supabaseService.supabase.from('user_personajes').select('*');

    if (error) {
      console.error(error);

      alert('Error al cargar tus personajes');

      return;
    }

    this.misPersonajes = data || [];

    this.cd.detectChanges();
  }
}
