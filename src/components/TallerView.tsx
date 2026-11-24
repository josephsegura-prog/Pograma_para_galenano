import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Circle,
  Download,
  Grid,
  Info,
  Magnet,
  Minus,
  MousePointer,
  Trash2,
} from 'lucide-react';
import { useCamino } from '../context/CaminoContext';
import { TallerElemento, TallerElementoTipo } from '../types/camino';
import { esc, slug } from '../utils/printTemplates';
import {
  evaluarDistanciaEuclidianaTactil,
  MIN_WCAG_AAA_DISTANCE_MM,
  obtenerTooltipWcagPoint,
} from '../utils/tactileGeometry';

const A4_W_MM = 210;
const A4_H_MM = 297;
const SNAP_GRID_MM = 5;
const MIN_CLEARANCE_MM = MIN_WCAG_AAA_DISTANCE_MM;

const snapCoordMm = (val: number, maxMm: number, snapActivo: boolean): number => {
  const clamped = Math.max(10, Math.min(maxMm, val));
  if (!snapActivo) return Math.round(clamped);
  const snapped = Math.round(clamped / SNAP_GRID_MM) * SNAP_GRID_MM;
  const maxSnap = Math.floor(maxMm / SNAP_GRID_MM) * SNAP_GRID_MM;
  return Math.max(10, Math.min(maxSnap, snapped));
};

const ELEMENTOS_INICIALES: TallerElemento[] = [
  { id: 't-dot-1', tipo: 'dot-macro', xMm: 40, yMm: 60, etiqueta: 'Origen' },
  { id: 't-dot-2', tipo: 'dot-std', xMm: 75, yMm: 60, etiqueta: 'Paso 2' },
  { id: 't-dot-3', tipo: 'dot-std', xMm: 110, yMm: 60, etiqueta: 'Paso 3' },
  { id: 't-dot-4', tipo: 'dot-std', xMm: 145, yMm: 60, etiqueta: 'Paso 4' },
  {
    id: 't-line-1',
    tipo: 'scan-line',
    xMm: 40,
    yMm: 110,
    x2Mm: 170,
    y2Mm: 110,
    etiqueta: 'Barrido horizontal',
  },
  {
    id: 't-cell-1',
    tipo: 'braille-cell',
    xMm: 95,
    yMm: 165,
    dots: [1, 2, 4, 5],
    etiqueta: 'Celdilla 2×3',
  },
];

