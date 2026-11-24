import React from 'react';
import { CaminoProvider, useCamino } from './context/CaminoContext';
import { TopBar } from './components/TopBar';
import { LandingView } from './components/LandingView';
import { AulaView } from './components/AulaView';
import { UnidadView } from './components/UnidadView';
import { DocenteView } from './components/DocenteView';
import { EvaluacionView } from './components/EvaluacionView';
import { TallerView } from './components/TallerView';
import { AjustesModal, PerfilModal } from './components/Modals';

const AppShell: React.FC = () => {
  const { ruta, rol, navegar, toastMsg, vivoText } = useCamino();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)]">
      <TopBar />

      <main className="flex-1">
        {ruta.vista === 'landing' && <LandingView />}
        {ruta.vista === 'aula' && <AulaView />}
        {ruta.vista === 'unidad' && <UnidadView unitId={ruta.unitId} />}
        {ruta.vista === 'docente' && <DocenteView />}
        {ruta.vista === 'evaluacion' && (
          <EvaluacionView alumnoId={ruta.alumnoId} />
        )}
        {ruta.vista === 'taller' && <TallerView />}
      </main>

      <footer className="border-t border-[var(--line)] bg-[var(--bg)] mt-14 no-print">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[0.88rem] text-[var(--muted)]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-editorial text-[1.15rem] text-[var(--ink)]">
              Camino Táctil
            </span>
            <span aria-hidden="true">·</span>
            <span>El puente táctil antes del Braille</span>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <a
              href="#landing"
              onClick={(e) => {
                e.preventDefault();
                navegar('#landing');
              }}
              className="min-h-[44px] inline-flex items-center hover:text-[var(--ink)] no-underline"
            >
              Inicio
            </a>
            <a
              href="#aula"
              onClick={(e) => {
                e.preventDefault();
                navegar('#aula');
              }}
              className="min-h-[44px] inline-flex items-center hover:text-[var(--ink)] no-underline"
            >
              Aula
            </a>
            <a
              href="#evaluacion"
              onClick={(e) => {
                e.preventDefault();
                navegar('#evaluacion');
              }}
              className="min-h-[44px] inline-flex items-center hover:text-[var(--ink)] no-underline"
            >
              Evaluación
            </a>
            <a
              href="#taller"
              onClick={(e) => {
                e.preventDefault();
                navegar('#taller');
              }}
              className="min-h-[44px] inline-flex items-center hover:text-[var(--ink)] no-underline"
            >
              Taller A4
            </a>
            {rol === 'docente' && (
              <a
                href="#docente"
                onClick={(e) => {
                  e.preventDefault();
                  navegar('#docente');
                }}
                className="min-h-[44px] inline-flex items-center hover:text-[var(--ink)] no-underline"
              >
                Panel docente
              </a>
            )}
          </div>
        </div>
      </footer>

      <AjustesModal />
      <PerfilModal />

      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-[4px] bg-[var(--ink)] text-[var(--surface)] border border-[var(--line)] font-semibold text-[0.92rem] max-w-[90vw] text-center no-print"
        >
          {toastMsg}
        </div>
      )}

      <div id="vivo" className="sr-only" aria-live="polite">
        {vivoText}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <CaminoProvider>
      <AppShell />
    </CaminoProvider>
  );
}
