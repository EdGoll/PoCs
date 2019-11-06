import { EventoIngresoSalida } from '../model/evento-ingreso-salida';
import { IHash } from '../model/i-hash';

export abstract class UtilVeh {

  public myhash: IHash = {};

  public static getMensajeConfirmacion(key: string): string{

    let myhash: IHash = {};
    myhash['AUTORIZAR'] = '¿Confirma autorizar evento?';
    myhash['APROBAR'] = '¿Confirma aprobar evento?';
    myhash['DERIVAR'] = '¿Confirma derivar a inspección externa?';
    myhash['REC'] = '¿Confirma rechazar evento?';
    myhash['SEC'] = '¿Confirma derivar a inspección secundaria?';
    myhash['EXH'] = '¿Confirma derivar a inspección exhaustiva?';
/*
= [
    { key: 'AUTORIZAR', value: '¿Confirma autorizar evento?' },
    { key: 'APROBAR', value: '¿Confirma aprobar evento?' },
    { key: 'DERIVAR', value: '¿Confirma derivar a inspecci&oacute;n externa?' },
    { key: 'SEC', value: '¿Confirma derivar a inspecci&oacute;n secundaria?' },
    { key: 'EXH', value: '¿Confirma derivar a inspecci&oacute;n exhaustiva?' }
  ];
*/
    return myhash[key];
  }

  public static pintarFilaSegunEstado(evento: EventoIngresoSalida) {

    if (evento.tipoEvento.id.trim() === 'I') {

      // EVENTOS DE ADMISION

      if (evento.estadoAutorizacion.id.trim() === 'OT') {
        return '#c6e0b4'; // verde
      }
      if (evento.estadoAutorizacion.id.trim() === 'RE') {
        return '#facec2'; // rojo
      }
      if (evento.estadoAutorizacion.id.trim() === 'CA') {
        return '#d9d9d9'; // gris
      }

      // PRIMARIA
      if (evento.nivelInspeccion != null && evento.nivelInspeccion.id.trim() === 'P') {
        if (evento.estadoAutorizacion.id.trim() === 'PA') {
            return '#d9d9d9'; // gris
        }
        if (evento.estadoAutorizacion.id.trim() === 'OB') {
          return '#ffe699'; // amarillo
        }
        if (evento.estadoAutorizacion.id.trim() === 'AS') {
          if (evento.estadoAtencion.id.trim() === 'EC') {
            return '#d9d9d9'; // gris
          }
          if (evento.estadoAtencion.id.trim() === 'PZ' || evento.estadoAtencion.id.trim() === 'AZ') {
            return '#ddebf7'; // celeste
          }

          return '#fff'; // blanco
        }
      }
      // SECUNDARIA
      if (evento.nivelInspeccion != null && evento.nivelInspeccion.id.trim() === 'S') {
        if (evento.estadoAutorizacion.id.trim() === 'OB') {
          if(evento.estadoAtencion.id.trim() === 'DE'){
            return '#d9d9d9'; // gris
          }
        }
        if (evento.estadoAutorizacion.id.trim() === 'AS') {
          if(evento.estadoAtencion.id.trim() === 'EC'){
            return '#d9d9d9'; // gris
          }
          if(evento.estadoAtencion.id.trim() === 'DC' || evento.estadoAtencion.id.trim() === 'AS'){
            return '#ddebf7'; // celeste
          }
        }
      }

      // EXHAUSTIVA
      if (evento.nivelInspeccion != null && evento.nivelInspeccion.id.trim() === 'E') {
        if (evento.estadoAutorizacion.id.trim() === 'AS') {
          return '#ddebf7'; // celeste
        }
      }
    } else {
      // EVENTOS DE SALIDA
      if (evento.estadoAutorizacion.id.trim() === 'PA') {
        return '#d9d9d9'; // gris
      }
      if (evento.estadoAutorizacion.id.trim() === 'OB') {
        return '#ffe699'; // amarillo
      }
      if (evento.estadoAutorizacion.id.trim() === 'AS') {
        return '#ddebf7'; // celeste
      }
      if (evento.estadoAutorizacion.id.trim() === 'OT') {
        return '#c6e0b4'; // verde
      }
      if (evento.estadoAutorizacion.id.trim() === 'RE') {
        return '#facec2'; // rojo
      }
      if (evento.estadoAutorizacion.id.trim() === 'CA') {
        return '#d9d9d9'; // gris
      }
    }
    return '#fff';
  }

  public static habilitarBotonEvento(evento: EventoIngresoSalida, botonAccion: string): boolean {

    if (botonAccion === 'VER') {
      return true;
    }

    // INGRESO
    if (evento.tipoEvento.id.trim() === 'I') {

        if (evento.nivelInspeccion != null && evento.nivelInspeccion.id.trim() === 'P') {
          if (evento.estadoAutorizacion.id.trim() === 'OB' ) {
            if (evento.estadoAtencion.id.trim() === 'PZ' || evento.estadoAtencion.id.trim() === 'AZ') {

              console.log(botonAccion === 'DERIVAR');
              if (botonAccion === 'DERIVAR') {
                return true;
              }
            }
          }
          if (evento.estadoAutorizacion.id.trim() === 'AS' ) {
            if (evento.estadoAtencion.id.trim() === 'PZ' || evento.estadoAtencion.id.trim() === 'AZ') {
              if (botonAccion === 'APROBAR') {
                return true;
              }
              if (botonAccion === 'SEC') {
                return true;
              }
            }
          }
        }
        if (evento.nivelInspeccion != null && evento.nivelInspeccion.id.trim() === 'S') {
          if (evento.estadoAutorizacion.id.trim() === 'AS' ) {
            if (evento.estadoAtencion.id.trim() === 'DC' || evento.estadoAtencion.id.trim() === 'AS') {
              if (botonAccion === 'RECHAZAR') {
                return true;
              }
              if (botonAccion === 'APROBAR') {
                return true;
              }
              if (botonAccion === 'EXH') {
                return true;
              }
            }
          }
        }
        if (evento.nivelInspeccion != null && evento.nivelInspeccion.id.trim() === 'E') {
          if (evento.estadoAutorizacion.id.trim() === 'AS' && evento.estadoAtencion.id.trim() === 'AS' ) {
            if (botonAccion === 'RECHAZAR') {
              return true;
            }
            if (botonAccion === 'APROBAR') {
              return true;
            }
          }
        }
    } else { // SALIDA
      if (evento.nivelInspeccion != null && (evento.nivelInspeccion.id.trim() === 'P' || evento.nivelInspeccion.id.trim() === 'S')) {
        if (evento.estadoAutorizacion.id.trim() === 'OB') {
          if (evento.estadoAtencion.id.trim() === 'DC' || evento.estadoAtencion.id.trim() === 'AS') {
            if (botonAccion === 'RECHAZAR') {
              return true;
            }
            if (botonAccion === 'AUTORIZAR') {
              return true;
            }
          }
        }
      }
    }
    return false;
  }
}
