import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LeftNavComponent } from "../../navs/left-nav/left-nav.component";
import { SecundaryNavComponent } from "../../navs/secundary-nav/secundary-nav.component";
import { NearbyDoctorsComponent } from "../../nearby-doctors/nearby-doctors/nearby-doctors.component";
import { NearbyDoctorsDisabledComponent } from "../../nearby-doctors/nearby-doctors-disabled/nearby-doctors-disabled.component";
import { FooterConmponent } from "../../footer/footer.component";
import { ListaCitasComponent } from "../../sections/lista-citas/lista-citas.component";
import { BanerComponent } from '../../sections/baner/baner.component';
import { DoctoresRecomendadosComponent } from "../../sections/doctores-recomendados/doctores-recomendados.component";
import { Usuario } from '../../models/usuario';
import { Cita } from '../../models/cita';
import { CitaService } from '../../services/cita.service';
import { Doctor } from '../../models/doctor';
import { FindNavComponent } from "../../navs/find-nav/find-nav.component";



@Component({
  selector: 'app-index-after-login',
  imports: [LeftNavComponent, SecundaryNavComponent, BanerComponent, NearbyDoctorsComponent, NearbyDoctorsDisabledComponent, FooterConmponent, ListaCitasComponent, DoctoresRecomendadosComponent],
  templateUrl: './index-after-login.component.html',
  styleUrl: './index-after-login.component.css',
  providers: [CitaService]
})
export class IndexAfterLoginComponent implements OnInit{
  isNerbyDoctorsAvailable = false;
  usuario: Usuario;
  doctoresDeBusqueda: Doctor[] = [];
  doctoresCercanos: Doctor[] = [];
  

  constructor(private router: Router, private citaService: CitaService) {
    this.usuario = {} as Usuario;
  }

  ngOnInit() {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
      this.citaService.getCitasActivasUsuario(String(this.usuario.id)).subscribe(
        (citas: Cita[]) => {
          //console.log('Citas del usuario:', citas);
      });
    }


  }

  cambiarEstado() {
    this.isNerbyDoctorsAvailable = true; // Cambiamos la variable a true
  }

  navegativeToMisCitas(usuarioId: number) {
      this.router.navigate(['/misCitasUsuario', usuarioId]);
  }

  recibirDoctoresDeBusqueda(doctores: Doctor[]) {
    this.isNerbyDoctorsAvailable = false;
    this.doctoresDeBusqueda = doctores;
    //console.log('Doctores recibidos de find-nav:', doctores);
  }

  recibirDoctoresCercanos(doctores: Doctor[]) {
    this.doctoresCercanos = doctores;
    //console.log('Doctores recibidos de nearby:', doctores);
  }

}