export const TallerView: React.FC = () => {
  const { mostrarToast, anunciarVivo } = useCamino();

  const [tituloLamina, setTituloLamina] = useState<string>(
    'Lámina de aprestamiento A4'
  );
  const [herramienta, setHerramienta] = useState<
    'select' | TallerElementoTipo
  >('select');
  const [elementos, setElementos] =
    useState<TallerElemento[]>(ELEMENTOS_INICIALES);
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(
    ELEMENTOS_INICIALES[0].id
  );
  const [mostrarRejilla, setMostrarRejilla] = useState<boolean>(true);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [lineStartMm, setLineStartMm] = useState<{ x: number; y: number } | null>(
    null
  );
  const [cursorMm, setCursorMm] = useState<{ x: number; y: number }>({
    x: 105,
    y: 150,
  });
  const [hoveredPoint, setHoveredPoint] = useState<{
    key: string;
    label: string;
    xMm: number;
    yMm: number;
  } | null>(null);
  const [tooltipWcagAbierto, setTooltipWcagAbierto] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const toMm = (e: React.PointerEvent<SVGSVGElement>) => {
    const el = svgRef.current;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * A4_W_MM;
    const rawY = ((e.clientY - rect.top) / rect.height) * A4_H_MM;
    return {
      x: snapCoordMm(rawX, A4_W_MM - 10, snapToGrid),
      y: snapCoordMm(rawY, A4_H_MM - 10, snapToGrid),
    };
  };

  const alinearTodoARejilla = () => {
    setElementos((prev) =>
      prev.map((item) => ({
        ...item,
        xMm: snapCoordMm(item.xMm, A4_W_MM - 10, true),
        yMm: snapCoordMm(item.yMm, A4_H_MM - 10, true),
        ...(item.x2Mm !== undefined
          ? { x2Mm: snapCoordMm(item.x2Mm, A4_W_MM - 10, true) }
          : {}),
        ...(item.y2Mm !== undefined
          ? { y2Mm: snapCoordMm(item.y2Mm, A4_H_MM - 10, true) }
          : {}),
      }))
    );
    const msg = 'Elementos alineados a la retícula de 5 mm.';
    mostrarToast(msg);
    anunciarVivo(msg);
  };

  const handlePointerDownCanvas = (e: React.PointerEvent<SVGSVGElement>) => {
    const pt = toMm(e);
    setCursorMm(pt);

    if (herramienta === 'select') {
      setSeleccionadoId(null);
      return;
    }

    if (herramienta === 'dot-std' || herramienta === 'dot-macro') {
      const nuevo: TallerElemento = {
        id: `el-${Date.now()}`,
        tipo: herramienta,
        xMm: pt.x,
        yMm: pt.y,
        etiqueta:
          herramienta === 'dot-macro'
            ? 'Macro-punto 2.5 mm'
            : 'Punto estándar 1.6 mm',
      };
      setElementos((prev) => [...prev, nuevo]);
      setSeleccionadoId(nuevo.id);
      return;
    }

    if (herramienta === 'braille-cell') {
      const nuevo: TallerElemento = {
        id: `cell-${Date.now()}`,
        tipo: 'braille-cell',
        xMm: pt.x,
        yMm: pt.y,
        dots: [1, 2, 3],
        etiqueta: 'Celdilla 2×3',
      };
      setElementos((prev) => [...prev, nuevo]);
      setSeleccionadoId(nuevo.id);
      return;
    }

    if (herramienta === 'scan-line') {
      setLineStartMm(pt);
    }
  };

  const handlePointerMoveCanvas = (e: React.PointerEvent<SVGSVGElement>) => {
    const pt = toMm(e);
    setCursorMm(pt);
    if (!draggingId) return;

    setElementos((prev) =>
      prev.map((item) => {
        if (item.id !== draggingId) return item;
        if (item.tipo === 'scan-line' && item.x2Mm !== undefined && item.y2Mm !== undefined) {
          const dx = pt.x - item.xMm;
          const dy = pt.y - item.yMm;
          return {
            ...item,
            xMm: pt.x,
            yMm: pt.y,
            x2Mm: snapCoordMm(item.x2Mm + dx, A4_W_MM - 10, snapToGrid),
            y2Mm: snapCoordMm(item.y2Mm + dy, A4_H_MM - 10, snapToGrid),
          };
        }
        return { ...item, xMm: pt.x, yMm: pt.y };
      })
    );

    if (hoveredPoint && hoveredPoint.key === draggingId) {
      setHoveredPoint((prev) =>
        prev ? { ...prev, xMm: pt.x, yMm: pt.y } : null
      );
    }
  };

  const handlePointerUpCanvas = (e: React.PointerEvent<SVGSVGElement>) => {
    setDraggingId(null);
    if (herramienta === 'scan-line' && lineStartMm) {
      const pt = toMm(e);
      const dist = Math.hypot(pt.x - lineStartMm.x, pt.y - lineStartMm.y);
      if (dist >= 6) {
        const nuevaLinea: TallerElemento = {
          id: `line-${Date.now()}`,
          tipo: 'scan-line',
          xMm: lineStartMm.x,
          yMm: lineStartMm.y,
          x2Mm: pt.x,
          y2Mm: pt.y,
          etiqueta: `Línea de barrido (${Math.round(dist)} mm)`,
        };
        setElementos((prev) => [...prev, nuevaLinea]);
        setSeleccionadoId(nuevaLinea.id);
      }
      setLineStartMm(null);
    }
  };

  // Servicio de cálculo de distancia euclidiana entre todos los centros táctiles (WCAG AAA >= 2.5 mm)
  const spacingMetrics = useMemo(
    () => evaluarDistanciaEuclidianaTactil(elementos, MIN_CLEARANCE_MM),
    [elementos]
  );

  const activeTooltip = useMemo(() => {
    if (!hoveredPoint) return null;
    const info = obtenerTooltipWcagPoint(
      hoveredPoint.key,
      spacingMetrics,
      MIN_CLEARANCE_MM
    );
    return { ...hoveredPoint, ...info };
  }, [hoveredPoint, spacingMetrics]);

  const ultimaFirmaConflictoRef = useRef<string>('');
  useEffect(() => {
    if (draggingId) return;
    if (!spacingMetrics.cumpleNorma) {
      const n = spacingMetrics.paresEnConflicto.length;
      const firma = `${n}:${spacingMetrics.minGapMm ?? ''}`;
      if (firma !== ultimaFirmaConflictoRef.current) {
        ultimaFirmaConflictoRef.current = firma;
        const msg = `Advertencia WCAG AAA tiflológica: ${n} ${
          n === 1 ? 'par de puntos' : 'pares de puntos'
        } a menos de 2.5 mm (mínimo ${spacingMetrics.minGapMm?.toFixed(1)} mm). No cumple el estándar para láminas táctiles.`;
        mostrarToast(msg);
        anunciarVivo(msg);
      }
    } else if (ultimaFirmaConflictoRef.current !== '') {
      ultimaFirmaConflictoRef.current = '';
      anunciarVivo(
        'Espaciado válido: todos los puntos cumplen la distancia mínima de 2.5 mm (WCAG AAA tiflológico).'
      );
    }
  }, [draggingId, spacingMetrics, mostrarToast, anunciarVivo]);

  const seleccionado = useMemo(
    () => elementos.find((el) => el.id === seleccionadoId) || null,
    [elementos, seleccionadoId]
  );

  const generarSvgEstandarizadoA4 = (): string => {
    const inner = elementos
      .map((el) => {
        if (el.tipo === 'dot-std') {
          return `<circle cx="${el.xMm.toFixed(2)}" cy="${el.yMm.toFixed(2)}" r="0.80" fill="#000000"/>`;
        }
        if (el.tipo === 'dot-macro') {
          return `<circle cx="${el.xMm.toFixed(2)}" cy="${el.yMm.toFixed(2)}" r="1.25" fill="#000000"/>`;
        }
        if (el.tipo === 'scan-line') {
          const x2 = el.x2Mm ?? el.xMm + 40;
          const y2 = el.y2Mm ?? el.yMm;
          return `<line x1="${el.xMm.toFixed(2)}" y1="${el.yMm.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="#000000" stroke-width="1.60" stroke-linecap="round"/>`;
        }
        if (el.tipo === 'braille-cell') {
          const coords = [
            [0, 0],
            [0, 2.5],
            [0, 5],
            [2.5, 0],
            [2.5, 2.5],
            [2.5, 5],
          ];
          const puntos = (el.dots || [])
            .map((d) => {
              const c = coords[d - 1];
              return c
                ? `<circle cx="${(el.xMm + c[0]).toFixed(2)}" cy="${(el.yMm + c[1]).toFixed(2)}" r="0.75" fill="#000000"/>`
                : '';
            })
            .join('');
          return puntos ? `<g data-tipo="celdilla-braille">${puntos}</g>` : '';
        }
        return '';
      })
      .join('');

    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      `<svg xmlns="http://www.w3.org/2000/svg" width="${A4_W_MM}mm" height="${A4_H_MM}mm" viewBox="0 0 ${A4_W_MM} ${A4_H_MM}">`,
      `<title>${esc(tituloLamina || 'Lámina táctil A4')}</title>`,
      '<desc>Lámina táctil estandarizada A4 (210 × 297 mm) para impresión térmica PIAF, con triángulo de orientación superior izquierdo.</desc>',
      `<rect x="0" y="0" width="${A4_W_MM}" height="${A4_H_MM}" fill="#FFFFFF"/>`,
      '<path id="triangulo-orientacion" d="M 8 8 H 24 L 8 24 Z" fill="#000000"/>',
      `<g id="composicion-tactil">${inner}</g>`,
      '</svg>',
    ].join('\n');
  };

  const exportarSVG = () => {
    const svgContenido = generarSvgEstandarizadoA4();
    const nombreBase = slug(tituloLamina) || 'lamina-tactil';
    const nombreArchivo = `${nombreBase}-a4-piaf.svg`;

    try {
      const blob = new Blob([svgContenido], {
        type: 'image/svg+xml;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const enlaceTemporal = document.createElement('a');
      enlaceTemporal.href = url;
      enlaceTemporal.download = nombreArchivo;
      enlaceTemporal.rel = 'noopener';
      enlaceTemporal.style.display = 'none';
      document.body.appendChild(enlaceTemporal);
      enlaceTemporal.click();
      document.body.removeChild(enlaceTemporal);
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);

      const aviso = `Lámina SVG descargada: ${nombreArchivo}`;
      mostrarToast(aviso);
      anunciarVivo(aviso);
    } catch {
      mostrarToast('No se pudo generar la descarga del archivo SVG.');
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-10 space-y-8">
      {/* Cabecera */}
      <header className="pb-6 border-b border-[var(--line)] flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <span className="block text-[0.78rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
            Taller de Diseño e Impresión · Escala A4 (210 × 297 mm)
          </span>
          <input
            type="text"
            aria-label="Título de la lámina"
            value={tituloLamina}
            onChange={(e) => setTituloLamina(e.target.value)}
            className="w-full bg-transparent font-editorial text-[1.9rem] md:text-[2.3rem] text-[var(--ink)] border-b border-transparent hover:border-[var(--line)] focus:border-[var(--ink)] focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={exportarSVG}
          className="min-h-[48px] px-5 bg-[var(--ink)] text-[var(--surface)] rounded-[4px] font-semibold inline-flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          <span>Exportar lámina a SVG</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Paleta de herramientas (3 cols) */}
        <aside className="lg:col-span-3 bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-5 space-y-5">
          <h2 className="font-editorial text-[1.25rem] text-[var(--ink)]">
            Herramientas táctiles
          </h2>

          <div className="space-y-2">
            {(
              [
                {
                  id: 'select',
                  label: 'Seleccionar y mover',
                  icon: <MousePointer className="w-4 h-4" />,
                },
                {
                  id: 'dot-std',
                  label: 'Punto estándar (1.6 mm)',
                  icon: <Circle className="w-3.5 h-3.5" />,
                },
                {
                  id: 'dot-macro',
                  label: 'Macro-punto (2.5 mm)',
                  icon: <Circle className="w-4 h-4" />,
                },
                {
                  id: 'braille-cell',
                  label: 'Celdilla Braille 2×3',
                  icon: <Grid className="w-4 h-4" />,
                },
                {
                  id: 'scan-line',
                  label: 'Línea de barrido',
                  icon: <Minus className="w-4 h-4" />,
                },
              ] as const
            ).map((tool) => {
              const active = herramienta === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setHerramienta(tool.id)}
                  className={`w-full min-h-[44px] px-3.5 rounded-[4px] border flex items-center gap-2.5 text-[0.88rem] font-semibold cursor-pointer ${
                    active
                      ? 'bg-[var(--ink)] text-[var(--surface)] border-[var(--ink)]'
                      : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:bg-[var(--bg)]'
                  }`}
                >
                  {tool.icon}
                  <span>{tool.label}</span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-[var(--line)] pt-4 space-y-2">
            <button
              type="button"
              aria-pressed={snapToGrid}
              onClick={() => {
                setSnapToGrid((prev) => {
                  const next = !prev;
                  anunciarVivo(
                    next
                      ? 'Ajuste a rejilla de 5 mm activado.'
                      : 'Ajuste a rejilla de 5 mm desactivado.'
                  );
                  return next;
                });
              }}
              className={`w-full min-h-[44px] px-3.5 rounded-[4px] border flex items-center justify-between gap-2 text-[0.86rem] font-semibold cursor-pointer ${
                snapToGrid
                  ? 'bg-[var(--accent-soft)] text-[var(--ink)] border-[var(--accent)]'
                  : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--ink)]'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Magnet className="w-4 h-4" aria-hidden="true" />
                <span>Ajuste a rejilla (5 mm)</span>
              </span>
              <span className="text-[0.74rem] font-bold uppercase tracking-[0.04em]">
                {snapToGrid ? 'Activo' : 'Libre'}
              </span>
            </button>
            <button
              type="button"
              aria-pressed={mostrarRejilla}
              onClick={() => setMostrarRejilla((v) => !v)}
              className="w-full min-h-[44px] px-3.5 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] text-[0.86rem] font-semibold hover:border-[var(--ink)] cursor-pointer"
            >
              {mostrarRejilla
                ? 'Ocultar retícula (5 mm)'
                : 'Mostrar retícula (5 mm)'}
            </button>
            <button
              type="button"
              onClick={alinearTodoARejilla}
              disabled={elementos.length === 0}
              className="w-full min-h-[44px] px-3.5 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] text-[0.84rem] font-semibold text-[var(--ink)] hover:border-[var(--ink)] disabled:opacity-45 cursor-pointer"
            >
              Alinear composición a 5 mm
            </button>
            <button
              type="button"
              onClick={() => {
                setElementos([]);
                setSeleccionadoId(null);
                setHoveredPoint(null);
              }}
              className="w-full min-h-[44px] px-3.5 rounded-[4px] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--warn)] hover:border-[var(--warn)] text-[0.86rem] font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              <span>Vaciar lienzo</span>
            </button>
          </div>
        </aside>

        {/* Lienzo A4 milimétrico (6 cols) */}
        <section className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between text-[0.82rem] font-semibold text-[var(--muted)]">
            <span>
              {herramienta === 'select' && 'Arrastre cualquier elemento o haga clic para inspeccionarlo.'}
              {herramienta === 'dot-std' && 'Haga clic en el lienzo para colocar un punto estándar de 1.6 mm.'}
              {herramienta === 'dot-macro' && 'Haga clic en el lienzo para colocar un macro-punto de 2.5 mm.'}
              {herramienta === 'braille-cell' && 'Haga clic para insertar una celdilla 2×3 (paso 2.5 mm).'}
              {herramienta === 'scan-line' && 'Presione y arrastre para trazar una línea guía de barrido.'}
            </span>
            <span className="tabular-nums shrink-0 ml-2">
              {cursorMm.x} × {cursorMm.y} mm
              {snapToGrid ? ' · Imán 5 mm' : ''}
            </span>
          </div>

          {!spacingMetrics.cumpleNorma && (
            <div
              role="alert"
              className="p-4 rounded-[4px] border border-[var(--warn)] bg-[var(--warn-soft)] text-[var(--ink)] flex items-start gap-3"
            >
              <AlertCircle
                className="w-5 h-5 text-[var(--warn)] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="space-y-1 text-[0.86rem]">
                <p className="font-bold text-[var(--warn)]">
                  Incumplimiento WCAG AAA: Distancia mínima 2.5mm
                </p>
                <p className="leading-snug">
                  Se detectó{' '}
                  <strong className="tabular-nums">
                    {spacingMetrics.paresEnConflicto.length}{' '}
                    {spacingMetrics.paresEnConflicto.length === 1
                      ? 'par de puntos'
                      : 'pares de puntos'}
                  </strong>{' '}
                  con separación inferior a 2.5 mm (distancia mínima actual:{' '}
                  <strong className="tabular-nums">
                    {spacingMetrics.minGapMm?.toFixed(1)} mm
                  </strong>
                  ). Separe los puntos resaltados para evitar fusión térmica en papel PIAF y asegurar discriminación táctil.
                </p>
              </div>
            </div>
          )}

          <div className="bg-[var(--surface-dim)] border border-[var(--line)] rounded-[4px] p-5 md:p-8 flex justify-center">
            <div
              className="relative w-full max-w-[440px] bg-white border border-[var(--line)]"
              style={{ aspectRatio: `${A4_W_MM} / ${A4_H_MM}` }}
            >
              <svg
                ref={svgRef}
                viewBox={`0 0 ${A4_W_MM} ${A4_H_MM}`}
                xmlns="http://www.w3.org/2000/svg"
                onPointerDown={handlePointerDownCanvas}
                onPointerMove={handlePointerMoveCanvas}
                onPointerUp={handlePointerUpCanvas}
                onPointerLeave={() => setHoveredPoint(null)}
                className="w-full h-full block touch-none select-none"
                role="application"
                aria-label="Lienzo A4 de diseño táctil en milímetros"
              >
                <defs>
                  <pattern
                    id="taller-grid-5mm"
                    width={SNAP_GRID_MM}
                    height={SNAP_GRID_MM}
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d={`M ${SNAP_GRID_MM} 0 L 0 0 0 ${SNAP_GRID_MM}`}
                      fill="none"
                      stroke="#EFE8DC"
                      strokeWidth="0.22"
                    />
                  </pattern>
                </defs>

                <rect
                  x="0"
                  y="0"
                  width={A4_W_MM}
                  height={A4_H_MM}
                  fill="#FFFFFF"
                />

                {/* Retícula milimétrica de 5 mm y ejes principales de 20 mm (no exportable) */}
                {mostrarRejilla && (
                  <g aria-hidden="true">
                    <rect
                      x="0"
                      y="0"
                      width={A4_W_MM}
                      height={A4_H_MM}
                      fill="url(#taller-grid-5mm)"
                    />
                    {[20, 40, 60, 80, 100, 120, 140, 160, 180, 200].map((x) => (
                      <line
                        key={`x-${x}`}
                        x1={x}
                        y1={0}
                        x2={x}
                        y2={A4_H_MM}
                        stroke="#DFD7C8"
                        strokeWidth="0.35"
                        strokeDasharray="1.5 1.5"
                      />
                    ))}
                    {[
                      20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240,
                      260, 280,
                    ].map((y) => (
                      <line
                        key={`y-${y}`}
                        x1={0}
                        y1={y}
                        x2={A4_W_MM}
                        y2={y}
                        stroke="#DFD7C8"
                        strokeWidth="0.35"
                        strokeDasharray="1.5 1.5"
                      />
                    ))}
                  </g>
                )}

                {/* Guía visual de ajuste snap-to-grid (5 mm) en el cursor */}
                {snapToGrid && herramienta !== 'select' && (
                  <g aria-hidden="true" pointerEvents="none" opacity="0.65">
                    <line
                      x1={cursorMm.x - 2.5}
                      y1={cursorMm.y}
                      x2={cursorMm.x + 2.5}
                      y2={cursorMm.y}
                      stroke="#C88A1E"
                      strokeWidth="0.45"
                    />
                    <line
                      x1={cursorMm.x}
                      y1={cursorMm.y - 2.5}
                      x2={cursorMm.x}
                      y2={cursorMm.y + 2.5}
                      stroke="#C88A1E"
                      strokeWidth="0.45"
                    />
                    <circle
                      cx={cursorMm.x}
                      cy={cursorMm.y}
                      r="1.4"
                      fill="none"
                      stroke="#C88A1E"
                      strokeWidth="0.35"
                    />
                  </g>
                )}

                {/* Triángulo de orientación normalizado arriba a la izquierda */}
                <path d="M 8 8 H 24 L 8 24 Z" fill="#000000" />

                {/* Elementos táctiles */}
                {elementos.map((el) => {
                  const sel = el.id === seleccionadoId;
                  if (el.tipo === 'dot-std' || el.tipo === 'dot-macro') {
                    const r = el.tipo === 'dot-macro' ? 1.25 : 0.8;
                    const enConflicto = spacingMetrics.puntosEnConflicto.has(el.id);
                    const infoPt = obtenerTooltipWcagPoint(
                      el.id,
                      spacingMetrics,
                      MIN_CLEARANCE_MM
                    );
                    return (
                      <g
                        key={el.id}
                        tabIndex={0}
                        role="button"
                        aria-label={`${el.etiqueta} en (${el.xMm}, ${el.yMm}) mm. ${infoPt.titulo}`}
                        style={{ cursor: 'grab' }}
                        onPointerDown={(ev) => {
                          ev.stopPropagation();
                          setSeleccionadoId(el.id);
                          setDraggingId(el.id);
                          setHoveredPoint({
                            key: el.id,
                            label: el.etiqueta || 'Punto',
                            xMm: el.xMm,
                            yMm: el.yMm,
                          });
                        }}
                        onPointerEnter={() =>
                          setHoveredPoint({
                            key: el.id,
                            label: el.etiqueta || 'Punto',
                            xMm: el.xMm,
                            yMm: el.yMm,
                          })
                        }
                        onPointerLeave={() =>
                          setHoveredPoint((prev) =>
                            prev?.key === el.id ? null : prev
                          )
                        }
                        onFocus={() =>
                          setHoveredPoint({
                            key: el.id,
                            label: el.etiqueta || 'Punto',
                            xMm: el.xMm,
                            yMm: el.yMm,
                          })
                        }
                        onBlur={() =>
                          setHoveredPoint((prev) =>
                            prev?.key === el.id ? null : prev
                          )
                        }
                      >
                        <title>
                          {`${el.etiqueta}: ${infoPt.titulo}. ${infoPt.detalle}`}
                        </title>
                        <circle cx={el.xMm} cy={el.yMm} r={5} fill="transparent" />
                        {enConflicto && (
                          <circle
                            cx={el.xMm}
                            cy={el.yMm}
                            r={r + 3.2}
                            className="error-distancia-halo"
                          />
                        )}
                        {sel && (
                          <circle
                            cx={el.xMm}
                            cy={el.yMm}
                            r={r + 2.5}
                            fill="none"
                            stroke={enConflicto ? '#DC2626' : '#C88A1E'}
                            strokeWidth="0.7"
                          />
                        )}
                        <circle
                          cx={el.xMm}
                          cy={el.yMm}
                          r={r}
                          fill="#000000"
                          className={enConflicto ? 'error-distancia' : undefined}
                        />
                      </g>
                    );
                  }

                  if (el.tipo === 'scan-line') {
                    const x2 = el.x2Mm ?? el.xMm + 40;
                    const y2 = el.y2Mm ?? el.yMm;
                    return (
                      <g
                        key={el.id}
                        style={{ cursor: 'grab' }}
                        onPointerDown={(ev) => {
                          ev.stopPropagation();
                          setSeleccionadoId(el.id);
                          setDraggingId(el.id);
                        }}
                      >
                        <line
                          x1={el.xMm}
                          y1={el.yMm}
                          x2={x2}
                          y2={y2}
                          stroke="transparent"
                          strokeWidth="8"
                        />
                        {sel && (
                          <line
                            x1={el.xMm}
                            y1={el.yMm}
                            x2={x2}
                            y2={y2}
                            stroke="#C88A1E"
                            strokeWidth="3.6"
                            strokeLinecap="round"
                            opacity="0.4"
                          />
                        )}
                        <line
                          x1={el.xMm}
                          y1={el.yMm}
                          x2={x2}
                          y2={y2}
                          stroke="#000000"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </g>
                    );
                  }

                  if (el.tipo === 'braille-cell') {
                    const coords = [
                      [0, 0],
                      [0, 2.5],
                      [0, 5],
                      [2.5, 0],
                      [2.5, 2.5],
                      [2.5, 5],
                    ];
                    const celdaEnConflicto =
                      spacingMetrics.elementosEnConflicto.has(el.id);
                    const firstDot = (el.dots && el.dots[0]) || 1;
                    const firstKey = `${el.id}-dot-${firstDot}`;
                    return (
                      <g
                        key={el.id}
                        tabIndex={0}
                        role="button"
                        aria-label={`${el.etiqueta} en (${el.xMm}, ${el.yMm}) mm`}
                        style={{ cursor: 'grab' }}
                        onPointerDown={(ev) => {
                          ev.stopPropagation();
                          setSeleccionadoId(el.id);
                          setDraggingId(el.id);
                        }}
                        onFocus={() =>
                          setHoveredPoint({
                            key: firstKey,
                            label: el.etiqueta || 'Celdilla 2×3',
                            xMm: el.xMm,
                            yMm: el.yMm,
                          })
                        }
                        onBlur={() =>
                          setHoveredPoint((prev) =>
                            prev?.key.startsWith(`${el.id}-dot-`) ? null : prev
                          )
                        }
                      >
                        <rect
                          x={el.xMm - 2.5}
                          y={el.yMm - 2.5}
                          width={7.5}
                          height={10}
                          fill="transparent"
                          stroke={
                            celdaEnConflicto
                              ? '#DC2626'
                              : sel
                                ? '#C88A1E'
                                : '#DFD7C8'
                          }
                          strokeWidth={celdaEnConflicto ? '0.65' : '0.45'}
                          strokeDasharray={
                            sel || celdaEnConflicto ? undefined : '1 1'
                          }
                        />
                        {[1, 2, 3, 4, 5, 6].map((dotNum) => {
                          const c = coords[dotNum - 1];
                          const on = (el.dots || []).includes(dotNum);
                          const dotKey = `${el.id}-dot-${dotNum}`;
                          const dotEnConflicto =
                            on && spacingMetrics.puntosEnConflicto.has(dotKey);
                          const infoDot = on
                            ? obtenerTooltipWcagPoint(
                                dotKey,
                                spacingMetrics,
                                MIN_CLEARANCE_MM
                              )
                            : null;
                          return (
                            <g
                              key={dotNum}
                              onPointerEnter={() => {
                                if (!on) return;
                                setHoveredPoint({
                                  key: dotKey,
                                  label: `${el.etiqueta || 'Celdilla 2×3'} · p.${dotNum}`,
                                  xMm: el.xMm + c[0],
                                  yMm: el.yMm + c[1],
                                });
                              }}
                              onPointerLeave={() =>
                                setHoveredPoint((prev) =>
                                  prev?.key === dotKey ? null : prev
                                )
                              }
                            >
                              {infoDot && (
                                <title>
                                  {`Punto ${dotNum}: ${infoDot.titulo}. ${infoDot.detalle}`}
                                </title>
                              )}
                              {dotEnConflicto && (
                                <circle
                                  cx={el.xMm + c[0]}
                                  cy={el.yMm + c[1]}
                                  r={2.1}
                                  className="error-distancia-halo"
                                />
                              )}
                              <circle
                                cx={el.xMm + c[0]}
                                cy={el.yMm + c[1]}
                                r={0.75}
                                fill={on ? '#000000' : 'none'}
                                stroke={on ? 'none' : '#9AA3B8'}
                                strokeWidth="0.25"
                                className={
                                  dotEnConflicto ? 'error-distancia' : undefined
                                }
                              />
                            </g>
                          );
                        })}
                      </g>
                    );
                  }

                  return null;
                })}

                {/* Indicadores visuales rojos de conflicto (< 2.5 mm), no exportables */}
                {spacingMetrics.paresEnConflicto.length > 0 && (
                  <g aria-hidden="true" pointerEvents="none">
                    {spacingMetrics.paresEnConflicto.map((par) => (
                      <g key={par.id}>
                        <line
                          x1={par.a.x}
                          y1={par.a.y}
                          x2={par.b.x}
                          y2={par.b.y}
                          className="error-distancia-linea"
                        />
                      </g>
                    ))}
                  </g>
                )}
              </svg>

              {/* Tooltip informativo sobre cumplimiento WCAG AAA sobre el punto inspeccionado */}
              {activeTooltip && (
                <div
                  role="tooltip"
                  className={`pointer-events-none absolute z-10 w-[260px] p-3 rounded-[4px] border bg-[var(--surface)] text-[0.78rem] leading-snug ${
                    activeTooltip.cumple
                      ? 'border-[var(--ok)] text-[var(--ink)]'
                      : 'border-[#DC2626] text-[var(--ink)]'
                  }`}
                  style={{
                    left: `${Math.min(
                      Math.max((activeTooltip.xMm / A4_W_MM) * 100, 12),
                      64
                    )}%`,
                    top:
                      activeTooltip.yMm < 55
                        ? `${(activeTooltip.yMm / A4_H_MM) * 100 + 5}%`
                        : undefined,
                    bottom:
                      activeTooltip.yMm >= 55
                        ? `${100 - (activeTooltip.yMm / A4_H_MM) * 100 + 4}%`
                        : undefined,
                    transform: 'translateX(-15%)',
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-[var(--ink)]">
                      {activeTooltip.label}
                    </span>
                    <span
                      className={`font-bold tabular-nums ${
                        activeTooltip.cumple
                          ? 'text-[var(--ok)]'
                          : 'text-[#DC2626]'
                      }`}
                    >
                      {activeTooltip.distanciaMm !== null
                        ? `${activeTooltip.distanciaMm.toFixed(1)} mm`
                        : 'Aislado'}
                    </span>
                  </div>
                  <p
                    className={`font-bold ${
                      activeTooltip.cumple
                        ? 'text-[var(--ok)]'
                        : 'text-[#DC2626]'
                    }`}
                  >
                    {activeTooltip.titulo}
                  </p>
                  <p className="text-[var(--muted)] mt-0.5">
                    {activeTooltip.detalle}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Inspector y parámetros PIAF (3 cols) */}
        <aside className="lg:col-span-3 space-y-6">
          {/* Validación WCAG AAA tiflológica */}
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-5 space-y-4">
            <h2 className="font-editorial text-[1.25rem] text-[var(--ink)]">
              Inspector tiflológico
            </h2>

            <div className="space-y-3 text-[0.9rem]">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-[var(--line)]">
                <span className="text-[var(--muted)]">Espaciado mínimo</span>
                <strong
                  className={`tabular-nums ${
                    spacingMetrics.cumpleNorma
                      ? 'text-[var(--ink)]'
                      : 'text-[var(--warn)]'
                  }`}
                >
                  {spacingMetrics.minGapMm !== null
                    ? `${spacingMetrics.minGapMm.toFixed(1)} mm`
                    : '—'}
                </strong>
              </div>

              <div className="relative flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5">
                  <span className="text-[var(--muted)]">Norma ≥ 2.5 mm</span>
                  <button
                    type="button"
                    aria-label="Información sobre cumplimiento WCAG AAA tiflológico"
                    aria-describedby="wcag-aaa-inspector-tooltip"
                    aria-expanded={tooltipWcagAbierto}
                    onMouseEnter={() => setTooltipWcagAbierto(true)}
                    onMouseLeave={() => setTooltipWcagAbierto(false)}
                    onFocus={() => setTooltipWcagAbierto(true)}
                    onBlur={() => setTooltipWcagAbierto(false)}
                    onClick={() => setTooltipWcagAbierto((v) => !v)}
                    className="min-w-[28px] min-h-[28px] inline-flex items-center justify-center rounded-[4px] text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                  >
                    <Info className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                {spacingMetrics.cumpleNorma ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] border border-[var(--ok)] bg-[var(--ok-soft)] text-[var(--ok)] text-[0.76rem] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    Válido
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] border border-[var(--warn)] bg-[var(--warn-soft)] text-[var(--warn)] text-[0.76rem] font-bold">
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    No cumple (&lt; 2.5 mm)
                  </span>
                )}

                {tooltipWcagAbierto && (
                  <div
                    id="wcag-aaa-inspector-tooltip"
                    role="tooltip"
                    className={`absolute left-0 right-0 top-full mt-2 z-20 p-3 rounded-[4px] border bg-[var(--surface)] text-[0.8rem] leading-snug ${
                      spacingMetrics.cumpleNorma
                        ? 'border-[var(--ok)] text-[var(--ink)]'
                        : 'border-[var(--warn)] text-[var(--ink)]'
                    }`}
                  >
                    <p
                      className={`font-bold mb-1 ${
                        spacingMetrics.cumpleNorma
                          ? 'text-[var(--ok)]'
                          : 'text-[var(--warn)]'
                      }`}
                    >
                      {spacingMetrics.cumpleNorma
                        ? 'Cumplimiento WCAG AAA tiflológico verificado'
                        : 'Incumplimiento WCAG AAA: Distancia mínima 2.5mm'}
                    </p>
                    <p className="text-[var(--muted)]">
                      El servicio calcula la distancia euclidiana entre los centros de todos los puntos táctiles. La separación mínima obligatoria es de 2.5 mm para prevenir la fusión térmica en papel PIAF y asegurar discriminación táctil.
                    </p>
                  </div>
                )}
              </div>

              {!spacingMetrics.cumpleNorma && (
                <div className="pt-3 border-t border-[var(--line)] space-y-1.5 text-[0.82rem]">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--muted)]">Pares en conflicto</span>
                    <strong className="tabular-nums text-[var(--warn)]">
                      {spacingMetrics.paresEnConflicto.length}
                    </strong>
                  </div>
                  <p className="text-[var(--warn)] leading-snug">
                    No cumple el estándar WCAG AAA tiflológico para láminas táctiles.
                  </p>
                </div>
              )}
            </div>

            {seleccionado && (
              <div className="border-t border-[var(--line)] pt-4 space-y-3">
                <span className="block text-[0.74rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
                  Elemento seleccionado
                </span>
                <p className="font-semibold text-[0.94rem] text-[var(--ink)]">
                  {seleccionado.etiqueta}
                </p>
                <p className="text-[0.84rem] text-[var(--muted)] tabular-nums">
                  X: {seleccionado.xMm} mm · Y: {seleccionado.yMm} mm
                </p>

                {seleccionado.tipo === 'braille-cell' && (
                  <div className="space-y-2">
                    <span className="block text-[0.82rem] font-semibold">
                      Puntos de la celdilla 2×3
                    </span>
                    <div className="grid grid-cols-2 gap-2 w-24">
                      {[1, 4, 2, 5, 3, 6].map((dotNum) => {
                        const on = (seleccionado.dots || []).includes(dotNum);
                        return (
                          <button
                            key={dotNum}
                            type="button"
                            aria-pressed={on}
                            onClick={() => {
                              setElementos((prev) =>
                                prev.map((item) => {
                                  if (item.id !== seleccionado.id) return item;
                                  const cur = item.dots || [];
                                  const next = cur.includes(dotNum)
                                    ? cur.filter((x) => x !== dotNum)
                                    : [...cur, dotNum].sort((a, b) => a - b);
                                  return { ...item, dots: next };
                                })
                              );
                            }}
                            className={`h-10 rounded-full border font-bold text-[0.84rem] cursor-pointer ${
                              on
                                ? 'bg-[var(--ink)] border-[var(--ink)] text-[var(--surface)]'
                                : 'bg-[var(--surface)] border-[var(--line)] text-[var(--muted)]'
                            }`}
                          >
                            {dotNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const idEliminar = seleccionado.id;
                    setElementos((prev) =>
                      prev.filter((item) => item.id !== idEliminar)
                    );
                    setSeleccionadoId(null);
                    setHoveredPoint((prev) =>
                      prev &&
                      (prev.key === idEliminar ||
                        prev.key.startsWith(`${idEliminar}-dot-`))
                        ? null
                        : prev
                    );
                  }}
                  className="w-full min-h-[44px] px-3 rounded-[4px] border border-[var(--warn)] text-[var(--warn)] text-[0.86rem] font-semibold cursor-pointer"
                >
                  Eliminar elemento
                </button>
              </div>
            )}
          </div>

          {/* Parámetros de fuser PIAF */}
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-5 space-y-3">
            <h2 className="font-editorial text-[1.2rem] text-[var(--ink)]">
              Parámetros fuser PIAF
            </h2>
            <dl className="divide-y divide-[var(--line)] text-[0.86rem]">
              <div className="py-2 flex justify-between">
                <dt className="text-[var(--muted)]">Temperatura</dt>
                <dd className="font-bold text-[var(--ink)]">Nivel 4 · 8 s</dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="text-[var(--muted)]">Tinta térmica</dt>
                <dd className="font-bold text-[var(--ink)] tabular-nums">
                  100% K (#000000)
                </dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="text-[var(--muted)]">Orientación</dt>
                <dd className="font-bold text-[var(--ink)]">
                  Triángulo sup. izq.
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
};
