import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cita } from '../../models/cita';
import { Router } from '@angular/router';
import { CitaComponent } from './cita/cita.component';
import { CitaService } from '../../services/cita.service';
import { Usuario } from '../../models/usuario';
import { HttpClientModule } from '@angular/common/http';
import { Doctor } from '../../models/doctor';

@Component({
  selector: 'app-lista-citas',
  standalone: true,
  imports: [CommonModule, CitaComponent, HttpClientModule],
  templateUrl: './lista-citas.component.html',
  styleUrls: ['./lista-citas.component.css'],
  providers: [CitaService]
})
export class ListaCitasComponent implements OnInit {
  @Input() citas: Cita[] = [];
  mostrartodas: boolean = false;
  @Input() mostrarCanceladas: boolean = false;
  @Input() mostrarPasadas: boolean = false;
  usuario: Usuario;
  doctor: Doctor;
  currentDate: Date = new Date();
  cita: Cita;

  @Input() selectedMonth: number = new Date().getMonth();  // Recibe el mes seleccionado

  constructor(private router: Router, private citaService: CitaService) {
    this.mostrartodas = this.router.url.includes('/misCitasUsuario');
    this.usuario = {} as Usuario;
    this.cita = {} as Cita;
    this.doctor = {} as Doctor;
  }

