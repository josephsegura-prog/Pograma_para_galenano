import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useCamino } from '../context/CaminoContext';

export const TopBar: React.FC = () => {
  const {
    ruta,
    navegar,
    modo,
    rol,
    setRol,
    puedeDocente,
    soloLectura,
    cargando,
    perfil,
    setModalPerfilAbierto,
    setModalAjustesAbierto,
  } = useCamino();

  const esDocente = rol === 'docente';
  const mostrarSelectorRol = puedeDocente || modo === 'local';

  const navLinks: Array<{ hash: string; label: string; active: boolean }> = [
    {
      hash: '#aula',
      label: 'Aula',
      active: ruta.vista === 'aula' || ruta.vista === 'unidad',
    },
    {
      hash: '#evaluacion',
      label: 'Evaluación',
      active: ruta.vista === 'evaluacion',
    },
    {
      hash: '#taller',
      label: 'Taller',
      active: ruta.vista === 'taller',
    },
    ...(esDocente
      ? [
          {
            hash: '#docente',
            label: 'Docente',
            active: ruta.vista === 'docente',
          },
        ]
      : []),
  ];

  const esLanding = ruta.vista === 'landing';

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-[var(--surface)] border-b border-[var(--line)] no-print">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Marca con emblema Braille lineal de 6 puntos */}
        <a
          href="#landing"
          onClick={(e) => {
            e.preventDefault();
            navegar('#landing');
          }}
          className="flex items-center gap-3 no-underline shrink-0 min-h-[44px]"
        >
          <svg
            width="38"
            height="38"
            viewBox="0 0 40 40"
            aria-hidden="true"
            className="shrink-0"
          >
            <rect
              width="40"
              height="40"
              rx="4"
              fill="var(--ink)"
            />
            <circle cx="14" cy="11" r="3.3" fill="var(--accent)" />
            <circle cx="26" cy="11" r="3.3" fill="var(--accent)" />
            <circle cx="14" cy="20" r="3.3" fill="var(--accent)" />
            <circle
              cx="26"
              cy="20"
              r="3.3"
              fill="var(--surface)"
              opacity="0.3"
            />
            <circle
              cx="14"
              cy="29"
              r="3.3"
              fill="var(--surface)"
              opacity="0.3"
            />
            <circle cx="26" cy="29" r="3.3" fill="var(--accent)" />
          </svg>
          <span className="font-editorial text-[1.35rem] font-normal tracking-tight text-[var(--ink)] whitespace-nowrap">
            Camino Táctil
          </span>
        </a>

        {/* Navegación principal */}
        {esLanding ? (
          <nav
            aria-label="Secciones de portada"
            className="hidden md:flex items-center gap-6"
          >
            {[
              { id: 'metodo', label: 'El método' },
              { id: 'etapas', label: 'Etapas y módulos' },
              { id: 'herramientas', label: 'Herramientas' },
            ].map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => scrollToSection(sec.id)}
                className="min-h-[44px] px-1 text-[0.92rem] font-semibold tracking-[0.03em] text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
              >
                {sec.label}
              </button>
            ))}
          </nav>
        ) : (
          <nav
            aria-label="Principal"
            className="flex flex-wrap items-center gap-2 md:gap-5"
          >
            {navLinks.map((item) => (
              <a
                key={item.hash}
                href={item.hash}
                onClick={(e) => {
                  e.preventDefault();
                  navegar(item.hash);
                }}
                aria-current={item.active ? 'page' : undefined}
                className={`min-h-[44px] px-2 flex items-center text-[0.92rem] font-semibold tracking-[0.03em] whitespace-nowrap border-b-2 transition-colors ${
                  item.active
                    ? 'border-[var(--ink)] text-[var(--ink)]'
                    : 'border-transparent text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--line)]'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        {/* Controles */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {!esLanding && mostrarSelectorRol && (
            <div
              role="group"
              aria-label="Ver la app como"
              className="inline-flex border border-[var(--line)] rounded-[4px] p-0.5 bg-[var(--bg)]"
            >
              <button
                type="button"
                aria-pressed={!esDocente}
                onClick={() => setRol('acompanante')}
                className={`min-h-[40px] px-3 rounded-[3px] text-[0.84rem] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  !esDocente
                    ? 'bg-[var(--ink)] text-[var(--surface)]'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                Acompañante
              </button>
              <button
                type="button"
                aria-pressed={esDocente}
                onClick={() => setRol('docente')}
                className={`min-h-[40px] px-3 rounded-[3px] text-[0.84rem] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  esDocente
                    ? 'bg-[var(--ink)] text-[var(--surface)]'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                Docente
              </button>
            </div>
          )}

          {!esLanding && perfil && !esDocente && (
            <button
              type="button"
              onClick={() => setModalPerfilAbierto(true)}
              title="Cambiar datos del acompañamiento"
              className="min-h-[44px] px-3 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] text-[0.86rem] font-semibold text-[var(--ink)] hover:border-[var(--ink)] whitespace-nowrap cursor-pointer"
            >
              Con {perfil.nino}
            </button>
          )}

          {!esLanding && (
            <span
              title={
                modo === 'nube'
                  ? 'El avance se guarda en la nube'
                  : 'El avance se guarda en este dispositivo'
              }
              className="hidden sm:inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-[4px] border border-[var(--line)] bg-[var(--bg)] text-[0.8rem] font-semibold text-[var(--muted)] whitespace-nowrap"
            >
              <span
                aria-hidden="true"
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    modo === 'nube' ? 'var(--ok)' : 'var(--lock)',
                }}
              />
              {modo === 'nube'
                ? soloLectura
                  ? 'Solo lectura'
                  : 'En línea'
                : cargando
                  ? 'Conectando…'
                  : 'Local'}
            </span>
          )}

          <button
            type="button"
            onClick={() => setModalAjustesAbierto(true)}
            aria-label="Ajustes de lectura y voz"
            className="min-h-[44px] px-3.5 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] text-[0.88rem] font-semibold text-[var(--ink)] hover:border-[var(--ink)] inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            <span>Ajustes</span>
          </button>

          {esLanding && (
            <button
              type="button"
              onClick={() => navegar('#aula')}
              className="min-h-[44px] px-4 rounded-[4px] bg-[var(--ink)] text-[var(--surface)] text-[0.88rem] font-semibold hover:opacity-90 whitespace-nowrap cursor-pointer"
            >
              Entrar al aula
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
