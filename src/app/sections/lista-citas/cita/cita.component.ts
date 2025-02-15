import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Cita } from '../../../models/cita';

@Component({
  selector: 'app-cita',
  imports: [CommonModule],
  templateUrl: './cita.component.html',
  styleUrl: './cita.component.css'
})
export class CitaComponent {
   
  @Input() cita!: Cita;


  constructor(private router: Router){}

  get isCitasPage() {
    return this.router.url === '/misCitasUsuario';
  }
//idioma 
getFirstLetterOfDay(date: string): string {
  const dayName = new Date(date).toLocaleDateString('es-ES', { weekday: 'long' });
  return dayName.charAt(0).toUpperCase(); 
}

}
