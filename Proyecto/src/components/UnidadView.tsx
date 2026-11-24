import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Clock,
  Download,
  Edit3,
  Lock,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useCamino } from '../context/CaminoContext';
import {
  abierta,
  anteriorDe,
  avanceMod,
  ETAPAS,
  MODULOS,
  numEnModulo,
  pendiente,
  siguienteDe,
  unidad,
  unidadesDe,
} from '../data/curriculum';
import { UnitDef } from '../types/camino';
import { callar, hablar, SON, vozDisponible } from '../utils/audio';
import {
  descargarCartilla,
  descargarSVG,
  fecha,
  laminas,
} from '../utils/printTemplates';
import { InteractivePlate } from './InteractivePlate';
import { UnidadEditarModal } from './Modals';

interface UnidadViewProps {
  unitId: string;
}

export const UnidadView: React.FC<UnidadViewProps> = ({ unitId }) => {
  const {
    rol,
    perfil,
    done,
    checks,
    actividades,
    intentos,
    contenido,
    ajustes,
    tabUnidad,
    setTabUnidad,
    marcarPaso,
    registrarCierreUnidad,
    navegar,
    mostrarToast,
    anunciarVivo,
    soloLectura,
  } = useCamino();

  const [logroSeleccionado, setLogroSeleccionado] = useState<
    'solo' | 'ayuda' | 'aun' | ''
  >('');
  const [editando, setEditando] = useState<boolean>(false);

  const esDocente = rol === 'docente';
  const u = unidad(unitId, contenido);

  // Validación de acceso y desbloqueo secuencial
  useEffect(() => {
    setLogroSeleccionado('');
    if (!u) {
      navegar('#aula');
      return;
    }
    if (!abierta(u, rol, done, contenido)) {
      const ant = anteriorDe(u, contenido);
      mostrarToast(
        `Esta unidad se abre cuando terminen "${ant ? ant.titulo : 'la anterior'}".`
      );
      const pend = pendiente(done, contenido) || u;
      navegar(`#u-${pend.id}`);
      return;
    }
    if (!esDocente && !perfil) {
      navegar('#aula');
      mostrarToast('Primero escriba el nombre del niño.');
    }
  }, [u, rol, done, contenido, esDocente, perfil, navegar, mostrarToast]);

  if (!u || !abierta(u, rol, done, contenido) || (!esDocente && !perfil)) {
    return null;
  }

  const mod = MODULOS.find((m) => m.id === u.modulo)!;
  const listaMod = unidadesDe(mod.id, contenido);
  const avMod = avanceMod(mod.id, done, contenido);
  const numMod = numEnModulo(u, contenido);
  const tabs: Array<{ id: 'guia' | 'lamina' | 'docente'; label: string }> = [
    { id: 'guia', label: 'Guía para el acompañante' },
    { id: 'lamina', label: 'Lámina interactiva' },
    ...(esDocente ? [{ id: 'docente' as const, label: 'Para el docente' }] : []),
  ];

  const activeTab = tabs.some((t) => t.id === tabUnidad) ? tabUnidad : 'guia';
  const ch = checks[u.id] || [];
  const totalPasos = (u.pasos || []).length;
  const hechosPasos = ch.filter(Boolean).length;
  const unitDone = done[u.id];
  const sigUnidad = siguienteDe(u, contenido);
  const prevIntentos = intentos[u.id] || 0;
  const unitLaminas = laminas(u, ajustes.escala);

  const textoGuia = (unit: UnitDef) =>
    `${unit.titulo}. Objetivo: ${unit.objetivo} Paso a paso. ${(unit.pasos || [])
      .map((p, i) => `Paso ${i + 1}: ${p}`)
      .join(' ')} Cómo guiar la mano: ${unit.mano || ''} Si algo no sale: ${unit.consejo || ''}`;

  const handleCompletar = () => {
    if (!logroSeleccionado) return;
    if (logroSeleccionado === 'aun') {
      registrarCierreUnidad(u.id, 'aun');
      mostrarToast('Intento guardado. ¡Mañana lo intentan de nuevo!');
      return;
    }
    registrarCierreUnidad(u.id, logroSeleccionado);
    SON.fin();
    anunciarVivo('Unidad completada.');
    mostrarToast(
      sigUnidad
        ? `¡Unidad completada! Se abrió: ${sigUnidad.titulo}`
        : '¡Completaron todas las unidades!'
    );
    navegar(sigUnidad ? `#u-${sigUnidad.id}` : '#aula');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
      {soloLectura && (
        <div
          role="status"
          className="mb-6 border border-[var(--warn)] bg-[var(--warn-soft)] rounded-[4px] p-4 text-[0.94rem]"
        >
          <strong>El avance se está guardando solo en este dispositivo.</strong>{' '}
          Para que el docente vea el progreso, pídale permiso de{' '}
          <strong>Colaborador</strong>.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Índice lateral del módulo */}
        <aside className="lg:col-span-4 xl:col-span-3 bg-[var(--surface)] border border-[var(--line)] rounded-[4px] lg:sticky lg:top-24">
          <div className="p-4 border-b border-[var(--line)] space-y-2">
            <span className="block text-[0.76rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
              Módulo {mod.num}
            </span>
            <h2 className="font-editorial text-[1.15rem] text-[var(--ink)]">
              {mod.titulo}
            </h2>
            {esDocente ? (
              <p className="text-[0.84rem] text-[var(--muted)]">
                Vista docente: todas abiertas
              </p>
            ) : (
              <div className="space-y-1">
                <div className="h-2 rounded-[4px] bg-[var(--bg)] border border-[var(--line)] overflow-hidden">
                  <div
                    className="h-full bg-[var(--ok)]"
                    style={{ width: `${avMod.p}%` }}
                  />
                </div>
                <p className="text-[0.84rem] text-[var(--muted)] tabular-nums">
                  {avMod.h} de {avMod.n} completadas · {avMod.p}%
                </p>
              </div>
            )}
          </div>

          <ol className="p-2 space-y-1">
            {listaMod.map((item, idx) => {
              const isDone = !!done[item.id];
              const isOpen = abierta(item, rol, done, contenido);
              const isCurrent = item.id === u.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#u-${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navegar(`#u-${item.id}`);
                    }}
                    aria-current={isCurrent ? 'page' : undefined}
                    aria-label={`Unidad ${idx + 1}: ${item.titulo}${
                      isDone ? ', completada' : !isOpen ? ', bloqueada' : ''
                    }`}
                    className={`min-h-[44px] px-2.5 py-2 rounded-[4px] grid grid-cols-[28px_1fr] gap-2.5 items-center text-[0.9rem] transition-colors ${
                      isCurrent
                        ? 'bg-[var(--accent-soft)] font-bold text-[var(--ink)]'
                        : !isOpen
                          ? 'text-[var(--muted)] hover:bg-[var(--bg)]'
                          : 'text-[var(--ink)] hover:bg-[var(--bg)]'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[0.76rem] font-bold border ${
                        isDone
                          ? 'bg-[var(--ok)] border-[var(--ok)] text-[var(--surface)]'
                          : !isOpen
                            ? 'bg-[var(--bg)] border-[var(--line)] text-[var(--muted)]'
                            : 'bg-[var(--surface)] border-[var(--line)] text-[var(--ink)]'
                      }`}
                    >
                      {isDone ? (
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : !isOpen ? (
                        <Lock className="w-3 h-3" aria-hidden="true" />
                      ) : (
                        idx + 1
                      )}
                    </span>
                    <span className="leading-snug">{item.titulo}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </aside>

        {/* Contenido principal de la unidad */}
        <section className="lg:col-span-8 xl:col-span-9 space-y-6">
          <div className="space-y-3">
            <a
              href="#aula"
              onClick={(e) => {
                e.preventDefault();
                navegar('#aula');
              }}
              className="inline-flex items-center gap-1.5 font-semibold text-[0.92rem] text-[var(--ink)] underline underline-offset-4 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Volver al aula</span>
            </a>

            <span className="block text-[0.78rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
              Módulo {mod.num} · Unidad {numMod.i} de {numMod.n} · Etapa:{' '}
              {ETAPAS[u.etapa] || '—'}
            </span>

            <h1 className="font-editorial text-[2rem] md:text-[2.45rem] leading-[1.15] text-[var(--ink)]">
              {u.titulo}
            </h1>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="inline-flex items-center gap-1.5 text-[0.92rem] text-[var(--muted)] mr-2">
                <Clock className="w-4 h-4" aria-hidden="true" />
                <span>{u.duracion}</span>
              </span>

              {vozDisponible() && (
                <>
                  <button
                    type="button"
                    onClick={() => hablar(textoGuia(u))}
                    className="min-h-[44px] px-3.5 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] text-[0.88rem] font-semibold hover:border-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" aria-hidden="true" />
                    <span>Escuchar la guía</span>
                  </button>
                  <button
                    type="button"
                    onClick={callar}
                    className="min-h-[44px] px-3.5 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] text-[0.88rem] font-semibold hover:border-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <VolumeX className="w-4 h-4" aria-hidden="true" />
                    <span>Parar voz</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() =>
                  descargarCartilla(
                    u,
                    ajustes.escala,
                    contenido,
                    esDocente,
                    mostrarToast
                  )
                }
                className="min-h-[44px] px-3.5 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] text-[0.88rem] font-semibold hover:border-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Descargar cartilla</span>
              </button>

              {esDocente && (
                <button
                  type="button"
                  onClick={() => setEditando(true)}
                  className="min-h-[44px] px-3.5 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] text-[0.88rem] font-semibold hover:border-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" aria-hidden="true" />
                  <span>Editar unidad</span>
                </button>
              )}
            </div>
          </div>

          {/* Pestañas */}
          <div
            role="tablist"
            className="flex flex-wrap gap-2 border-b border-[var(--line)]"
          >
            {tabs.map((t) => {
              const selected = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  onClick={() => setTabUnidad(t.id)}
                  className={`min-h-[44px] px-4 font-semibold text-[0.94rem] border-b-[3px] -mb-[1px] cursor-pointer transition-colors ${
                    selected
                      ? 'border-[var(--accent)] text-[var(--ink)]'
                      : 'border-transparent text-[var(--muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Contenido de la pestaña */}
          <div role="tabpanel">
            {activeTab === 'guia' && (
              <div className="space-y-6">
                {/* Objetivo */}
                <div className="bg-[var(--accent-soft)] border border-[var(--line)] rounded-[4px] p-5 space-y-1.5">
                  <span className="block text-[0.76rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
                    Para qué sirve
                  </span>
                  <p className="text-[1.06rem] text-[var(--ink)] leading-[1.6]">
                    {u.objetivo}
                  </p>
                </div>

                {/* Materiales + Cómo guiar la mano */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-5 space-y-2.5">
                    <h2 className="font-editorial text-[1.25rem] text-[var(--ink)]">
                      Lo que necesitan
                    </h2>
                    <ul className="list-disc pl-5 space-y-1.5 text-[0.95rem] text-[var(--ink)]">
                      {(u.materiales || []).length > 0 ? (
                        u.materiales.map((mat, i) => <li key={i}>{mat}</li>)
                      ) : (
                        <li>Solo la lámina</li>
                      )}
                    </ul>
                  </div>

                  <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-5 grid grid-cols-[56px_1fr] gap-4 items-start">
                    <svg
                      width="56"
                      height="56"
                      viewBox="0 0 56 56"
                      aria-hidden="true"
                    >
                      <circle
                        cx="28"
                        cy="28"
                        r="27"
                        fill="var(--accent-soft)"
                      />
                      <path
                        d="M20 40 V24 a3 3 0 0 1 6 0 V14 a3 3 0 0 1 6 0 v14 M32 26 a3 3 0 0 1 6 0 v6 M38 30 a3 3 0 0 1 5 1 v4 c0 6-4 10-10 10h-4c-5 0-8-3-10-6l-4-6a3 3 0 0 1 5-3l2 3"
                        fill="none"
                        stroke="var(--ink)"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="space-y-1.5">
                      <h2 className="font-editorial text-[1.25rem] text-[var(--ink)]">
                        Cómo guiar la mano
                      </h2>
                      <p className="text-[0.95rem] text-[var(--ink)] leading-[1.6]">
                        {u.mano}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lista de pasos interactiva */}
                <div className="space-y-3">
                  <div>
                    <h2 className="font-editorial text-[1.4rem] text-[var(--ink)]">
                      Paso a paso
                    </h2>
                    <p className="text-[0.92rem] text-[var(--muted)]">
                      Marque cada paso cuando lo hayan hecho con el niño.
                    </p>
                  </div>

                  <ol className="space-y-2.5">
                    {(u.pasos || []).map((paso, i) => {
                      const checked = !!ch[i];
                      return (
                        <li
                          key={i}
                          className={`grid grid-cols-[auto_1fr] gap-3.5 items-start p-4 rounded-[4px] border ${
                            checked
                              ? 'bg-[var(--ok-soft)] border-[var(--ok)]'
                              : 'bg-[var(--surface)] border-[var(--line)]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            id={`ps-${u.id}-${i}`}
                            checked={checked}
                            disabled={esDocente}
                            onChange={(e) =>
                              marcarPaso(u.id, i, e.target.checked)
                            }
                            className="w-6 h-6 mt-1 accent-[var(--ok)] cursor-pointer"
                          />
                          <label
                            htmlFor={`ps-${u.id}-${i}`}
                            className="cursor-pointer text-[0.98rem] text-[var(--ink)] leading-[1.55]"
                          >
                            <span className="block text-[0.82rem] font-bold text-[var(--muted)]">
                              Paso {i + 1}
                            </span>
                            {paso}
                          </label>
                        </li>
                      );
                    })}
                  </ol>
                </div>

                {/* Consejo */}
                <div className="bg-[var(--warn-soft)] border border-[var(--warn)] rounded-[4px] p-5 space-y-1.5">
                  <h2 className="font-editorial text-[1.2rem] text-[var(--ink)]">
                    Si algo no sale
                  </h2>
                  <p className="text-[0.95rem] text-[var(--ink)] leading-[1.6]">
                    {u.consejo}
                  </p>
                </div>

                {/* Vista previa lámina para imprimir */}
                <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-5 space-y-4">
                  <div>
                    <h2 className="font-editorial text-[1.25rem] text-[var(--ink)]">
                      Lámina para imprimir
                    </h2>
                    <p className="text-[0.9rem] text-[var(--muted)]">
                      Así se ve la zona táctil: solo relieve, sin colores. La
                      esquina con triángulo va arriba a la izquierda.
                    </p>
                  </div>

                  {unitLaminas.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {unitLaminas.map((lam, idx) => (
                          <figure key={idx} className="space-y-1.5">
                            <div
                              className="bg-white border border-[var(--line)] rounded-[4px] p-2"
                              dangerouslySetInnerHTML={{
                                __html: lam.svg.replace(
                                  '<svg ',
                                  `<svg class="w-full h-auto block" role="img" aria-label="${lam.titulo}" `
                                ),
                              }}
                            />
                            <figcaption className="text-[0.84rem] text-[var(--muted)]">
                              {lam.titulo}
                            </figcaption>
                          </figure>
                        ))}
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            descargarSVG(
                              u,
                              ajustes.escala,
                              contenido,
                              mostrarToast
                            )
                          }
                          className="min-h-[44px] px-4 rounded-[4px] border border-[var(--ink)] bg-[var(--surface)] text-[0.9rem] font-semibold text-[var(--ink)] hover:bg-[var(--bg)] inline-flex items-center gap-2 cursor-pointer"
                        >
                          <Download className="w-4 h-4" aria-hidden="true" />
                          <span>
                            Descargar lámina para impresora en relieve (SVG)
                          </span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-[var(--muted)]">
                      Esta unidad no tiene lámina digital.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'lamina' && (
              <div className="space-y-4">
                <p className="text-[var(--muted)] max-w-[68ch]">
                  Practique aquí antes de hacerlo con el niño: cada punto suena
                  al tocarlo. También pueden jugarlo juntos: el niño escucha los
                  sonidos mientras usted toca.{' '}
                  {actividades[u.id] && (
                    <strong className="text-[var(--ok)]">
                      Ya completaron esta práctica.
                    </strong>
                  )}
                </p>
                <InteractivePlate unit={u} />
              </div>
            )}

            {activeTab === 'docente' && esDocente && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-5 space-y-2">
                    <span className="block text-[0.76rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
                      Competencia
                    </span>
                    <p className="text-[0.98rem] text-[var(--ink)]">
                      {u.competencia || '—'}
                    </p>
                  </div>

                  <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-5 space-y-2">
                    <span className="block text-[0.76rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
                      Resultado de aprendizaje esperado
                    </span>
                    <p className="text-[0.98rem] text-[var(--ink)]">
                      {u.resultado || '—'}
                    </p>
                  </div>
                </div>

                <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-5 space-y-2">
                  <span className="block text-[0.76rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
                    Criterio de evaluación formativa
                  </span>
                  <p className="text-[0.98rem] text-[var(--ink)]">
                    {u.criterio || '—'}
                  </p>
                </div>

                <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-5 space-y-2">
                  <span className="block text-[0.76rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
                    Adaptación al aula de párvulos y preescolar
                  </span>
                  <p className="text-[0.98rem] text-[var(--ink)]">
                    Trabaje esta unidad en grupos pequeños: los compañeros
                    videntes pueden hacer el mismo ejercicio con los ojos
                    tapados. Así la actividad es de todos y nadie queda aparte.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      descargarCartilla(
                        u,
                        ajustes.escala,
                        contenido,
                        true,
                        mostrarToast
                      )
                    }
                    className="min-h-[44px] px-4 rounded-[4px] border border-[var(--ink)] bg-[var(--surface)] text-[0.92rem] font-semibold cursor-pointer"
                  >
                    Descargar cartilla con sección docente
                  </button>
                  <a
                    href="#docente"
                    onClick={(e) => {
                      e.preventDefault();
                      navegar('#docente');
                    }}
                    className="min-h-[44px] px-4 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] text-[0.92rem] font-semibold inline-flex items-center"
                  >
                    Ver seguimiento de los niños
                  </a>
                  <a
                    href="#evaluacion"
                    onClick={(e) => {
                      e.preventDefault();
                      navegar('#evaluacion');
                    }}
                    className="min-h-[44px] px-4 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] text-[0.92rem] font-semibold inline-flex items-center"
                  >
                    Abrir ficha de evaluación
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Bloque de cierre para acompañantes */}
          {!esDocente && perfil && (
            <div className="border-2 border-[var(--ink)] bg-[var(--surface)] rounded-[4px] p-6 space-y-4">
              {unitDone ? (
                <>
                  <span className="inline-flex items-center gap-1.5 text-[0.8rem] font-bold uppercase tracking-[0.06em] text-[var(--ok)]">
                    <Check className="w-4 h-4" aria-hidden="true" />
                    Unidad completada {fecha(unitDone.t)}
                  </span>
                  <h2 className="font-editorial text-[1.4rem] text-[var(--ink)]">
                    {unitDone.logro === 'solo'
                      ? `${perfil.nino} lo logró solo`
                      : `${perfil.nino} lo logró con ayuda`}
                  </h2>
                  <p className="text-[0.94rem] text-[var(--muted)]">
                    Pueden repetirla cuando quieran: repetir ayuda a que las
                    manos recuerden.
                  </p>
                  <div>
                    <a
                      href={sigUnidad ? `#u-${sigUnidad.id}` : '#aula'}
                      onClick={(e) => {
                        e.preventDefault();
                        navegar(sigUnidad ? `#u-${sigUnidad.id}` : '#aula');
                      }}
                      className="min-h-[44px] px-5 bg-[var(--accent)] text-[var(--accent-ink)] rounded-[4px] font-bold inline-flex items-center"
                    >
                      {sigUnidad
                        ? `Ir a la siguiente: ${sigUnidad.titulo}`
                        : 'Volver al aula'}
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="font-editorial text-[1.45rem] text-[var(--ink)]">
                    ¿Cómo les fue?
                  </h2>
                  <p className="text-[0.94rem] text-[var(--muted)] tabular-nums">
                    Pasos realizados:{' '}
                    <strong className="text-[var(--ink)]">
                      {hechosPasos} de {totalPasos}
                    </strong>
                    {hechosPasos < totalPasos
                      ? ' — marque los pasos en la guía cuando los hagan.'
                      : ''}
                    {prevIntentos > 0
                      ? ` · Intentos anteriores: ${prevIntentos}`
                      : ''}
                  </p>

                  <fieldset className="border-0 p-0 m-0">
                    <legend className="sr-only">Resultado del niño</legend>
                    <div className="flex flex-wrap gap-3">
                      {(
                        [
                          { id: 'solo', label: 'Lo logró solo' },
                          { id: 'ayuda', label: 'Lo logró con ayuda' },
                          { id: 'aun', label: 'Aún no, lo repetiremos' },
                        ] as const
                      ).map((opt) => {
                        const checked = logroSeleccionado === opt.id;
                        return (
                          <label
                            key={opt.id}
                            className={`min-h-[44px] px-4 py-2 rounded-[4px] border flex items-center gap-2.5 font-semibold cursor-pointer ${
                              checked
                                ? 'border-[var(--ok)] bg-[var(--ok-soft)] text-[var(--ink)]'
                                : 'border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]'
                            }`}
                          >
                            <input
                              type="radio"
                              name="logro"
                              value={opt.id}
                              checked={checked}
                              onChange={() => setLogroSeleccionado(opt.id)}
                              className="w-5 h-5 accent-[var(--ok)]"
                            />
                            <span>{opt.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      disabled={hechosPasos < totalPasos || !logroSeleccionado}
                      onClick={handleCompletar}
                      className="min-h-[44px] px-5 rounded-[4px] bg-[var(--ok)] text-[var(--surface)] font-bold disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {logroSeleccionado === 'aun'
                        ? 'Guardar intento y repetir otro día'
                        : 'Completar unidad y abrir la siguiente'}
                    </button>
                    <span className="text-[0.9rem] text-[var(--muted)]">
                      {hechosPasos < totalPasos
                        ? 'Faltan pasos por marcar.'
                        : !logroSeleccionado
                          ? 'Elija cómo le fue al niño.'
                          : ''}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </section>
      </div>

      {editando && (
        <UnidadEditarModal unit={u} onClose={() => setEditando(false)} />
      )}
    </div>
  );
};
