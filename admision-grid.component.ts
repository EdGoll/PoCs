import { Component, OnInit, Input } from '@angular/core';
import { AdmisionService } from 'src/app/service/admision.service';
import { Router, NavigationExtras } from '@angular/router';
import { DataStorageService } from 'src/app/service/data-storage.service';
import { EventoIngresoSalida } from 'src/app/model/evento-ingreso-salida';
import { UtilVeh } from 'src/app/common/util-veh';
import { ConfirmationDialogService } from 'src/app/common/confirmation-dialog/confirmation-dialog.service';
import { Observable } from 'rxjs';
import { NotificacionService } from 'src/app/common/notificacion.service';

@Component({
  selector: 'app-admision-grid',
  templateUrl: './admision-grid.component.html'
})
export class AdmisionGridComponent implements OnInit {

  constructor(
    private admisionService: AdmisionService,
    private router: Router,
    private dataStorageService: DataStorageService,
    private confirmationDialogService: ConfirmationDialogService,
    private notificationsService: NotificacionService,
  ) {}

  @Input()
  name: string;

  @Input()
  public admisiones$: Observable<EventoIngresoSalida[]>;

  ngOnInit() {
    // this.admisiones = null;
  }

  irADetalleAdmision(item: EventoIngresoSalida) {

    this.dataStorageService.data = {
      admision: item,
      tipoRevision: (item.nivelInspeccion != null && item.nivelInspeccion.id.trim()) ? item.nivelInspeccion.id.trim() : 0
    };
    this.router.navigate(['ultimos/admision/sid/' + item.idEvento]);
  }

  confirmarAccion(evento: EventoIngresoSalida, accion: string) {
      console.log(UtilVeh.getMensajeConfirmacion(accion));
      this.confirmationDialogService.confirm('SICVE', UtilVeh.getMensajeConfirmacion(accion))
      .then(
        (confirmed) => {
          if (confirmed) {
            if (accion === 'APROBAR') {
              this.enviarAprobar(evento);
            } else if (accion === 'SEC') {
              this.enviarInspeccionSecundaria(evento);
            } else if (accion === 'EXH') {
              this.enviarExhaustiva(evento);
            } else if (accion === 'DERIVAR') {
              this.derivarInspeccion(evento);
            }

            console.log('User confirmed:', confirmed);
          } else {
            console.log('User cancel:', confirmed);
          }
      }
      )
      .catch(() => console.log('El usuario descarto el dialog, es decir hizo clic en ESC o clickeo fuera del dialogo)'));

  }

  pintarFilaSegunEstado(evento: EventoIngresoSalida) {
    return UtilVeh.pintarFilaSegunEstado(evento);
  }

  habilitarBotonEvento(evento: EventoIngresoSalida, botonAccion: string): boolean {
    return UtilVeh.habilitarBotonEvento(evento, botonAccion);
  }

  enviarAprobar(evento: EventoIngresoSalida){
    console.log(evento);
    this.admisionService.accionEventoAdmision(evento, 'APROBAR', null).subscribe(
      resp => {
        console.log(resp);        
        this.notificationsService.notify('success', 'Proceso de Aprobación', 'Se ha realizado correctamente');        
      }, error => {
        console.log(error);
        this.notificationsService.notify('error', 'Proceso de Aprobación', 'Ocurrio un error');
      }
    );
  }

  enviarInspeccionSecundaria(evento: EventoIngresoSalida){
    this.admisionService.accionEventoAdmision(evento, 'SEC', null).subscribe(
      resp => {
        console.log(resp);
      }, error => {
        console.log(error);
      }
    );
  }

  enviarExhaustiva(evento: EventoIngresoSalida){
    this.admisionService.accionEventoAdmision(evento, 'EXH', null).subscribe(
      resp => {
        console.log(resp);
      }, error => {
        console.log(error);
      }
    );
  }

  derivarInspeccion(evento: EventoIngresoSalida){
    this.admisionService.accionEventoAdmision(evento, 'DERIVAR', null).subscribe(
      resp => {
        console.log(resp);
      }, error => {
        console.log(error);
      }
    );
  }


}