  ngOnInit() {
    const usuarioGuardado = localStorage.getItem('usuario');
    const doctorGuardado = localStorage.getItem('doctor');

    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
      this.cargarCitas();
      // this.cargarCitasActivasUsuario();
      this.actualizarEstadoCitasUsuario();
    } else if (doctorGuardado) {
      this.doctor = JSON.parse(doctorGuardado);
      this.cargarCitas();
      // this.cargarCitasActivasDoctor();
      this.actualizarEstadoCitasDoctor();
    } else {
      console.error('No hay usuario ni doctor logueado');
    }

  }

  // Método para obtener el nombre del mes
  getMonthName(monthIndex: number): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[monthIndex];
  }

  onMonthSelected(month: number) {
    this.selectedMonth = month;
    this.cargarCitas();
    console.log(this.selectedMonth);
  }

  cargarCitas() {
    if (this.usuario) {
      this.citaService.getCitasActivasUsuario(String(this.usuario.id)).subscribe((citas: Cita[]) => {
        this.citas = citas.filter(cita => new Date(cita.fecha).getMonth() === this.selectedMonth);
        console.log("Citas filtradas:", this.citas);
      });
    } 
    if (this.doctor) {
      this.citaService.getCitasDoctor(String(this.doctor.id)).subscribe((citas: Cita[]) => {
        this.citas = citas.filter(cita => new Date(cita.fecha).getMonth() === this.selectedMonth);
        console.log("Citas filtradas:", this.citas);
      });
    }

  }

  actualizarEstadoCitasUsuario() {
    const hoy = new Date();
    hoy.setHours(hoy.getHours() + 1);
    const fechaActual = hoy.toISOString();

    this.citaService.getCitasActivasUsuario(String(this.usuario.id)).subscribe(
      (citas: Cita[]) => {
        citas.forEach(cita => {
          const fechaCita = new Date(cita.fecha);
          fechaCita.setMinutes(fechaCita.getMinutes() + 30);
          const fechaFinCita = fechaCita.toISOString();
          if (fechaFinCita <= fechaActual && cita.estado === 'pendiente') {
            cita.estado = 'terminada';
            this.citaService.actualizarCita(cita).subscribe(
              response => {
                console.log(`Cita ${cita.id} actualizada a terminada`);
              },
              error => {
                console.error(`Error actualizando cita ${cita.id}:`, error);
              }
            );
          }
        });
      },
      error => {
        console.error('Error fetching active appointments:', error);
      }
    );
  }

  actualizarEstadoCitasDoctor() {
    const hoy = new Date();
    hoy.setHours(hoy.getHours() + 1);
    const fechaActual = hoy.toISOString();

    this.citaService.getCitasDoctor(String(this.doctor.id)).subscribe(
      (citas: Cita[]) => {
        citas.forEach(cita => {
          const fechaCita = new Date(cita.fecha);
          fechaCita.setMinutes(fechaCita.getMinutes() + 30);
          const fechaFinCita = fechaCita.toISOString();
          if (fechaFinCita <= fechaActual && cita.estado === 'pendiente') {
            cita.estado = 'terminada';
            this.citaService.actualizarCita(cita).subscribe(
              response => {
                console.log(`Cita ${cita.id} actualizada a terminada`);
              },
              error => {
                console.error(`Error actualizando cita ${cita.id}:`, error);
              }
            );
          }
        });
      },
      error => {
        console.error('Error fetching active appointments:', error);
      }
    );
  }

  cargarCitasActivasUsuario() {

    const hoy = new Date();
    hoy.setHours(hoy.getHours() + 1);
    const fechaActual = hoy.toISOString();

    this.citaService.getCitasActivasUsuario(String(this.usuario.id)).subscribe(
      (citas: Cita[]) => {
        this.citas = citas.filter(cita => {
          const fechaCita = new Date(cita.fecha);
          fechaCita.setMinutes(fechaCita.getMinutes() + 30);
          const fechaFinCita = fechaCita.toISOString();
          return fechaFinCita > fechaActual && new Date(cita.fecha).getMonth() === this.selectedMonth;
        })
          .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

      },
      error => {
        console.error('Error fetching active appointments:', error);
      }

    );

  }

  cargarCitasActivasDoctor() {

    const hoy = new Date();
    hoy.setHours(hoy.getHours() + 1);
    const fechaActual = hoy.toISOString();

    this.citaService.getCitasDoctor(String(this.doctor.id)).subscribe(
      (citas: Cita[]) => {
        this.citas = citas.filter(cita => {
          const fechaCita = new Date(cita.fecha);
          fechaCita.setMinutes(fechaCita.getMinutes() + 30);
          const fechaFinCita = fechaCita.toISOString();
          return fechaFinCita > fechaActual && new Date(cita.fecha).getMonth() === this.currentDate.getMonth() && cita.estado === 'pendiente';
        })
          .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

      },
      error => {
        console.error('Error fetching active appointments:', error);
      }

    );
  }

  cargarCitasCanceladasUsuario() {

    this.citaService.getCitasCanceladasUsuario(String(this.usuario.id)).subscribe(
      (citas: Cita[]) => {
        this.citas = citas.filter((cita) => cita.estado === 'cancelada')
          .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
      }
    )
  }

  cargarCitasCanceladasDoctor() {

    this.citaService.getCitasDoctor(String(this.doctor.id)).subscribe(
      (citas: Cita[]) => {
        this.citas = citas.filter((cita) => cita.estado === 'cancelada')
          .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
      }
    )
  }

  cargarCitasPasadasUsuario() {
    const hoy = new Date();
    hoy.setHours(hoy.getHours() + 1);
    const fechaActual = hoy.toISOString();

    this.citaService.getCitasTerminadoUsuario(String(this.usuario.id)).subscribe(
      (citas: Cita[]) => {
        this.citas = citas.filter(cita => {
          const fechaCita = new Date(cita.fecha).toISOString();
          return fechaCita < fechaActual && new Date(cita.fecha).getMonth() === this.currentDate.getMonth() && cita.estado === 'terminada';
        })
          .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
      }
    )
  }

  cargarCitasPasadasDoctor() {
    const hoy = new Date();
    hoy.setHours(hoy.getHours() + 1);
    const fechaActual = hoy.toISOString();


    this.citaService.getCitasDoctor(String(this.doctor.id)).subscribe(
      (citas: Cita[]) => {
        this.citas = citas.filter(cita => {
          const fechaCita = new Date(cita.fecha).toISOString();
          return fechaCita < fechaActual && new Date(cita.fecha).getMonth() === this.currentDate.getMonth() && cita.estado === 'terminada';
        })
          .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
      }
    )
  }

  get citasMostradas(): Cita[] {
    if (this.mostrarCanceladas) {
      return this.citas.filter((cita) => cita.estado === 'cancelada');
    } if (this.mostrarPasadas) {
      return this.citas.filter((cita) => cita.estado === 'terminada');
    } else {
      const filtrarCitas = this.citas.filter(cita => {
        const fechaCita = new Date(cita.fecha);
        return fechaCita.getMonth() === this.selectedMonth;
      });

      return this.mostrartodas ? filtrarCitas : filtrarCitas.slice(0, 5);
    }
  }

  getCurrentMonthYear(): string {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      year: 'numeric'
    };
    const formattedDate = this.currentDate.toLocaleString('es-ES', options);
    return this.capitalizeFirstLetter(formattedDate);
  }

  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


}