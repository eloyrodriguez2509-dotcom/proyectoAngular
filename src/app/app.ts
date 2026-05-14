import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from './Servicio/supabase';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {

  menuOpen = false;
  user: any = null;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    const { data } = await this.supabaseService.supabase.auth.getSession();

    this.user = data.session?.user ?? null;

    this.supabaseService.supabase.auth.onAuthStateChange((_event, session) => {
      this.user = session?.user ?? null;
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  async logout() {
    await this.supabaseService.supabase.auth.signOut();
    this.user = null;
    this.closeMenu();
    this.router.navigate(['/login']);
  }
}