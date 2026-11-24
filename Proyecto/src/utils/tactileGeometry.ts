import { TallerElemento } from '../types/camino';

export const MIN_WCAG_AAA_DISTANCE_MM = 2.5;

export interface CentroTactil {
  key: string;
  elementId: string;
  x: number;
  y: number;
  r: number;
  label: string;
}

export interface ParEnConflicto {
  id: string;
  a: CentroTactil;
  b: CentroTactil;
  distMm: number;
}

export interface ResultadoValidacionTactil {
  centros: CentroTactil[];
  minGapMm: number | null;
  cumpleNorma: boolean;
  paresEnConflicto: ParEnConflicto[];
  puntosEnConflicto: Set<string>;
  elementosEnConflicto: Set<string>;
  distanciaMinimaPorPunto: Record<string, number>;
}

export interface TooltipWcagInfo {
  cumple: boolean;
  titulo: string;
  detalle: string;
  distanciaMm: number | null;
}

/**
 * Calcula la distancia euclidiana en milímetros entre los centros de dos puntos.
 */
export function distanciaEuclidianaMm(
  ax: number,
  ay: number,
  bx: number,
  by: number
): number {
  return Math.hypot(bx - ax, by - ay);
}

/**
 * Extrae todos los centros táctiles individuales (puntos estándar, macro-puntos y puntos activos de celdillas Braille).
 */
export function extraerCentrosTactiles(
  elementos: TallerElemento[]
): CentroTactil[] {
  const centros: CentroTactil[] = [];
  const pitch = 2.5;
  const coordsBraille = [
    [0, 0],
    [0, pitch],
    [0, pitch * 2],
    [pitch, 0],
    [pitch, pitch],
    [pitch, pitch * 2],
  ];

  elementos.forEach((el) => {
    if (el.tipo === 'dot-std') {
      centros.push({
        key: el.id,
        elementId: el.id,
        x: el.xMm,
        y: el.yMm,
        r: 0.8,
        label: el.etiqueta || 'Punto 1.6 mm',
      });
    } else if (el.tipo === 'dot-macro') {
      centros.push({
        key: el.id,
        elementId: el.id,
        x: el.xMm,
        y: el.yMm,
        r: 1.25,
        label: el.etiqueta || 'Macro-punto 2.5 mm',
      });
    } else if (el.tipo === 'braille-cell') {
      (el.dots || []).forEach((d) => {
        const c = coordsBraille[d - 1];
        if (c) {
          centros.push({
            key: `${el.id}-dot-${d}`,
            elementId: el.id,
            x: el.xMm + c[0],
            y: el.yMm + c[1],
            r: 0.75,
            label: `${el.etiqueta || 'Celdilla 2×3'} · p.${d}`,
          });
        }
      });
    }
  });

  return centros;
}

/**
 * Recorre todos los centros presentes y valida si algún par incumple la distancia euclidiana mínima (2.5 mm WCAG AAA tiflológico).
 */
export function evaluarDistanciaEuclidianaTactil(
  elementos: TallerElemento[],
  minMm: number = MIN_WCAG_AAA_DISTANCE_MM
): ResultadoValidacionTactil {
  const centros = extraerCentrosTactiles(elementos);
  const paresEnConflicto: ParEnConflicto[] = [];
  const puntosEnConflicto = new Set<string>();
  const elementosEnConflicto = new Set<string>();
  const distanciaMinimaPorPunto: Record<string, number> = {};

  if (centros.length < 2) {
    return {
      centros,
      minGapMm: null,
      cumpleNorma: true,
      paresEnConflicto,
      puntosEnConflicto,
      elementosEnConflicto,
      distanciaMinimaPorPunto,
    };
  }

  let minCenterDist = Infinity;

  for (let i = 0; i < centros.length; i++) {
    for (let j = i + 1; j < centros.length; j++) {
      const a = centros[i];
      const b = centros[j];
      const d = distanciaEuclidianaMm(a.x, a.y, b.x, b.y);

      if (d < minCenterDist) {
        minCenterDist = d;
      }

      const prevA = distanciaMinimaPorPunto[a.key];
      if (prevA === undefined || d < prevA) {
        distanciaMinimaPorPunto[a.key] = Math.round(d * 10) / 10;
      }
      const prevB = distanciaMinimaPorPunto[b.key];
      if (prevB === undefined || d < prevB) {
        distanciaMinimaPorPunto[b.key] = Math.round(d * 10) / 10;
      }

      if (d < minMm - 1e-6) {
        paresEnConflicto.push({
          id: `${a.key}__${b.key}`,
          a,
          b,
          distMm: Math.round(d * 10) / 10,
        });
        puntosEnConflicto.add(a.key);
        puntosEnConflicto.add(b.key);
        elementosEnConflicto.add(a.elementId);
        elementosEnConflicto.add(b.elementId);
      }
    }
  }

  return {
    centros,
    minGapMm: Math.round(minCenterDist * 10) / 10,
    cumpleNorma: paresEnConflicto.length === 0,
    paresEnConflicto,
    puntosEnConflicto,
    elementosEnConflicto,
    distanciaMinimaPorPunto,
  };
}

/**
 * Construye el mensaje informativo WCAG AAA para el tooltip de un punto o elemento del lienzo.
 */
export function obtenerTooltipWcagPoint(
  pointKey: string,
  resultado: ResultadoValidacionTactil,
  minMm: number = MIN_WCAG_AAA_DISTANCE_MM
): TooltipWcagInfo {
  const dist = resultado.distanciaMinimaPorPunto[pointKey] ?? null;
  const enConflicto = resultado.puntosEnConflicto.has(pointKey);

  if (dist === null) {
    return {
      cumple: true,
      titulo: 'Cumple estándar WCAG AAA tiflológico',
      detalle: `Punto aislado en el lienzo (umbral mínimo entre centros: ${minMm.toFixed(1)} mm).`,
      distanciaMm: null,
    };
  }

  if (enConflicto) {
    return {
      cumple: false,
      titulo: 'Incumplimiento WCAG AAA: Distancia mínima 2.5mm',
      detalle: `Distancia euclidiana de ${dist.toFixed(1)} mm. Separe los centros para evitar fusión en papel PIAF.`,
      distanciaMm: dist,
    };
  }

  return {
    cumple: true,
    titulo: 'Cumple estándar WCAG AAA tiflológico',
    detalle: `Distancia euclidiana mínima de ${dist.toFixed(1)} mm (≥ ${minMm.toFixed(1)} mm requeridos).`,
    distanciaMm: dist,
  };
}
