import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Cita } from '../../../models/cita';
import { CitaService } from '../../../services/cita.service';
import { DoctorService } from '../../../services/doctor.service';

@Component({
  selector: 'app-cita',
  imports: [CommonModule],
  templateUrl: './cita.component.html',
  styleUrl: './cita.component.css',
  providers: [CitaService, DoctorService]
})

export class CitaComponent {
  citavotada: boolean = false;
  isModalDetalleCitaActivo: boolean = false;
  isNotDoctor: boolean = false;

  @Input() cita!: Cita;


  constructor(private router: Router, private citaService: CitaService, private doctorService: DoctorService) { }

  get isCitasPage() {
    return this.router.url === '/misCitasUsuario';
  }
  //idioma
  getFirstLetterOfDay(date: string): string {
    const dayName = new Date(date).toLocaleDateString('es-ES', { weekday: 'long' });
    return dayName.charAt(0).toUpperCase();
  }
  cancelarCita(id: number) {
    this.citaService.cancelarCita(id).subscribe();
    window.location.reload(); // refrescando la página para que las citas canceladas desaparezcan
  }

  voto(idDoctor: number, valoracion: boolean) {
    this.doctorService.votarDoctor(idDoctor, valoracion).subscribe(
      doctor => {
        this.citaService.marcarComoVotada(this.cita.id).subscribe(
          cita => {
            window.location.reload();
          }
        );

      }
    );
  }

  // abrirModal(cita: Cita) {
  //     console.log(this.cita);
  //     console.log("abrir modal")
  //     document.body.classList.add('overflow-hidden');
  //     this.isModalDetalleCitaActivo = true;
  //     this.cita = cita;
  // }

  sumarMediaHora(fecha: string): Date {
    const fechaObjeto = new Date(fecha);
    const nuevaFecha = new Date(fechaObjeto);
    nuevaFecha.setMinutes(nuevaFecha.getMinutes() + 30);
    return nuevaFecha;
  }

  // cerrarModal() {
  //   this.isModalDetalleCitaActivo = false;
  //   document.body.classList.remove('overflow-hidden');
  // }
}
