import React, { useState } from 'react';
import { Check, Lock, Plus } from 'lucide-react';
import { useCamino } from '../context/CaminoContext';
import {
  abierta,
  avanceMod,
  ETAPAS,
  MODULOS,
  numEnModulo,
  pendiente,
  unidadesDe,
} from '../data/curriculum';
import { ModuloDef } from '../types/camino';
import { UnidadEditarModal } from './Modals';

function EtapaIcon({ n }: { n: number }) {
  const paths: Record<number, React.ReactNode> = {
    1: (
      <>
        <circle cx="10" cy="12" r="4" />
        <circle cx="24" cy="12" r="2.4" />
        <circle cx="36" cy="12" r="4" />
      </>
    ),
    2: (
      <>
        <circle cx="22" cy="12" r="4" />
        <path
          d="M22 2v4M22 18v4M10 12h4M30 12h4"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </>
    ),
    3: (
      <path
        d="M4 18 C14 2, 30 2, 40 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    ),
    4: (
      <>
        <rect
          x="6"
          y="3"
          width="16"
          height="16"
          rx="1"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <circle
          cx="34"
          cy="11"
          r="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
      </>
    ),
  };
  return (
    <svg
      width="44"
      height="24"
      viewBox="0 0 44 24"
      fill="currentColor"
      aria-hidden="true"
      className="mb-1.5"
    >
      {paths[n]}
    </svg>
  );
}

function ModuloHeaderArt({ mod }: { mod: ModuloDef }) {
  return (
    <div className="h-[116px] bg-[var(--accent-soft)] border-b border-[var(--line)] relative overflow-hidden">
      <svg
        viewBox="0 0 460 120"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
      >
        {mod.id === 'm1' &&
          Array.from({ length: 4 }).map((_, r) =>
            Array.from({ length: 14 }).map((__, c) => {
              const on = (r * 7 + c * 3) % 5 < 2;
              return (
                <circle
                  key={`${r}-${c}`}
                  cx={110 + c * 26}
                  cy={22 + r * 26}
                  r={on ? 6 : 3}
                  fill="var(--ink)"
                  opacity={on ? 0.85 : 0.25}
                />
              );
            })
          )}
        {mod.id === 'm2' && (
          <>
            <path
              d="M120 110 C150 40, 190 40, 210 80 S270 120, 300 60 S360 20, 400 70"
              fill="none"
              stroke="var(--ink)"
              strokeWidth="6"
              strokeDasharray="1 14"
              strokeLinecap="round"
              opacity="0.7"
            />
            <circle
              cx="330"
              cy="60"
              r="28"
              fill="none"
              stroke="var(--ink)"
              strokeWidth="4"
              strokeDasharray="2 8"
              opacity="0.5"
            />
          </>
        )}
        {mod.id === 'm3' &&
          [0, 1, 2, 3].map((k) =>
            [
              [0, 0],
              [0, 1],
              [0, 2],
              [1, 0],
              [1, 1],
              [1, 2],
            ].map(([c, r], j) => {
              const patterns = [
                [1, 0, 0, 0, 0, 0],
                [1, 1, 0, 0, 0, 0],
                [1, 0, 0, 1, 0, 0],
                [1, 0, 0, 1, 1, 0],
              ];
              const on = patterns[k][j];
              return (
                <circle
                  key={`${k}-${j}`}
                  cx={150 + k * 70 + c * 22}
                  cy={30 + r * 24}
                  r={on ? 7 : 3.5}
                  fill="var(--ink)"
                  opacity={on ? 0.85 : 0.25}
                />
              );
            })
          )}
      </svg>
      <span className="absolute left-4 top-3 font-editorial text-[2.4rem] leading-none font-normal text-[var(--ink)]">
        {String(mod.num).padStart(2, '0')}
      </span>
    </div>
  );
}

export const AulaView: React.FC = () => {
  const {
    rol,
    soloLectura,
    perfil,
    setPerfil,
    done,
    contenido,
    navegar,
    mostrarToast,
  } = useCamino();

  const [nino, setNino] = useState('');
  const [acompanante, setAcompanante] = useState('');
  const [relacion, setRelacion] = useState('Mamá');
  const [crearModulo, setCrearModulo] = useState<'m1' | 'm2' | 'm3' | null>(null);

  const esDocente = rol === 'docente';
  const sig = pendiente(done, contenido);

  const handleSubmitPerfil = (e: React.FormEvent) => {
    e.preventDefault();
    const nClean = nino.trim();
    const aClean = acompanante.trim();
    if (!nClean || !aClean) return;
    setPerfil({ nino: nClean, acompanante: aClean, relacion });
    mostrarToast('¡Listo! Empiecen por la Unidad 1.');
  };

  const etapasStrip = (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          className="border border-[var(--line)] rounded-[4px] p-3 bg-[var(--bg)] text-[0.84rem]"
        >
          <EtapaIcon n={n} />
          <strong className="block text-[0.92rem] text-[var(--ink)]">
            {n}. {ETAPAS[n]}
          </strong>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-10 space-y-10">
      {soloLectura && (
        <div
          role="status"
          className="border border-[var(--warn)] bg-[var(--warn-soft)] rounded-[4px] p-4 text-[0.95rem] text-[var(--ink)]"
        >
          <strong>El avance se está guardando solo en este dispositivo.</strong>{' '}
          Para que el docente vea el progreso, pídale que le comparta la app con
          permiso de <strong>Colaborador</strong> (Contributor).
        </div>
      )}

      {/* Cabecera de bienvenida o resumen de sesión */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {esDocente ? (
          <>
            <div className="lg:col-span-7 bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-6 md:p-8 flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <span className="block text-[0.78rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
                  Vista docente
                </span>
                <h1 className="font-editorial text-[1.9rem] md:text-[2.2rem] text-[var(--ink)]">
                  Prepare la clase y revise el avance
                </h1>
                <p className="text-[var(--muted)]">
                  Como docente ve todas las unidades abiertas. Los acompañantes
                  las abren una por una: cada unidad se desbloquea cuando
                  terminan la anterior.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#docente"
                  onClick={(e) => {
                    e.preventDefault();
                    navegar('#docente');
                  }}
                  className="min-h-[44px] px-5 bg-[var(--accent)] text-[var(--accent-ink)] rounded-[4px] font-bold inline-flex items-center"
                >
                  Ir al panel docente
                </a>
                <a
                  href="#u-m1u1"
                  onClick={(e) => {
                    e.preventDefault();
                    navegar('#u-m1u1');
                  }}
                  className="min-h-[44px] px-5 bg-[var(--surface)] border border-[var(--ink)] text-[var(--ink)] rounded-[4px] font-semibold inline-flex items-center"
                >
                  Abrir la Unidad 1
                </a>
              </div>
              {etapasStrip}
            </div>

            <div className="lg:col-span-5 bg-[var(--ink)] text-[var(--surface)] border border-[var(--ink)] rounded-[4px] p-6 md:p-8 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <span className="block text-[0.78rem] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">
                  Módulo 1 · Fase piloto
                </span>
                <h2 className="font-editorial text-[1.6rem] leading-tight">
                  10 unidades antes del abecedario Braille
                </h2>
                <p className="text-[0.95rem] opacity-85">
                  Puntos, orientación desde el centro del cuerpo, formas
                  abiertas y formas cerradas. Cada unidad trae guía para la
                  familia, lámina interactiva con sonido y cartilla para
                  imprimir en relieve.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#evaluacion"
                  onClick={(e) => {
                    e.preventDefault();
                    navegar('#evaluacion');
                  }}
                  className="min-h-[44px] px-4 rounded-[4px] border border-[var(--surface)]/40 text-[var(--surface)] font-semibold text-[0.9rem] inline-flex items-center hover:border-[var(--surface)]"
                >
                  Evaluación háptica
                </a>
                <a
                  href="#taller"
                  onClick={(e) => {
                    e.preventDefault();
                    navegar('#taller');
                  }}
                  className="min-h-[44px] px-4 rounded-[4px] border border-[var(--surface)]/40 text-[var(--surface)] font-semibold text-[0.9rem] inline-flex items-center hover:border-[var(--surface)]"
                >
                  Taller A4 PIAF
                </a>
              </div>
            </div>
          </>
        ) : !perfil ? (
          <div className="lg:col-span-12 bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-6 md:p-8 space-y-6">
            <div className="space-y-2 max-w-[65ch]">
              <span className="block text-[0.78rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
                Bienvenida
              </span>
              <h1 className="font-editorial text-[2rem] md:text-[2.4rem] text-[var(--ink)]">
                Aprendamos juntos, paso a paso
              </h1>
              <p className="text-[var(--muted)]">
                Esta app le explica a usted, en palabras sencillas, cómo
                acompañar al niño en cada ejercicio con las láminas en relieve.
                No necesita saber Braille. Las unidades se abren en orden:
                cuando terminan una, se abre la siguiente.
              </p>
            </div>

            <form
              onSubmit={handleSubmitPerfil}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
            >
              <label className="flex flex-col gap-1.5 font-semibold text-[0.9rem]">
                <span>Nombre del niño o niña</span>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  placeholder="Ej.: Sofía"
                  value={nino}
                  onChange={(e) => setNino(e.target.value)}
                  className="min-h-[44px] px-3 bg-[var(--surface)] border border-[var(--line)] rounded-[4px] focus:border-[var(--ink)]"
                />
              </label>

              <label className="flex flex-col gap-1.5 font-semibold text-[0.9rem]">
                <span>Su nombre</span>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  placeholder="Ej.: Luz Marina"
                  value={acompanante}
                  onChange={(e) => setAcompanante(e.target.value)}
                  className="min-h-[44px] px-3 bg-[var(--surface)] border border-[var(--line)] rounded-[4px] focus:border-[var(--ink)]"
                />
              </label>

              <label className="flex flex-col gap-1.5 font-semibold text-[0.9rem]">
                <span>Usted es</span>
                <select
                  value={relacion}
                  onChange={(e) => setRelacion(e.target.value)}
                  className="min-h-[44px] px-3 bg-[var(--surface)] border border-[var(--line)] rounded-[4px] focus:border-[var(--ink)]"
                >
                  <option>Mamá</option>
                  <option>Papá</option>
                  <option>Abuela o abuelo</option>
                  <option>Tía o tío</option>
                  <option>Docente de aula</option>
                  <option>Otro acompañante</option>
                </select>
              </label>

              <button
                type="submit"
                className="min-h-[44px] px-5 bg-[var(--accent)] text-[var(--accent-ink)] rounded-[4px] font-bold cursor-pointer"
              >
                Empezar
              </button>
            </form>

            {etapasStrip}
          </div>
        ) : (
          <>
            <div className="lg:col-span-7 bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-6 md:p-8 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <span className="block text-[0.78rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
                  Hola, {perfil.acompanante}
                </span>
                <h1 className="font-editorial text-[2rem] md:text-[2.3rem] text-[var(--ink)]">
                  Este es el camino de {perfil.nino}
                </h1>
                <p className="text-[var(--muted)]">
                  Cada unidad se abre cuando terminan la anterior. Así nadie se
                  adelanta y las manos aprenden en el orden correcto.
                </p>
              </div>
              {etapasStrip}
            </div>

            <div className="lg:col-span-5 bg-[var(--ink)] text-[var(--surface)] border border-[var(--ink)] rounded-[4px] p-6 md:p-8 flex flex-col justify-between gap-4">
              {sig ? (
                <>
                  <div className="space-y-2">
                    <span className="block text-[0.78rem] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">
                      Sigan donde quedaron
                    </span>
                    <h2 className="font-editorial text-[1.6rem] leading-tight">
                      {sig.titulo}
                    </h2>
                    <p className="text-[0.92rem] opacity-85">
                      Unidad {numEnModulo(sig, contenido).i} del Módulo{' '}
                      {MODULOS.find((m) => m.id === sig.modulo)?.num} ·{' '}
                      {ETAPAS[sig.etapa] || ''} · {sig.duracion}
                    </p>
                  </div>
                  <div>
                    <a
                      href={`#u-${sig.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navegar(`#u-${sig.id}`);
                      }}
                      className="min-h-[44px] px-5 bg-[var(--accent)] text-[var(--accent-ink)] rounded-[4px] font-bold inline-flex items-center"
                    >
                      Continuar
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <span className="block text-[0.78rem] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">
                      ¡Lo lograron!
                    </span>
                    <h2 className="font-editorial text-[1.6rem] leading-tight">
                      Terminaron todas las unidades disponibles
                    </h2>
                    <p className="text-[0.92rem] opacity-85">
                      Pronto el docente abrirá nuevas unidades. Pueden revisar
                      la ficha de evaluación háptica o repetir cualquier lámina.
                    </p>
                  </div>
                  <div>
                    <a
                      href="#evaluacion"
                      onClick={(e) => {
                        e.preventDefault();
                        navegar('#evaluacion');
                      }}
                      className="min-h-[44px] px-5 bg-[var(--accent)] text-[var(--accent-ink)] rounded-[4px] font-bold inline-flex items-center"
                    >
                      Ver ficha de evaluación
                    </a>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </section>

      {/* Grid de Módulos */}
      <section className="space-y-4">
        <h2 className="font-editorial text-[1.6rem] text-[var(--ink)]">Aula</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MODULOS.map((m, k) => {
            const lista = unidadesDe(m.id, contenido);
            const av = avanceMod(m.id, done, contenido);
            const prep = lista.length === 0;
            const ab = !prep && abierta(lista[0], rol, done, contenido);
            const targetUnit =
              lista.find((u) => !done[u.id]) || lista[0];

            return (
              <article
                key={m.id}
                className={`bg-[var(--surface)] border border-[var(--line)] rounded-[4px] flex flex-col overflow-hidden ${
                  !ab && !prep ? 'opacity-75' : ''
                }`}
              >
                <ModuloHeaderArt mod={m} />
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <span className="text-[0.76rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
                    Módulo {m.num}
                  </span>
                  <h3 className="font-editorial text-[1.28rem] text-[var(--ink)]">
                    {m.titulo}
                  </h3>
                  <p className="text-[0.92rem] text-[var(--muted)] leading-[1.55]">
                    {m.desc}
                  </p>

                  <div>
                    {prep ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border border-[var(--line)] bg-[var(--accent-soft)] text-[0.78rem] font-bold text-[var(--ink)]">
                        En preparación
                      </span>
                    ) : ab ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border border-[var(--ok)] bg-[var(--ok-soft)] text-[0.78rem] font-bold text-[var(--ok)]">
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        {av.h === av.n ? 'Completado' : 'Abierto'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border border-[var(--line)] bg-[var(--bg)] text-[0.78rem] font-bold text-[var(--muted)]">
                        <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                        Se abre al terminar el Módulo {MODULOS[k - 1]?.num}
                      </span>
                    )}
                  </div>

                  {!prep && (
                    <div className="space-y-1.5 pt-1">
                      <div
                        className="h-2.5 rounded-[4px] bg-[var(--bg)] border border-[var(--line)] overflow-hidden"
                        role="progressbar"
                        aria-valuenow={av.p}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Avance del módulo ${m.num}`}
                      >
                        <div
                          className="h-full bg-[var(--ok)]"
                          style={{ width: `${av.p}%` }}
                        />
                      </div>
                      <p className="text-[0.85rem] text-[var(--muted)] tabular-nums">
                        {av.h} de {av.n} unidades · {av.p}%
                      </p>
                    </div>
                  )}

                  <div className="mt-auto pt-3">
                    {prep && esDocente ? (
                      <button
                        type="button"
                        onClick={() => setCrearModulo(m.id)}
                        className="min-h-[44px] px-4 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] text-[0.88rem] font-semibold text-[var(--ink)] hover:border-[var(--ink)] inline-flex items-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" aria-hidden="true" />
                        <span>Crear primera unidad</span>
                      </button>
                    ) : ab && targetUnit ? (
                      <a
                        href={`#u-${targetUnit.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navegar(`#u-${targetUnit.id}`);
                        }}
                        className={`min-h-[44px] px-5 rounded-[4px] font-bold inline-flex items-center ${
                          av.h < av.n
                            ? 'bg-[var(--accent)] text-[var(--accent-ink)]'
                            : 'bg-[var(--surface)] border border-[var(--ink)] text-[var(--ink)]'
                        }`}
                      >
                        {av.h > 0 ? 'Continuar' : 'Entrar'}
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {crearModulo && (
        <UnidadEditarModal
          moduloNuevo={crearModulo}
          onClose={() => setCrearModulo(null)}
        />
      )}
    </div>
  );
};
