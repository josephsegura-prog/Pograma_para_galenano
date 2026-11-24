import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Play, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useCamino } from '../context/CaminoContext';
import { GEO, H, NUMS, W } from '../data/curriculum';
import { UnitDef } from '../types/camino';
import { hablar, SON, tono } from '../utils/audio';

interface InteractivePlateProps {
  unit: UnitDef;
}

const ESQUINA = 'M14 14 H50 L14 50 Z';

function PtSvg({
  index,
  x,
  y,
  r,
  label,
  doble = false,
  hecho = false,
  sig = false,
  onTrigger,
}: {
  index: number;
  x: number;
  y: number;
  r: number;
  label: string;
  doble?: boolean;
  hecho?: boolean;
  sig?: boolean;
  onTrigger: (i: number) => void;
}) {
  const cls = ['pt', hecho ? 'hecho' : '', sig ? 'sig' : ''].filter(Boolean).join(' ');
  return (
    <g
      className={cls}
      data-i={index}
      tabIndex={0}
      role="button"
      aria-label={label}
      onClick={() => onTrigger(index)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onTrigger(index);
        }
      }}
    >
      <circle className="hit" cx={x} cy={y} r={Math.max(r + 14, 24)} />
      {doble && (
        <circle
          className="dot"
          cx={x}
          cy={y}
          r={r + 9}
          style={{ fill: 'none', stroke: '#1C1917', strokeWidth: 5 }}
        />
      )}
      <circle className="dot" cx={x} cy={y} r={r} />
    </g>
  );
}

