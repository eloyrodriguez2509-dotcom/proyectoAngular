import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PersonajeService } from '../../Servicio/personajes';

import {
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonImg,
  IonButton,
  IonChip,
  IonLabel
} from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-detalle-personaje',
  imports: [
    CommonModule,
    RouterLink,

    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonImg,
  ],
  templateUrl: './detalle-personajes.html',
  styleUrls: ['./detalle-personajes.css']
})
export class DetallePersonaje implements OnInit {

  personaje: any;
  id: string | null = '';

  constructor(
    private route: ActivatedRoute,
    private personajeService: PersonajeService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {

      this.id = params.get('id');

      if (this.id) {

        this.personaje = null;

        this.personajeService
          .getPersonajePorId(this.id)
          .subscribe(data => {

            this.personaje = data;

            this.cd.detectChanges();
          });
      }
    });
  }
}