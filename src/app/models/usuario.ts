import { Estado } from './estado';
import { Tipo } from './tipo';

export interface Usuario {
  idUsuario?: number;
  dniUsuario: string;
  nombreUsuario: string;
  apepatUsuario: string;
  apematUsuario: string;
  correoUsuario: string;
  claveUsuario?: string;
  fecnacUsuario: string;
  tipo: Tipo;
  estado: Estado;
}