export const InteractivePlate: React.FC<InteractivePlateProps> = ({ unit }) => {
  const { ajustes, completarActividadDigital } = useCamino();
  const tipo = (unit.actividad && unit.actividad.tipo) || 'ninguna';

  const [resetTick, setResetTick] = useState(0);
  const [estadoMsg, setEstadoMsg] = useState('');
  const [estadoClase, setEstadoClase] = useState<'' | 'bien' | 'mal'>('');

  const timersRef = useRef<number[]>([]);
  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }, []);

  const addTimer = useCallback((fn: () => void, ms: number) => {
    const t = window.setTimeout(fn, ms);
    timersRef.current.push(t);
    return t;
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const decir = useCallback(
    (t: string, clase: '' | 'bien' | 'mal' = '', voz = true) => {
      setEstadoMsg(t);
      setEstadoClase(clase);
      if (voz && ajustes.voz) {
        hablar(t);
      }
    },
    [ajustes.voz]
  );

  const marcarListo = useCallback(() => {
    completarActividadDigital(unit.id);
    SON.fin();
  }, [completarActividadDigital, unit.id]);

  // 1. PRESENCIA
  const [vistosPresencia, setVistosPresencia] = useState<number[]>([]);

  // 2. TAMAÑOS
  const [objTamano, setObjTamano] = useState<'grande' | 'pequeño'>('grande');
  const [okTamano, setOkTamano] = useState(0);
  const [hechosTamano, setHechosTamano] = useState<number[]>([]);

  // 3, 9, 10. RECORRIDO (camino, lineas, formas)
  const [subKey, setSubKey] = useState<string>(() => {
    if (tipo === 'lineas') return 'horizontal';
    if (tipo === 'formas') return 'cuadrado';
    return 'camino';
  });
  const [subHechos, setSubHechos] = useState<string[]>([]);
  const [recIdx, setRecIdx] = useState(0);
  const [recCerrar, setRecCerrar] = useState(false);
  const [recFin, setRecFin] = useState(false);
  const [dedoPos, setDedoPos] = useState<[number, number] | null>(null);

  // 4. LABERINTO
  const [labPos, setLabPos] = useState<[number, number]>([1, 1]);
  const [labLlego, setLabLlego] = useState(false);
  const [labBloqueos, setLabBloqueos] = useState(0);

  // 5. BUSCAR
  const [halladosBuscar, setHalladosBuscar] = useState<number[]>([]);

  // 6. CUERPO
  const [vistosCuerpo, setVistosCuerpo] = useState<number[]>([]);

  // 7. DIRECCIONES
  const [dirActual, setDirActual] = useState<string | null>(null);
  const [dirOk, setDirOk] = useState(0);
  const [dirOrden, setDirOrden] = useState<string[]>([]);
  const [fichaOffset, setFichaOffset] = useState<[number, number]>([0, 0]);

  // 8. REFERENCIA
  const [refAfuera, setRefAfuera] = useState(false);
  const [refVueltas, setRefVueltas] = useState(0);
  const [refVisitados, setRefVisitados] = useState<number[]>([]);

  const reiniciar = useCallback(() => {
    clearTimers();
    setVistosPresencia([]);
    setObjTamano('grande');
    setOkTamano(0);
    setHechosTamano([]);
    setSubKey(tipo === 'lineas' ? 'horizontal' : tipo === 'formas' ? 'cuadrado' : 'camino');
    setSubHechos([]);
    setRecIdx(0);
    setRecCerrar(false);
    setRecFin(false);
    setDedoPos(null);
    // Laberinto start pos
    let sx = 1;
    let sy = 1;
    GEO.laberinto.forEach((f, y) =>
      [...f].forEach((c, x) => {
        if (c === 'S') {
          sx = x;
          sy = y;
        }
      })
    );
    setLabPos([sx, sy]);
    setLabLlego(false);
    setLabBloqueos(0);
    setHalladosBuscar([]);
    setVistosCuerpo([]);
    setDirActual(null);
    setDirOk(0);
    setDirOrden([]);
    setFichaOffset([0, 0]);
    setRefAfuera(false);
    setRefVueltas(0);
    setRefVisitados([]);
    setResetTick((t) => t + 1);

    if (tipo === 'presencia') decir('Toque cada cuadro. Si hay punto, suena alegre.', '', false);
    else if (tipo === 'tamanos') decir('Busca un punto GRANDE.', '', false);
    else if (tipo === 'camino') decir('Empieza en el punto doble y sigue los puntos en orden.', '', false);
    else if (tipo === 'lineas') decir('Acostada: empieza en el punto doble y sigue los puntos en orden.', '', false);
    else if (tipo === 'formas') decir('Cuadrado: empieza en el punto doble y sigue los puntos en orden.', '', false);
    else if (tipo === 'buscar') {
      const n = Math.min(10, Math.max(1, (unit.actividad && unit.actividad.n) || 10));
      decir(`Encuentra los ${n} puntos. Empieza en la esquina del triángulo.`, '', false);
    } else if (tipo === 'cuerpo') decir('Toque las partes del cuerpo: cabeza, centro, manos y pies.', '', false);
    else if (tipo === 'direcciones') decir('Toque "Empezar juego". También puede usar las flechas del teclado.', '', false);
    else if (tipo === 'referencia') decir('Empieza en la casa: el punto doble de la esquina. Luego sal a buscar un punto.', '', false);
    else if (tipo === 'laberinto') decir('El conejito sale del punto doble. Use las flechas para llevarlo a la meta (el cuadro).', '', false);
  }, [clearTimers, decir, tipo, unit.actividad]);

  useEffect(() => {
    reiniciar();
  }, [unit.id, reiniciar]);

  // Datos activos para recorrido (camino / lineas / formas)
  const activeRecorrido = useMemo(() => {
    if (tipo === 'camino') return { nombre: '', cerrada: false, pts: GEO.camino };
    if (tipo === 'lineas') return GEO.lineas[subKey] || GEO.lineas.horizontal;
    if (tipo === 'formas') return GEO.formas[subKey] || GEO.formas.cuadrado;
    return null;
  }, [tipo, subKey]);

  const handleRecorridoClick = (i: number) => {
    if (!activeRecorrido || recFin) return;
    const pts = activeRecorrido.pts;
    if (recCerrar) {
      if (i === 0) {
        setRecFin(true);
        SON.fin();
        if (tipo === 'camino') {
          decir('¡Llegamos al final del camino!', 'bien');
          marcarListo();
        } else {
          const grupo = tipo === 'lineas' ? GEO.lineas : GEO.formas;
          const nextHechos = subHechos.includes(subKey)
            ? subHechos
            : [...subHechos, subKey];
          setSubHechos(nextHechos);
          const ks = Object.keys(grupo);
          if (nextHechos.length === ks.length) {
            decir(
              `¡Terminaron todas! ${ks.map((k) => grupo[k].nombre).join(', ')}.`,
              'bien'
            );
            marcarListo();
          } else {
            const sig = ks.find((k) => !nextHechos.includes(k)) || ks[0];
            decir(
              `¡${activeRecorrido.nombre} lista! Sigan con: ${grupo[sig].nombre}.`,
              'bien'
            );
            SON.bien();
          }
        }
      } else {
        SON.mal();
        decir('Vuelve al primer punto, el doble, para cerrar la figura.', 'mal');
      }
      return;
    }

    if (i === recIdx) {
      SON.paso(i);
      const nextIdx = recIdx + 1;
      setRecIdx(nextIdx);
      if (nextIdx === pts.length) {
        if (activeRecorrido.cerrada) {
          setRecCerrar(true);
          decir('¡Casi! Ahora vuelve al punto de partida para cerrar la figura.', 'bien');
        } else {
          setRecFin(true);
          if (tipo === 'camino') {
            decir('¡Llegamos al final del camino!', 'bien');
            marcarListo();
          } else {
            const grupo = tipo === 'lineas' ? GEO.lineas : GEO.formas;
            const nextHechos = subHechos.includes(subKey)
              ? subHechos
              : [...subHechos, subKey];
            setSubHechos(nextHechos);
            const ks = Object.keys(grupo);
            if (nextHechos.length === ks.length) {
              decir(
                `¡Terminaron todas! ${ks.map((k) => grupo[k].nombre).join(', ')}.`,
                'bien'
              );
              marcarListo();
            } else {
              const sig = ks.find((k) => !nextHechos.includes(k)) || ks[0];
              decir(
                `¡${activeRecorrido.nombre} lista! Sigan con: ${grupo[sig].nombre}.`,
                'bien'
              );
              SON.bien();
            }
          }
        }
      } else {
        decir(`Punto ${nextIdx} de ${pts.length}. Sigue al siguiente.`, '', false);
      }
    } else if (i < recIdx) {
      SON.vacio();
      decir('Ese ya lo tocaste. Sigue adelante.', '', false);
    } else {
      SON.mal();
      decir('Ese no. Sigue el camino: busca el punto que está al lado.', 'mal');
    }
  };

  const iniciarDemoRecorrido = () => {
    if (!activeRecorrido) return;
    clearTimers();
    const seq = activeRecorrido.cerrada
      ? [...activeRecorrido.pts, activeRecorrido.pts[0]]
      : activeRecorrido.pts;
    setDedoPos(seq[0]);
    decir('Mire: el dedo sale del punto doble y avanza punto por punto.', '', false);

    seq.forEach((pt, k) => {
      addTimer(() => {
        setDedoPos(pt);
        SON.paso(Math.min(k, activeRecorrido.pts.length));
      }, 400 + k * 650);
    });

    addTimer(() => {
      setDedoPos(null);
      decir('Así se hace. Ahora inténtenlo ustedes.', '', true);
    }, 400 + seq.length * 650 + 350);
  };

  // Direcciones juego handlers
  const dirNames = Object.keys(GEO.direcciones.o);
  const dirTexts: Record<string, string> = {
    arriba: '¡Sube! Hacia ARRIBA.',
    abajo: '¡Baja! Hacia ABAJO.',
    izquierda: 'Hacia la IZQUIERDA.',
    derecha: 'Hacia la DERECHA.',
  };

  const lanzarNuevaOrden = useCallback(
    (ordenActual: string[]) => {
      let pool = ordenActual.slice();
      if (!pool.length) {
        pool = [...dirNames, ...dirNames].sort(() => Math.random() - 0.5);
      }
      const next = pool.pop()!;
      setDirOrden(pool);
      setDirActual(next);
      decir(dirTexts[next]);
    },
    [decir, dirNames]
  );

  const responderDireccion = useCallback(
    (k: string) => {
      if (!dirActual) {
        decir('Primero toque "Empezar juego".', '', false);
        return;
      }
      const destino = GEO.direcciones.o[k as keyof typeof GEO.direcciones.o];
      const centro = GEO.direcciones.c;
      setFichaOffset([destino[0] - centro[0], destino[1] - centro[1]]);
      addTimer(() => setFichaOffset([0, 0]), 450);

      if (k === dirActual) {
        const nextOk = dirOk + 1;
        setDirOk(nextOk);
        SON.bien();
        if (nextOk >= 8) {
          setDirActual(null);
          decir('¡Lo lograste! 8 de 8 direcciones. Vuelve al centro.', 'bien');
          marcarListo();
          return;
        }
        decir(`¡Muy bien! (${nextOk} de 8) Vuelve al centro…`, 'bien', false);
        addTimer(() => lanzarNuevaOrden(dirOrden), 1300);
      } else {
        SON.mal();
        decir(
          `Ese es ${k}. Vuelve al centro e intenta de nuevo: ${dirTexts[dirActual]}`,
          'mal'
        );
      }
    },
    [addTimer, decir, dirActual, dirOk, dirOrden, lanzarNuevaOrden, marcarListo]
  );

  // Laberinto mover
  const moverLaberinto = useCallback(
    (dx: number, dy: number) => {
      if (labLlego) return;
      const M = GEO.laberinto;
      const nx = labPos[0] + dx;
      const ny = labPos[1] + dy;
      const c = (M[ny] || '')[nx];
      if (!c || c === '#') {
        setLabBloqueos((b) => b + 1);
        SON.muro();
        decir('¡Uy, bloqueado! Busquemos otro camino.', 'mal');
        return;
      }
      setLabPos([nx, ny]);
      tono(520, 0.06, 'sine', 0.12);
      if (c === 'M') {
        setLabLlego(true);
        decir(
          `¡Llegaste a la meta! Encontraste ${labBloqueos} ${labBloqueos === 1 ? 'bloqueo' : 'bloqueos'} en el camino.`,
          'bien'
        );
        marcarListo();
      } else {
        decir('Avanzando…', '', false);
      }
    },
    [decir, labBloqueos, labLlego, labPos, marcarListo]
  );

  // Teclado ArrowUp/Down/Left/Right para direcciones y laberinto
  useEffect(() => {
    if (tipo !== 'direcciones' && tipo !== 'laberinto') return;
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName || '';
      if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
      if (tipo === 'direcciones' && dirActual) {
        const m: Record<string, string> = {
          ArrowUp: 'arriba',
          ArrowDown: 'abajo',
          ArrowLeft: 'izquierda',
          ArrowRight: 'derecha',
        };
        if (m[e.key]) {
          e.preventDefault();
          responderDireccion(m[e.key]);
        }
      } else if (tipo === 'laberinto') {
        const m: Record<string, [number, number]> = {
          ArrowUp: [0, -1],
          ArrowDown: [0, 1],
          ArrowLeft: [-1, 0],
          ArrowRight: [1, 0],
        };
        if (m[e.key]) {
          e.preventDefault();
          moverLaberinto(m[e.key][0], m[e.key][1]);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [tipo, dirActual, responderDireccion, moverLaberinto]);

  if (tipo === 'ninguna') {
    return (
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-6">
        <p className="text-[var(--muted)]">
          Esta unidad se trabaja solo con material físico. Siga la guía paso a paso.
        </p>
      </div>
    );
  }

  const showDemoBtn = tipo === 'camino' || tipo === 'lineas' || tipo === 'formas';
  const grupoSub =
    tipo === 'lineas' ? GEO.lineas : tipo === 'formas' ? GEO.formas : null;

  return (
    <div key={resetTick} className="space-y-4">
      {/* Barra superior de sub-actividades y controles */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {grupoSub &&
            Object.entries(grupoSub).map(([k, item]) => {
              const active = k === subKey;
              const doneSub = subHechos.includes(k);
              return (
                <button
                  key={k}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    clearTimers();
                    setSubKey(k);
                    setRecIdx(0);
                    setRecCerrar(false);
                    setRecFin(false);
                    setDedoPos(null);
                    decir(
                      `${item.nombre}: empieza en el punto doble y sigue los puntos en orden.`,
                      '',
                      false
                    );
                  }}
                  className={`min-h-[44px] px-3.5 rounded-[4px] border text-[0.88rem] font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-[var(--ink)] text-[var(--surface)] border-[var(--ink)]'
                      : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--ink)]'
                  }`}
                >
                  {doneSub && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                  <span>{item.nombre}</span>
                </button>
              );
            })}
        </div>

        <div className="flex flex-wrap gap-2">
          {showDemoBtn && (
            <button
              type="button"
              onClick={iniciarDemoRecorrido}
              className="min-h-[44px] px-3.5 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] text-[0.88rem] font-semibold text-[var(--ink)] hover:border-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-4 h-4" aria-hidden="true" />
              <span>Ver demostración</span>
            </button>
          )}
          <button
            type="button"
            onClick={reiniciar}
            className="min-h-[44px] px-3.5 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] text-[0.88rem] font-semibold text-[var(--ink)] hover:border-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>

      {/* Lienzo SVG interactivo (viewBox 600 x 400) */}
      <div className="bg-white border border-[var(--line)] rounded-[4px] p-2">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          xmlns="http://www.w3.org/2000/svg"
          className="lam-svg"
          tabIndex={tipo === 'laberinto' ? 0 : undefined}
          aria-label={
            tipo === 'laberinto'
              ? 'Laberinto. Use las flechas para moverse.'
              : `Lámina interactiva: ${unit.titulo}`
          }
        >
          <rect
            className="papel"
            x="1"
            y="1"
            width={W - 2}
            height={H - 2}
            rx="4"
          />
          <path className="esq" d={ESQUINA} />

          {/* 1. PRESENCIA */}
          {tipo === 'presencia' &&
            GEO.presencia.map((k, i) => {
              const visto = vistosPresencia.includes(i);
              return (
                <g
                  key={i}
                  className={`celda ${visto ? 'visto' : ''}`}
                  data-i={i}
                  tabIndex={0}
                  role="button"
                  aria-label={`Cuadro ${i + 1}`}
                  onClick={() => {
                    const next = visto ? vistosPresencia : [...vistosPresencia, i];
                    setVistosPresencia(next);
                    if (k.punto) {
                      SON.bien();
                      decir(`¡Hay punto! Revisados ${next.length} de 6.`, 'bien');
                    } else {
                      SON.vacio();
                      decir(`Aquí no hay punto. Revisados ${next.length} de 6.`);
                    }
                    if (next.length === 6) {
                      addTimer(() => {
                        decir(
                          '¡Muy bien! Revisaron los 6 cuadros y encontraron 4 puntos.',
                          'bien'
                        );
                        marcarListo();
                      }, 700);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      (e.currentTarget as unknown as { click: () => void }).click();
                    }
                  }}
                >
                  <rect x={k.x} y={k.y} width={k.w} height={k.h} rx="6" />
                  {k.punto === 1 && (
                    <circle
                      className="dot"
                      cx={k.x + k.w / 2}
                      cy={k.y + k.h / 2}
                      r="15"
                    />
                  )}
                </g>
              );
            })}

          {/* 2. TAMAÑOS */}
          {tipo === 'tamanos' &&
            GEO.tamanos.map(([x, y, g], i) => (
              <PtSvg
                key={i}
                index={i}
                x={x}
                y={y}
                r={g ? 22 : 9}
                label={`Punto ${g ? 'grande' : 'pequeño'}`}
                hecho={hechosTamano.includes(i)}
                onTrigger={(idx) => {
                  const es = GEO.tamanos[idx][2] ? 'grande' : 'pequeño';
                  tono(GEO.tamanos[idx][2] ? 300 : 900, 0.15);
                  if (okTamano >= 6) return;
                  if (es === objTamano) {
                    const nextOk = okTamano + 1;
                    setOkTamano(nextOk);
                    setHechosTamano((prev) =>
                      prev.includes(idx) ? prev : [...prev, idx]
                    );
                    addTimer(SON.bien, 150);
                    const nextObj = objTamano === 'grande' ? 'pequeño' : 'grande';
                    setObjTamano(nextObj);
                    if (nextOk >= 6) {
                      decir('¡Excelente! Encontraron 3 grandes y 3 pequeños.', 'bien');
                      marcarListo();
                    } else {
                      decir(
                        `¡Muy bien, ese es ${es}! Ahora busca un punto ${nextObj.toUpperCase()}. (${nextOk} de 6)`,
                        'bien'
                      );
                    }
                  } else {
                    SON.mal();
                    decir(`Ese es un punto ${es}. Busca uno ${objTamano}.`, 'mal');
                  }
                }}
              />
            ))}

          {/* 3, 9, 10. RECORRIDOS */}
          {activeRecorrido && (
            <>
              <path
                className="trazo"
                d={
                  recIdx > 0
                    ? 'M' +
                      [
                        ...activeRecorrido.pts.slice(0, recIdx),
                        ...(recFin && activeRecorrido.cerrada
                          ? [activeRecorrido.pts[0]]
                          : []),
                      ]
                        .map((p) => p.join(' '))
                        .join(' L')
                    : ''
                }
              />
              {activeRecorrido.pts.map(([x, y], i) => (
                <PtSvg
                  key={i}
                  index={i}
                  x={x}
                  y={y}
                  r={11}
                  label={i === 0 ? 'Punto de partida' : `Punto ${i + 1}`}
                  doble={i === 0}
                  hecho={i < recIdx}
                  sig={!recFin && i === (recCerrar ? 0 : recIdx)}
                  onTrigger={handleRecorridoClick}
                />
              ))}
              {dedoPos && (
                <circle
                  className="dedo"
                  cx={0}
                  cy={0}
                  r={22}
                  style={{
                    transform: `translate(${dedoPos[0]}px, ${dedoPos[1]}px)`,
                  }}
                  pointerEvents="none"
                />
              )}
            </>
          )}

          {/* 4. LABERINTO */}
          {tipo === 'laberinto' && (() => {
            const M = GEO.laberinto;
            const cw = W / M[0].length;
            const ch = H / M.length;
            return (
              <>
                {M.map((fila, y) =>
                  [...fila].map((c, x) => {
                    const cx = x * cw + cw / 2;
                    const cy = y * ch + ch / 2;
                    if (c === '#') {
                      return (
                        <rect
                          key={`${x}-${y}`}
                          className="muro"
                          x={x * cw + 2}
                          y={y * ch + 2}
                          width={cw - 4}
                          height={ch - 4}
                          rx="4"
                        />
                      );
                    }
                    return (
                      <g key={`${x}-${y}`}>
                        <circle className="rastro" cx={cx} cy={cy} r="5" />
                        {c === 'S' && (
                          <circle
                            cx={cx}
                            cy={cy}
                            r="16"
                            fill="none"
                            stroke="#1C1917"
                            strokeWidth="4"
                          />
                        )}
                        {c === 'M' && (
                          <rect
                            className="meta"
                            x={cx - 17}
                            y={cy - 17}
                            width="34"
                            height="34"
                            rx="4"
                          />
                        )}
                      </g>
                    );
                  })
                )}
                <circle
                  className="ficha"
                  r="13"
                  cx={labPos[0] * cw + cw / 2}
                  cy={labPos[1] * ch + ch / 2}
                />
              </>
            );
          })()}

          {/* 5. BUSCAR */}
          {tipo === 'buscar' && (() => {
            const n = Math.min(10, Math.max(1, (unit.actividad && unit.actividad.n) || 10));
            return GEO.buscar.slice(0, n).map(([x, y], i) => (
              <PtSvg
                key={i}
                index={i}
                x={x}
                y={y}
                r={13}
                label="Punto escondido"
                hecho={halladosBuscar.includes(i)}
                onTrigger={(idx) => {
                  if (halladosBuscar.includes(idx)) {
                    SON.vacio();
                    decir('Ese ya lo encontraste. Busca otro.');
                    return;
                  }
                  const next = [...halladosBuscar, idx];
                  setHalladosBuscar(next);
                  tono(480 + next.length * 40, 0.16);
                  if (next.length === n) {
                    decir(`¡${NUMS[n] || n}! ¡Encontraste los ${n} puntos!`, 'bien');
                    marcarListo();
                  } else {
                    const numWord = String(NUMS[next.length] || next.length);
                    decir(
                      `¡${numWord.charAt(0).toUpperCase() + numWord.slice(1)}! Faltan ${n - next.length}.`,
                      'bien'
                    );
                  }
                }}
              />
            ));
          })()}

          {/* 6. CUERPO */}
          {tipo === 'cuerpo' && (() => {
            const c = GEO.cuerpo;
            const ks = Object.keys(c);
            return (
              <>
                <circle className="cuerpo-l" cx="300" cy="72" r="38" />
                <rect className="cuerpo-l" x="252" y="118" width="96" height="128" rx="30" />
                <path
                  className="cuerpo-l"
                  d="M256 140 L170 228 M344 140 L430 228 M280 246 L262 342 M320 246 L338 342"
                />
                <text className="lbl" x="20" y="390">
                  Vista de espaldas: la derecha del dibujo es la derecha del niño
                </text>
                <text className="lbl" x="120" y="205">
                  IZQUIERDA
                </text>
                <text className="lbl" x="400" y="205">
                  DERECHA
                </text>
                {ks.map((k, i) => {
                  const [x, y, msg] = c[k];
                  return (
                    <PtSvg
                      key={k}
                      index={i}
                      x={x}
                      y={y}
                      r={k === 'centro' ? 14 : 12}
                      doble={k === 'centro'}
                      label={msg}
                      hecho={vistosCuerpo.includes(i)}
                      onTrigger={(idx) => {
                        const next = vistosCuerpo.includes(idx)
                          ? vistosCuerpo
                          : [...vistosCuerpo, idx];
                        setVistosCuerpo(next);
                        SON.paso(idx);
                        decir(c[ks[idx]][2], 'bien');
                        if (next.length === ks.length) {
                          addTimer(() => {
                            decir(
                              '¡Muy bien! Ya conoces tu centro, arriba, abajo, derecha e izquierda.',
                              'bien'
                            );
                            marcarListo();
                          }, 1600);
                        }
                      }}
                    />
                  );
                })}
              </>
            );
          })()}

          {/* 7. DIRECCIONES */}
          {tipo === 'direcciones' && (() => {
            const d = GEO.direcciones;
            const dirs = Object.keys(d.o) as Array<keyof typeof d.o>;
            return (
              <>
                <g aria-hidden="true">
                  {dirs.map((k) => (
                    <line
                      key={k}
                      x1={d.c[0]}
                      y1={d.c[1]}
                      x2={d.o[k][0]}
                      y2={d.o[k][1]}
                      stroke="#DFD7C8"
                      strokeWidth="4"
                      strokeDasharray="2 12"
                      strokeLinecap="round"
                    />
                  ))}
                </g>
                <PtSvg
                  index={9}
                  x={d.c[0]}
                  y={d.c[1]}
                  r={14}
                  doble
                  label="Centro"
                  onTrigger={() => {
                    SON.vacio();
                    decir('Este es el centro.', '', false);
                  }}
                />
                {dirs.map((k, i) => (
                  <PtSvg
                    key={k}
                    index={i}
                    x={d.o[k][0]}
                    y={d.o[k][1]}
                    r={13}
                    label={k}
                    onTrigger={() => responderDireccion(k)}
                  />
                ))}
                <circle
                  className="ficha"
                  cx={d.c[0]}
                  cy={d.c[1]}
                  r="10"
                  style={{
                    transform: `translate(${fichaOffset[0]}px, ${fichaOffset[1]}px)`,
                  }}
                  pointerEvents="none"
                />
              </>
            );
          })()}

          {/* 8. REFERENCIA */}
          {tipo === 'referencia' && (
            <>
              <PtSvg
                index={9}
                x={GEO.referencia.casa[0]}
                y={GEO.referencia.casa[1]}
                r={12}
                doble
                label="Punto de partida (casa)"
                onTrigger={() => {
                  if (refAfuera) {
                    setRefAfuera(false);
                    const nextV = refVueltas + 1;
                    setRefVueltas(nextV);
                    SON.bien();
                    if (nextV >= 4) {
                      decir(
                        '¡Volviste a casa 4 veces! Ya sabes usar el punto de partida.',
                        'bien'
                      );
                      marcarListo();
                    } else {
                      decir(
                        `¡Llegaste a casa! (${nextV} de 4) Sal otra vez a buscar un punto.`,
                        'bien'
                      );
                    }
                  } else {
                    SON.vacio();
                    decir('Esta es tu casa. Ahora sal a buscar un punto.');
                  }
                }}
              />
              {GEO.referencia.pts.map(([x, y], i) => (
                <PtSvg
                  key={i}
                  index={i}
                  x={x}
                  y={y}
                  r={13}
                  label={`Punto ${i + 1}`}
                  hecho={refVisitados.includes(i)}
                  onTrigger={(idx) => {
                    if (refAfuera) {
                      SON.mal();
                      decir('Primero vuelve a casa, al punto doble.', 'mal');
                      return;
                    }
                    setRefAfuera(true);
                    setRefVisitados((prev) =>
                      prev.includes(idx) ? prev : [...prev, idx]
                    );
                    SON.paso(idx);
                    decir('¡Encontraste un punto! Ahora vuelve a casa.', 'bien');
                  }}
                />
              ))}
            </>
          )}
        </svg>
      </div>

      {/* Estado en vivo de la actividad */}
      <div
        aria-live="polite"
        className={`min-h-[3.2em] px-4 py-3 rounded-[4px] border font-semibold text-[1.02rem] ${
          estadoClase === 'bien'
            ? 'bg-[var(--ok-soft)] border-[var(--ok)] text-[var(--ink)]'
            : estadoClase === 'mal'
              ? 'bg-[var(--warn-soft)] border-[var(--warn)] text-[var(--ink)]'
              : 'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)]'
        }`}
      >
        {estadoMsg}
      </div>

      {/* Controles extra: cruceta en pantalla para direcciones y laberinto */}
      {tipo === 'direcciones' && (
        <div className="space-y-4 pt-1">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                setDirOk(0);
                lanzarNuevaOrden([]);
              }}
              className="min-h-[44px] px-5 bg-[var(--accent)] text-[var(--accent-ink)] rounded-[4px] font-bold cursor-pointer"
            >
              Empezar juego (8 órdenes)
            </button>
          </div>
          <div
            aria-label="Cruceta de direcciones"
            className="grid grid-cols-3 gap-2 w-[184px] mx-auto"
          >
            <span />
            <button
              type="button"
              aria-label="Arriba"
              onClick={() => responderDireccion('arriba')}
              className="min-h-[48px] rounded-[4px] border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--ink)] flex items-center justify-center cursor-pointer"
            >
              <ArrowUp className="w-5 h-5" aria-hidden="true" />
            </button>
            <span />
            <button
              type="button"
              aria-label="Izquierda"
              onClick={() => responderDireccion('izquierda')}
              className="min-h-[48px] rounded-[4px] border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--ink)] flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Abajo"
              onClick={() => responderDireccion('abajo')}
              className="min-h-[48px] rounded-[4px] border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--ink)] flex items-center justify-center cursor-pointer"
            >
              <ArrowDown className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Derecha"
              onClick={() => responderDireccion('derecha')}
              className="min-h-[48px] rounded-[4px] border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--ink)] flex items-center justify-center cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {tipo === 'laberinto' && (
        <div
          aria-label="Cruceta del laberinto"
          className="grid grid-cols-3 gap-2 w-[184px] mx-auto pt-1"
        >
          <span />
          <button
            type="button"
            aria-label="Arriba"
            onClick={() => moverLaberinto(0, -1)}
            className="min-h-[48px] rounded-[4px] border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--ink)] flex items-center justify-center cursor-pointer"
          >
            <ArrowUp className="w-5 h-5" aria-hidden="true" />
          </button>
          <span />
          <button
            type="button"
            aria-label="Izquierda"
            onClick={() => moverLaberinto(-1, 0)}
            className="min-h-[48px] rounded-[4px] border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--ink)] flex items-center justify-center cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Abajo"
            onClick={() => moverLaberinto(0, 1)}
            className="min-h-[48px] rounded-[4px] border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--ink)] flex items-center justify-center cursor-pointer"
          >
            <ArrowDown className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Derecha"
            onClick={() => moverLaberinto(1, 0)}
            className="min-h-[48px] rounded-[4px] border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--ink)] flex items-center justify-center cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};
