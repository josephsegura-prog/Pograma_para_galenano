import React from 'react';
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Hand,
  Layers,
  Printer,
  Ruler,
  ShieldCheck,
} from 'lucide-react';
import { useCamino } from '../context/CaminoContext';
import { ETAPAS, MODULOS, pendiente, unidadesDe } from '../data/curriculum';

export const LandingView: React.FC = () => {
  const { perfil, done, contenido, setRol, navegar } = useCamino();
  const siguiente = pendiente(done, contenido);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-10 md:py-16 space-y-16 md:space-y-20">
      {/* 1. Portada editorial minimalista */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center pb-14 border-b border-[var(--line)]">
        <div className="lg:col-span-7 space-y-6">
          <p className="text-[0.8rem] font-bold tracking-[0.06em] uppercase text-[var(--muted)]">
            Tiflología y Aprestamiento Pre-Braille · Fase I
          </p>
          <h1 className="font-editorial text-[2.35rem] md:text-[3.25rem] leading-[1.1] tracking-[-0.015em] text-[var(--ink)]">
            El puente táctil antes del Braille
          </h1>
          <p className="text-[1.08rem] text-[var(--muted)] leading-[1.68] max-w-[58ch]">
            Camino Táctil acompaña a familias, docentes y tiflólogos paso a paso para preparar la sensibilidad y coordinación de las manos en niños con baja visión o ceguera antes de leer la celdilla Braille.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setRol('acompanante');
                navegar('#aula');
              }}
              className="min-h-[48px] px-6 bg-[var(--ink)] text-[var(--surface)] rounded-[4px] font-semibold text-[0.96rem] inline-flex items-center gap-2 hover:opacity-90 cursor-pointer"
            >
              <span>Comenzar como familia</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => {
                setRol('docente');
                navegar('#docente');
              }}
              className="min-h-[48px] px-6 bg-[var(--surface)] text-[var(--ink)] border border-[var(--ink)] rounded-[4px] font-semibold text-[0.96rem] hover:bg-[var(--bg)] cursor-pointer"
            >
              Acceso docente y especialista
            </button>
          </div>

          <dl className="grid grid-cols-3 gap-4 pt-6 border-t border-[var(--line)] max-w-[540px]">
            <div>
              <dt className="text-[0.75rem] font-bold uppercase tracking-[0.05em] text-[var(--muted)]">
                Currículo
              </dt>
              <dd className="font-editorial text-[1.45rem] text-[var(--ink)] tabular-nums">
                10 unidades
              </dd>
            </div>
            <div>
              <dt className="text-[0.75rem] font-bold uppercase tracking-[0.05em] text-[var(--muted)]">
                Estándar
              </dt>
              <dd className="font-editorial text-[1.45rem] text-[var(--ink)] tabular-nums">
                WCAG AAA
              </dd>
            </div>
            <div>
              <dt className="text-[0.75rem] font-bold uppercase tracking-[0.05em] text-[var(--muted)]">
                Impresión
              </dt>
              <dd className="font-editorial text-[1.45rem] text-[var(--ink)] tabular-nums">
                A4 · PIAF
              </dd>
            </div>
          </dl>
        </div>

        {/* Lámina de muestra y acceso directo si ya hay sesión */}
        <div className="lg:col-span-5 space-y-5">
          {perfil && (
            <div className="bg-[var(--surface)] border border-[var(--ink)] rounded-[4px] p-6 space-y-3">
              <span className="block text-[0.76rem] font-bold uppercase tracking-[0.06em] text-[var(--ok)]">
                Sesión activa
              </span>
              <h2 className="font-editorial text-[1.5rem] text-[var(--ink)]">
                Camino de {perfil.nino}
              </h2>
              <p className="text-[0.92rem] text-[var(--muted)]">
                Acompaña: {perfil.acompanante} ({perfil.relacion})
                {siguiente ? ` · Siguiente: ${siguiente.titulo}` : ' · Módulo completado'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setRol('acompanante');
                  navegar('#aula');
                }}
                className="min-h-[44px] px-5 bg-[var(--accent)] text-[var(--accent-ink)] rounded-[4px] font-bold text-[0.92rem] inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Ir directo al aula</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Vista arquitectónica de lámina táctil 100% K */}
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-6 space-y-3">
            <div className="flex items-center justify-between text-[0.78rem] font-semibold text-[var(--muted)]">
              <span>Referencia táctil · Esquina superior izquierda</span>
              <span className="tabular-nums">600 × 400</span>
            </div>
            <svg
              viewBox="0 0 600 400"
              role="img"
              aria-label="Ejemplo de lámina táctil de orientación con triángulo en la esquina superior izquierda y trayectoria de puntos"
              className="w-full bg-white border border-[var(--line)]"
            >
              <rect x="0" y="0" width="600" height="400" fill="#FFFFFF" />
              <path d="M14 14 H50 L14 50 Z" fill="#000000" />
              <circle cx="90" cy="200" r="20" fill="none" stroke="#000000" strokeWidth="5" />
              <circle cx="90" cy="200" r="11" fill="#000000" />
              <circle cx="150" cy="200" r="11" fill="#000000" />
              <circle cx="210" cy="200" r="11" fill="#000000" />
              <circle cx="270" cy="200" r="11" fill="#000000" />
              <circle cx="330" cy="200" r="11" fill="#000000" />
              <circle cx="390" cy="200" r="11" fill="#000000" />
              <circle cx="450" cy="200" r="11" fill="#000000" />
              <circle cx="510" cy="200" r="11" fill="#000000" />
            </svg>
            <p className="text-[0.82rem] text-[var(--muted)]">
              Cada lámina incluye el triángulo de orientación superior izquierdo, punto de anclaje con anillo doble y trazo en tinta 100% negra para relieve térmico.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Resumen en 3 columnas de los pilares del sistema */}
      <section id="metodo" aria-labelledby="heading-metodo" className="space-y-6 scroll-mt-24">
        <div className="space-y-2 max-w-2xl">
          <span className="block text-[0.76rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
            Arquitectura pedagógica
          </span>
          <h2 id="heading-metodo" className="font-editorial text-[1.9rem] md:text-[2.2rem] text-[var(--ink)]">
            Tres pilares antes de la celdilla Braille
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-6 space-y-3">
            <Hand className="w-6 h-6 text-[var(--ink)]" aria-hidden="true" />
            <h3 className="font-editorial text-[1.35rem] text-[var(--ink)]">
              01. Acompañamiento progresivo
            </h3>
            <p className="text-[0.95rem] text-[var(--muted)] leading-[1.6]">
              Diez unidades secuenciales con lenguaje claro para la familia, instrucciones de cómo guiar la yema del dedo y desbloqueo ordenado que respeta el ritmo de cada mano.
            </p>
          </article>

          <article className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-6 space-y-3">
            <Compass className="w-6 h-6 text-[var(--ink)]" aria-hidden="true" />
            <h3 className="font-editorial text-[1.35rem] text-[var(--ink)]">
              02. Láminas sonoras y accesibles
            </h3>
            <p className="text-[0.95rem] text-[var(--muted)] leading-[1.6]">
              Motor interactivo con síntesis Web Audio diferenciada por tamaño y dirección, demostraciones animadas del trazo, navegación por teclado y lectura en voz alta en español.
            </p>
          </article>

          <article className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-6 space-y-3">
            <Printer className="w-6 h-6 text-[var(--ink)]" aria-hidden="true" />
            <h3 className="font-editorial text-[1.35rem] text-[var(--ink)]">
              03. Impresión en relieve 100% K
            </h3>
            <p className="text-[0.95rem] text-[var(--muted)] leading-[1.6]">
              Cartillas A4 listas para imprimir, láminas SVG calibrables al porcentaje del punto en relieve, evaluación háptica individual y taller de diseño milimétrico para papel microcápsula PIAF.
            </p>
          </article>
        </div>
      </section>

      {/* 3. Recorrido en etapas y módulos */}
      <section
        id="etapas"
        aria-labelledby="heading-etapas"
        className="space-y-8 pt-10 border-t border-[var(--line)] scroll-mt-24"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="block text-[0.76rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
              Secuencia formativa
            </span>
            <h2 id="heading-etapas" className="font-editorial text-[1.9rem] md:text-[2.2rem] text-[var(--ink)]">
              Progresión por etapas y módulos
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navegar('#aula')}
            className="min-h-[44px] px-4 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] text-[0.9rem] font-semibold text-[var(--ink)] hover:border-[var(--ink)] inline-flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Explorar plan completo</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* 4 etapas clave */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((numEtapa) => (
            <div
              key={numEtapa}
              className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-5 space-y-2"
            >
              <span className="block text-[0.76rem] font-bold uppercase tracking-[0.06em] text-[var(--accent)] tabular-nums">
                Etapa 0{numEtapa}
              </span>
              <p className="font-editorial text-[1.2rem] text-[var(--ink)] leading-snug">
                {ETAPAS[numEtapa]}
              </p>
            </div>
          ))}
        </div>

        {/* 3 módulos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MODULOS.map((m) => {
            const total = unidadesDe(m.id, contenido).length;
            return (
              <div
                key={m.id}
                className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-6 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <span className="inline-block text-[0.74rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
                    Módulo {m.num} · {total > 0 ? `${total} unidades` : 'Próximamente'}
                  </span>
                  <h3 className="font-editorial text-[1.35rem] text-[var(--ink)]">
                    {m.titulo}
                  </h3>
                  <p className="text-[0.92rem] text-[var(--muted)] leading-[1.6]">
                    {m.desc}
                  </p>
                </div>

                {total > 0 ? (
                  <button
                    type="button"
                    onClick={() => navegar('#aula')}
                    className="min-h-[44px] px-4 rounded-[4px] border border-[var(--ink)] text-[var(--ink)] text-[0.88rem] font-semibold hover:bg-[var(--bg)] inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Iniciar módulo</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                ) : (
                  <span className="min-h-[44px] px-4 rounded-[4px] border border-[var(--line)] bg-[var(--bg)] text-[var(--muted)] text-[0.84rem] font-semibold inline-flex items-center justify-center">
                    {ETAPAS[m.num + 3] || 'En preparación'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Espacios de trabajo integrados */}
      <section
        id="herramientas"
        aria-labelledby="heading-herramientas"
        className="space-y-8 pt-10 border-t border-[var(--line)] scroll-mt-24"
      >
        <div className="space-y-2 max-w-2xl">
          <span className="block text-[0.76rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
            Entornos del sistema
          </span>
          <h2 id="heading-herramientas" className="font-editorial text-[1.9rem] md:text-[2.2rem] text-[var(--ink)]">
            Un solo espacio para acompañar, evaluar e imprimir
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-6 flex flex-col justify-between gap-5">
            <div className="space-y-2.5">
              <BookOpen className="w-5 h-5 text-[var(--ink)]" aria-hidden="true" />
              <h3 className="font-editorial text-[1.35rem] text-[var(--ink)]">
                Aula guiada para familias
              </h3>
              <p className="text-[0.94rem] text-[var(--muted)] leading-[1.6]">
                Lista de verificación paso a paso, láminas interactivas con audio y registro de logros por sesión.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setRol('acompanante');
                navegar('#aula');
              }}
              className="self-start min-h-[44px] px-4 rounded-[4px] border border-[var(--ink)] text-[0.88rem] font-semibold text-[var(--ink)] hover:bg-[var(--bg)] inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Abrir Aula</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </article>

          <article className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-6 flex flex-col justify-between gap-5">
            <div className="space-y-2.5">
              <Activity className="w-5 h-5 text-[var(--ink)]" aria-hidden="true" />
              <h3 className="font-editorial text-[1.35rem] text-[var(--ink)]">
                Evaluación háptica individual
              </h3>
              <p className="text-[0.94rem] text-[var(--muted)] leading-[1.6]">
                Perfil psicomotor, mapa táctil de puntos 2×3, observaciones interdisciplinarias y validación de pase al Módulo 2.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navegar('#evaluacion')}
              className="self-start min-h-[44px] px-4 rounded-[4px] border border-[var(--ink)] text-[0.88rem] font-semibold text-[var(--ink)] hover:bg-[var(--bg)] inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Ver Evaluación</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </article>

          <article className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-6 flex flex-col justify-between gap-5">
            <div className="space-y-2.5">
              <Ruler className="w-5 h-5 text-[var(--ink)]" aria-hidden="true" />
              <h3 className="font-editorial text-[1.35rem] text-[var(--ink)]">
                Taller de diseño A4 y PIAF
              </h3>
              <p className="text-[0.94rem] text-[var(--muted)] leading-[1.6]">
                Lienzo milimétrico con ajuste a retícula de 5 mm, validación euclidiana WCAG AAA (&ge; 2.5 mm) y exportación SVG directa.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navegar('#taller')}
              className="self-start min-h-[44px] px-4 rounded-[4px] border border-[var(--ink)] text-[0.88rem] font-semibold text-[var(--ink)] hover:bg-[var(--bg)] inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Abrir Taller A4</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </article>

          <article className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-6 flex flex-col justify-between gap-5">
            <div className="space-y-2.5">
              <Layers className="w-5 h-5 text-[var(--ink)]" aria-hidden="true" />
              <h3 className="font-editorial text-[1.35rem] text-[var(--ink)]">
                Panel docente y calibración
              </h3>
              <p className="text-[0.94rem] text-[var(--muted)] leading-[1.6]">
                Seguimiento del grupo, edición de guías pedagógicas, descarga de cartillas con rúbrica y calibración del relieve (70%–150%).
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setRol('docente');
                navegar('#docente');
              }}
              className="self-start min-h-[44px] px-4 rounded-[4px] border border-[var(--ink)] text-[0.88rem] font-semibold text-[var(--ink)] hover:bg-[var(--bg)] inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Entrar como Docente</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </article>
        </div>
      </section>

      {/* 5. Estándar WCAG AAA y cierre */}
      <section className="bg-[var(--surface)] border border-[var(--ink)] rounded-[4px] p-7 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-[0.06em] text-[var(--ok)]">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>Accesibilidad nativa WCAG AAA</span>
          </div>
          <h2 className="font-editorial text-[1.75rem] md:text-[2.1rem] text-[var(--ink)] leading-snug">
            Diseñado para baja visión, lectores de pantalla y papel en relieve
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[0.9rem] text-[var(--muted)] pt-1">
            {[
              'Escalado tipográfico 17 px → 21 px',
              'Modo alto contraste amarillo sobre negro',
              'Navegación completa por teclado y voz',
              'Áreas táctiles mínimas de 44 × 44 px',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--ok)] shrink-0" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setRol('acompanante');
              navegar('#aula');
            }}
            className="min-h-[48px] px-6 bg-[var(--accent)] text-[var(--accent-ink)] rounded-[4px] font-bold text-[0.96rem] inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Iniciar recorrido ahora</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
};
