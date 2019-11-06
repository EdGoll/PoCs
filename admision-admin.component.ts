import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdmisionService } from 'src/app/service/admision.service';
import { Router, NavigationExtras } from '@angular/router';
import { DataStorageService } from 'src/app/service/data-storage.service';
import { EventoIngresoSalida } from 'src/app/model/evento-ingreso-salida';
import { Subscription, BehaviorSubject, interval, Observable } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-admision-admin',
  templateUrl: './admision-admin.component.html',
  providers: [AdmisionService]
})
export class AdmisionAdminComponent implements OnInit, OnDestroy {

  public admisiones: Array<EventoIngresoSalida>;
  public patenteInput: string;
  // listados para cada tipo de pestaña
  public solicitudes: Array<EventoIngresoSalida>;
  public primarias: Array<EventoIngresoSalida>;
  public secundarias: Array<EventoIngresoSalida>;
  public exhaustivas: Array<EventoIngresoSalida>;
  public resultados: Array<EventoIngresoSalida>;

  // Observables para cada tipo de pestaña
  public solicitudes$ = new BehaviorSubject([]) as BehaviorSubject<EventoIngresoSalida[]>;
  public primarias$ = new BehaviorSubject([]) as BehaviorSubject<EventoIngresoSalida[]>;
  public secundarias$ = new BehaviorSubject([]) as BehaviorSubject<EventoIngresoSalida[]>;
  public exhaustivas$ = new BehaviorSubject([]) as BehaviorSubject<EventoIngresoSalida[]>;
  public resultados$ = new BehaviorSubject([]) as BehaviorSubject<EventoIngresoSalida[]>;

  // Parametros para actualizar automaticamente
  private subGeneral: Subscription;
  checkeado = true;
  interval$: BehaviorSubject<number> = new BehaviorSubject<number>(30000);
  // Variable para permitir refreso de grilla
  admisiones$: Observable<EventoIngresoSalida[]>;

  constructor(
    private admisionService: AdmisionService,
    private router: Router,
    private dataStorageService: DataStorageService
  ) {

  }

  ngOnInit() {
    this.obtenerAdmisiones();
    // this.admisiones$ = this.admisionService.admisiones;
    this.subGeneral = this.cargarAutomaticamenteGrilla().subscribe( resp => {
      if(this.checkeado){
        console.log('llamando periodicamente');
        this.obtenerAdmisiones();
      }
    }, error => {
      this.setInterval(100000000000);
    });
  }

  ngOnDestroy(){
    this.subGeneral.unsubscribe();
  }

  setInterval(newInterval: number){
    this.interval$.next(newInterval);
  }

  cargarAutomaticamenteGrilla(){
    return this.interval$.pipe(
      switchMap((periodo: number) => interval(periodo)), startWith(0)
    );
  }

  obtenerAdmisiones() {
    this.admisionService.getUltimosMovimientosAdmision().subscribe(
      response => {
        // console.log(response);
        if (response) {
          this.admisiones = response;
          this.crearArregloPorEstado(response);
        }
      },
      error => {
        console.log('error:' + error as any);
      }
    );


  }

  irADetalleAdmision(item: EventoIngresoSalida) {

    this.dataStorageService.data = {
      admision: item
    };
    this.router.navigate(['ultimos/admision/sid/' + item.idEvento]);
  }

  buscarPatente() {
    this.dataStorageService.data = {
      patenteInput: this.patenteInput
    };
    this.router.navigate(['ultimos/consultas/patente/' + this.patenteInput]);
  }


  private crearArregloPorEstado(admisiones: EventoIngresoSalida[]) {

    // console.log('ENTRE A  crearArregloPorEstado' );
    // console.log('data recibida:' + admisiones);
    this.solicitudes = [];
    this.primarias = [];
    this.secundarias = [];
    this.exhaustivas = [];
    this.resultados = [];

    this.solicitudes = admisiones;

    for (let adm of admisiones) {

      if (adm.estadoAutorizacion.id.trim() === 'OT'
          || adm.estadoAutorizacion.id.trim() === 'RE'
          || adm.estadoAutorizacion.id.trim() === 'CA') {
        this.resultados.push(adm);
      } else{

      if (adm.nivelInspeccion != null && adm.nivelInspeccion.id.trim() === 'P') {
        if (adm.estadoAutorizacion.id.trim() === 'PA'
          || adm.estadoAutorizacion.id.trim() === 'OB'
          || adm.estadoAutorizacion.id.trim() === 'AS') {
          this.primarias.push(adm);
        }
      }
      if (adm.nivelInspeccion != null && adm.nivelInspeccion.id.trim() === 'S') {
        if (adm.estadoAutorizacion.id.trim() === 'OB'
        || adm.estadoAutorizacion.id.trim() === 'AS') {
          this.secundarias.push(adm);
        }
      }
      if (adm.nivelInspeccion != null && adm.nivelInspeccion.id.trim() === 'E') {
        if (adm.estadoAutorizacion.id.trim() === 'AS') {
          this.exhaustivas.push(adm);
        }
      }
    }
   }
    this.solicitudes$.next(this.solicitudes);
    this.primarias$.next(this.primarias);
    this.secundarias$.next(this.secundarias);
    this.exhaustivas$.next(this.exhaustivas);
    this.resultados$.next(this.resultados);
    // console.log("solicitudes:" + this.solicitudes);
    // console.log('primarias:' + this.primarias);
    // console.log('secundarias:' + this.secundarias);
    // console.log('exhaustiva:' + this.exhaustivas);
    // console.log("resultados:" + this.resultados);

  }
}
