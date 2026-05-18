import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

export interface Item {
  id?: string;
  description: string;
  image?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  public supabase: SupabaseClient;

  user: User | null = null;

  constructor() {
    this.supabase = createClient(
      'https://wuvdcymnnndwotgfubyz.supabase.co',
      'sb_publishable_83gUl4TmfsEAs3ozCv6gdg_VpbVNCtk',
    );

    // Obtener usuario actual
    this.supabase.auth.getUser().then(({ data }) => {
      this.user = data.user;
    });

    // Escuchar cambios de sesión
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.user = session?.user ?? null;
    });
  }

  // REGISTRO
  async signUp(email: string, password: string) {
    return await this.supabase.auth.signUp({
      email,
      password,
    });
  }

  // LOGIN
  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  // LOGOUT
  async signOut() {
    await this.supabase.auth.signOut();
  }

  // VERIFICAR SI HAY USUARIO LOGUEADO
  isLoggedIn(): boolean {
    return this.user !== null;
  }

  // LEER todos los items
  async getItems(): Promise<Item[]> {
    const { data, error } = await this.supabase.from('items').select('id, description, image');

    console.log('DATA SUPABASE ITEMS:', data);
    console.log('ERROR SUPABASE ITEMS:', error);

    if (error) {
      alert(error.message);
      return [];
    }

    return data as Item[];
  }

  // LEER un item por id
  async getItemById(id: string): Promise<Item | null> {
    const { data, error } = await this.supabase.from('items').select('*').eq('id', id).single();

    if (error) {
      console.error('Error leyendo item:', error);
      return null;
    }

    return data as Item;
  }

  // CREAR item
  async createItem(description: string): Promise<Item | null> {
    const { data, error } = await this.supabase
      .from('items')
      .insert([{ description }])
      .select()
      .single();

    if (error) {
      console.error('Error creando item:', error);
      return null;
    }

    return data as Item;
  }

  // ACTUALIZAR item
  async updateItem(id: string, description: string): Promise<Item | null> {
    const { data, error } = await this.supabase
      .from('items')
      .update({ description })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error actualizando item:', error);
      return null;
    }

    return data as Item;
  }

  // BORRAR item
  async deleteItem(id: string): Promise<boolean> {
    const { error } = await this.supabase.from('items').delete().eq('id', id);

    if (error) {
      console.error('Error borrando item:', error);
      return false;
    }

    return true;
  }

  async deleteUserItem(id: string): Promise<boolean> {
    const { data, error } = await this.supabase.from('user_items').delete().eq('id', id).select();

    console.log('FAVORITO BORRADO:', data);
    console.log('ERROR BORRANDO FAVORITO:', error);

    if (error) {
      console.error('Error borrando favorito:', error);
      return false;
    }

    return !!data && data.length > 0;
  }

  async deleteUserPersonaje(id: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('user_personajes')
      .delete()
      .eq('id', id)
      .select();

    console.log('PERSONAJE BORRADO:', data);
    console.log('ERROR BORRANDO PERSONAJE:', error);

    if (error) {
      console.error('Error borrando personaje:', error);
      return false;
    }

    return !!data && data.length > 0;
  }
}
