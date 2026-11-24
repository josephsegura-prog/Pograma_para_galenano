export type RolUsuario = 'acompanante' | 'docente';

export type ModoPersistencia = 'local' | 'nube';

export type LogroTipo = 'solo' | 'ayuda' | 'aun';

export type ActividadTipo =
  | 'presencia'
  | 'tamanos'
  | 'camino'
  | 'laberinto'
  | 'buscar'
  | 'cuerpo'
  | 'direcciones'
  | 'referencia'
  | 'lineas'
  | 'formas'
  | 'ninguna';

export interface ActividadConfig {
  tipo: ActividadTipo;
  n?: number;
}

export interface ModuloDef {
  id: 'm1' | 'm2' | 'm3';
  num: number;
  titulo: string;
  desc: string;
}

export interface UnitDef {
  id: string;
  modulo: 'm1' | 'm2' | 'm3';
  etapa: number;
  titulo: string;
  duracion: string;
  objetivo: string;
  materiales: string[];
  pasos: string[];
  mano: string;
  consejo: string;
  competencia: string;
  resultado: string;
  criterio: string;
  actividad: ActividadConfig;
  orden?: number;
  base?: boolean;
  custom?: boolean;
  editada?: boolean;
  oculta?: boolean;
}

export interface PerfilAcompanamiento {
  nino: string;
  acompanante: string;
  relacion: string;
}

export interface DoneRecord {
  t: number;
  logro: 'solo' | 'ayuda';
}

export interface AjustesUsuario {
  voz: boolean;
  grande: boolean;
  contraste: boolean;
  escala: number;
}

export interface StudentRecord {
  id: string;
  perfil: PerfilAcompanamiento;
  done: Record<string, DoneRecord>;
  checks?: Record<string, boolean[]>;
  actividades?: Record<string, boolean>;
  intentos?: Record<string, number>;
  notaDocente?: string;
  actualizado?: number;
}

export type RutaApp =
  | { vista: 'landing' }
  | { vista: 'aula' }
  | { vista: 'unidad'; unitId: string }
  | { vista: 'docente' }
  | { vista: 'evaluacion'; alumnoId?: string }
  | { vista: 'taller' };

export type TallerElementoTipo = 'dot-std' | 'dot-macro' | 'braille-cell' | 'scan-line';

export interface TallerElemento {
  id: string;
  tipo: TallerElementoTipo;
  xMm: number;
  yMm: number;
  x2Mm?: number;
  y2Mm?: number;
  dots?: number[];
  etiqueta?: string;
}
