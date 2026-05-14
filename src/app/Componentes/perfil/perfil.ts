import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../Servicio/supabase';

import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonImg,
  IonLabel,
  IonItem,
  IonList,
  IonSpinner,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonImg,
    IonLabel,
    IonItem,
    IonList,
  ],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  user: any = null;
  avatarUrl: string | null = null;
  loading = false;

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    const { data } = await this.supabaseService.supabase.auth.getUser();
    this.user = data.user;

    if (!this.user) return;

    const { data: perfil } = await this.supabaseService.supabase
      .from('perfiles')
      .select('avatar_url')
      .eq('id', this.user.id)
      .single();

    this.avatarUrl = perfil?.avatar_url ?? null;
  }

  async subirAvatar(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !this.user) return;

    this.loading = true;

    const fileExt = file.name.split('.').pop();
    const filePath = `${this.user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await this.supabaseService.supabase.storage
      .from('avatar')
      .upload(filePath, file, {
        upsert: true,
      });

    if (uploadError) {
      alert(uploadError.message);
      this.loading = false;
      return;
    }

    const { data } = this.supabaseService.supabase.storage.from('avatar').getPublicUrl(filePath);

    const publicUrl = data.publicUrl;

    const { error: dbError } = await this.supabaseService.supabase.from('perfiles').upsert({
      id: this.user.id,
      avatar_url: publicUrl,
      updated_at: new Date(),
    });

    if (dbError) {
      alert(dbError.message);
      this.loading = false;
      return;
    }

    this.avatarUrl = publicUrl + '?t=' + Date.now();
    this.loading = false;
  }
}
