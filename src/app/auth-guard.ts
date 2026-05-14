import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from './Servicio/supabase';

export const authGuard: CanActivateFn = async () => {

  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  const { data } = await supabaseService.supabase.auth.getSession();

  if (data.session) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};