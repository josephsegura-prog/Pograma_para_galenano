import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCamino } from '../context/CaminoContext';
import { BRAILLE_ALPHABET } from '../data/braille';
import { ETAPAS, secuencia } from '../data/curriculum';
import { StudentRecord } from '../types/camino';
import { fecha } from '../utils/printTemplates';

interface EvaluacionViewProps {
  alumnoId?: string;
}

export const EvaluacionView: React.FC<EvaluacionViewProps> = ({ alumnoId }) => {
  const {
    modo,
    rol,
    perfil,
    done,
    actividades,
    intentos,
    notaDocente,
    alumnos,
    contenido,
    guardarNotaAlumnoCloud,
    navegar,
    mostrarToast,
  } = useCamino();

  const [selectedId, setSelectedId] = useState<string>(alumnoId || 'local');
  const [notaEdit, setNotaEdit] = useState<string>('');
  const [guardandoNota, setGuardandoNota] = useState<boolean>(false);
  const [hapticTestDots, setHapticTestDots] = useState<number[]>([1, 2, 4, 5]);

  // Lista unificada de perfiles disponibles
  const estudiantesDisponibles: StudentRecord[] = useMemo(() => {
    if (modo === 'nube' && alumnos.length > 0) {
      return alumnos.filter((a) => !!a.perfil);
    }
    if (perfil) {
      return [
        {
          id: 'local',
          perfil,
          done,
          actividades,
          intentos,
          notaDocente,
          actualizado: Date.now(),
        },
      ];
    }
    return [];
  }, [modo, alumnos, perfil, done, actividades, intentos, notaDocente]);

  const alumnoActivo = useMemo(() => {
    if (estudiantesDisponibles.length === 0) return null;
    if (alumnoId) {
      const found = estudiantesDisponibles.find((a) => a.id === alumnoId);
      if (found) return found;
    }
    const foundSel = estudiantesDisponibles.find((a) => a.id === selectedId);
    return foundSel || estudiantesDisponibles[0];
  }, [estudiantesDisponibles, alumnoId, selectedId]);

  useEffect(() => {
    if (alumnoId) setSelectedId(alumnoId);
  }, [alumnoId]);

  useEffect(() => {
    setNotaEdit(alumnoActivo?.notaDocente || '');
  }, [alumnoActivo?.id, alumnoActivo?.notaDocente]);

  const seq = secuencia(contenido);
  const d = alumnoActivo?.done || {};
  const ints = alumnoActivo?.intentos || {};
  const acts = alumnoActivo?.actividades || {};

  const completadas = seq.filter((u) => !!d[u.id]).length;
  const soloCount = Object.values(d).filter((x) => x.logro === 'solo').length;
  const ayudaCount = Object.values(d).filter((x) => x.logro === 'ayuda').length;
  const repetirCount = Object.values(ints).reduce((acc, v) => acc + v, 0);
  const porcentajeAutonomia =
    completadas > 0 ? Math.round((soloCount * 100) / completadas) : 0;

  // Celdilla Braille identificativa con la inicial del estudiante
  const inicial = (alumnoActivo?.perfil.nino || 'C')
    .trim()
    .charAt(0)
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  const brailleInicial =
    BRAILLE_ALPHABET.find((b) => b.char === inicial) || BRAILLE_ALPHABET[2];

  // Validación de pase de módulo (Módulo 1 = 10 unidades o todas las visibles en m1)
  const unidadesM1 = seq.filter((u) => u.modulo === 'm1');
  const completadasM1 = unidadesM1.filter((u) => !!d[u.id]).length;
  const paseModulo =
    unidadesM1.length > 0 &&
    completadasM1 === unidadesM1.length &&
    porcentajeAutonomia >= 60;

  const toggleHapticDot = (dot: number) => {
    setHapticTestDots((prev) =>
      prev.includes(dot)
        ? prev.filter((x) => x !== dot)
        : [...prev, dot].sort((a, b) => a - b)
    );
  };

  if (!alumnoActivo) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12">
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-8 max-w-xl mx-auto text-center space-y-4">
          <h1 className="font-editorial text-[1.9rem] text-[var(--ink)]">
            Ficha de Evaluación Háptica
          </h1>
          <p className="text-[var(--muted)]">
            Aún no hay un perfil de estudiante registrado. Registre el nombre
            del niño en el Aula para generar su diagnóstico psicomotor y su
            historial de autonomía.
          </p>
          <button
            type="button"
            onClick={() => navegar('#aula')}
            className="min-h-[44px] px-5 bg-[var(--accent)] text-[var(--accent-ink)] rounded-[4px] font-bold cursor-pointer"
          >
            Ir al Aula
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-10 space-y-8">
      {/* Cabecera e identificación con celdilla Braille */}
      <header className="pb-6 border-b border-[var(--line)] flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3">
          <a
            href={rol === 'docente' ? '#docente' : '#aula'}
            onClick={(e) => {
              e.preventDefault();
              navegar(rol === 'docente' ? '#docente' : '#aula');
            }}
            className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold underline underline-offset-4 text-[var(--ink)] min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>{rol === 'docente' ? 'Volver al panel docente' : 'Volver al aula'}</span>
          </a>

          <div className="flex items-center gap-5">
            {/* Celdilla Braille identificativa 2×3 */}
            <div
              className="bg-[var(--surface)] border border-[var(--ink)] rounded-[4px] p-3 flex flex-col items-center gap-1.5 shrink-0"
              aria-label={`Inicial en Braille: ${brailleInicial.char} (${brailleInicial.description})`}
            >
              <div className="grid grid-cols-2 gap-1.5">
                {[1, 4, 2, 5, 3, 6].map((dotNum) => {
                  const on = brailleInicial.dots.includes(dotNum);
                  return (
                    <span
                      key={dotNum}
                      className={`w-3 h-3 rounded-full ${
                        on
                          ? 'bg-[var(--ink)]'
                          : 'border border-[var(--line)] bg-transparent'
                      }`}
                    />
                  );
                })}
              </div>
              <span className="text-[0.72rem] font-bold text-[var(--muted)] tabular-nums">
                {brailleInicial.char}
              </span>
            </div>

            <div className="space-y-1">
              <span className="block text-[0.76rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
                Ficha de Evaluación Individual · Diagnóstico Háptico
              </span>
              <h1 className="font-editorial text-[2rem] md:text-[2.4rem] text-[var(--ink)] leading-tight">
                {alumnoActivo.perfil.nino}
              </h1>
              <p className="text-[0.92rem] text-[var(--muted)]">
                Acompañante: {alumnoActivo.perfil.acompanante} (
                {alumnoActivo.perfil.relacion}) · Última actualización{' '}
                {fecha(alumnoActivo.actualizado)}
              </p>
            </div>
          </div>
        </div>

        {/* Selector de alumno si hay varios en la nube */}
        {estudiantesDisponibles.length > 1 && (
          <label className="flex flex-col gap-1 text-[0.86rem] font-semibold min-w-[240px]">
            <span>Estudiante activo</span>
            <select
              value={alumnoActivo.id}
              onChange={(e) => {
                setSelectedId(e.target.value);
                navegar(`#evaluacion/${encodeURIComponent(e.target.value)}`);
              }}
              className="min-h-[44px] px-3 bg-[var(--surface)] border border-[var(--line)] rounded-[4px]"
            >
              {estudiantesDisponibles.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.perfil.nino} ({st.perfil.acompanante})
                </option>
              ))}
            </select>
          </label>
        )}
      </header>

      {/* Métricas psicomotoras calibradas y validación de pase */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-5 space-y-1">
          <span className="block text-[0.74rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
            Presión de yema calibrada
          </span>
          <strong className="font-editorial text-[1.9rem] text-[var(--ink)] tabular-nums">
            42 g
          </strong>
          <p className="text-[0.84rem] text-[var(--muted)]">
            Rango óptimo sin aplastamiento de microcápsula
          </p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-5 space-y-1">
          <span className="block text-[0.74rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
            Técnica bimanual
          </span>
          <strong className="font-editorial text-[1.45rem] text-[var(--ink)]">
            Anclaje / Rastreo
          </strong>
          <p className="text-[0.84rem] text-[var(--muted)]">
            Mano guía fija en esquina de origen
          </p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-5 space-y-1">
          <span className="block text-[0.74rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
            Umbral de saturación palmar
          </span>
          <strong className="font-editorial text-[1.9rem] text-[var(--ink)] tabular-nums">
            12–15 min
          </strong>
          <p className="text-[0.84rem] text-[var(--muted)]">
            Pausa recomendada entre sesiones secuenciales
          </p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-5 space-y-2">
          <span className="block text-[0.74rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
            Validación Módulo 1
          </span>
          <div className="flex items-center gap-2">
            {paseModulo ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border border-[var(--ok)] bg-[var(--ok-soft)] text-[var(--ok)] text-[0.82rem] font-bold">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                Apto para Módulo 2
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)] text-[0.82rem] font-bold">
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                En proceso ({completadasM1}/{unidadesM1.length})
              </span>
            )}
          </div>
          <p className="text-[0.84rem] text-[var(--muted)] tabular-nums">
            Autonomía directa: {porcentajeAutonomia}% ({soloCount} solo /{' '}
            {ayudaCount} con ayuda)
          </p>
        </div>
      </section>

      {/* Historial dinámico de autonomía + Mapa de resolución háptica 2×3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Historial real extraído de S.done y S.intentos */}
        <section className="lg:col-span-7 bg-[var(--surface)] border border-[var(--line)] rounded-[4px] overflow-hidden">
          <div className="p-5 border-b border-[var(--line)] flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-editorial text-[1.35rem] text-[var(--ink)]">
                Historial dinámico de autonomía
              </h2>
              <p className="text-[0.86rem] text-[var(--muted)] tabular-nums">
                {completadas} de {seq.length} unidades completadas ·{' '}
                {repetirCount} intentos por repetir
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[0.9rem] border-collapse">
              <thead>
                <tr className="border-b border-[var(--line)] text-[0.75rem] uppercase tracking-[0.05em] text-[var(--muted)]">
                  <th className="p-3 text-left">Unidad</th>
                  <th className="p-3 text-left">Etapa</th>
                  <th className="p-3 text-left">Autonomía</th>
                  <th className="p-3 text-left">Lámina</th>
                  <th className="p-3 text-left">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {seq.map((u, idx) => {
                  const reg = d[u.id];
                  const intent = ints[u.id] || 0;
                  return (
                    <tr
                      key={u.id}
                      className="border-b border-[var(--line)] last:border-b-0"
                    >
                      <td className="p-3">
                        <strong className="tabular-nums mr-1.5">
                          {idx + 1}.
                        </strong>
                        {u.titulo}
                      </td>
                      <td className="p-3 text-[var(--muted)] text-[0.84rem]">
                        {ETAPAS[u.etapa] || '—'}
                      </td>
                      <td className="p-3">
                        {reg ? (
                          <span
                            className={`inline-block px-2 py-0.5 rounded-[4px] text-[0.76rem] font-bold border ${
                              reg.logro === 'solo'
                                ? 'bg-[var(--ok-soft)] border-[var(--ok)] text-[var(--ok)]'
                                : 'bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--ink)]'
                            }`}
                          >
                            {reg.logro === 'solo' ? 'Logró solo' : 'Con ayuda'}
                          </span>
                        ) : intent > 0 ? (
                          <span className="inline-block px-2 py-0.5 rounded-[4px] text-[0.76rem] font-bold border border-[var(--warn)] bg-[var(--warn-soft)] text-[var(--warn)] tabular-nums">
                            {intent} por repetir
                          </span>
                        ) : (
                          <span className="text-[var(--muted)]">Pendiente</span>
                        )}
                      </td>
                      <td className="p-3 text-[0.86rem]">
                        {acts[u.id] ? 'Completada' : '—'}
                      </td>
                      <td className="p-3 tabular-nums text-[0.84rem] text-[var(--muted)]">
                        {reg ? fecha(reg.t) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Mapa de resolución háptica 2×3 + Notas interdisciplinares */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-6 space-y-4">
            <div className="space-y-1">
              <h2 className="font-editorial text-[1.35rem] text-[var(--ink)]">
                Mapa de resolución háptica 2×3
              </h2>
              <p className="text-[0.88rem] text-[var(--muted)]">
                Verifique qué puntos de la celdilla estándar (paso 2.5 mm)
                discrimina con nitidez la yema del dedo índice.
              </p>
            </div>

            <div className="bg-[var(--bg)] border border-[var(--line)] rounded-[4px] p-6 flex flex-col items-center gap-4">
              <div
                className="grid grid-cols-2 gap-x-8 gap-y-5"
                role="group"
                aria-label="Mapa de puntos táctiles 1 a 6"
              >
                {[1, 4, 2, 5, 3, 6].map((dot) => {
                  const active = hapticTestDots.includes(dot);
                  return (
                    <button
                      key={dot}
                      type="button"
                      aria-pressed={active}
                      aria-label={`Punto ${dot} ${active ? 'discriminado' : 'en entrenamiento'}`}
                      onClick={() => toggleHapticDot(dot)}
                      className={`w-14 h-14 rounded-full border-2 font-bold tabular-nums text-[0.95rem] cursor-pointer transition-colors ${
                        active
                          ? 'bg-[var(--ink)] border-[var(--ink)] text-[var(--surface)]'
                          : 'bg-[var(--surface)] border-[var(--line)] text-[var(--muted)] hover:border-[var(--ink)]'
                      }`}
                    >
                      {dot}
                    </button>
                  );
                })}
              </div>
              <p className="text-[0.84rem] text-[var(--muted)] tabular-nums">
                Puntos discriminados: {hapticTestDots.length} de 6 (
                {hapticTestDots.join(', ') || 'ninguno'})
              </p>
            </div>
          </div>

          {/* Notas interdisciplinares */}
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-6 space-y-3">
            <h2 className="font-editorial text-[1.35rem] text-[var(--ink)]">
              Notas interdisciplinares
            </h2>
            <p className="text-[0.86rem] text-[var(--muted)]">
              Observaciones de tiflología, terapia ocupacional o docente de aula
              sobre postura, presión digital o transiciones.
            </p>
            <textarea
              value={notaEdit}
              onChange={(e) => setNotaEdit(e.target.value)}
              rows={4}
              aria-label="Notas interdisciplinares del estudiante"
              placeholder="Ej.: Mantiene mano izquierda como ancla en el margen superior; requiere pausa de 2 min tras láminas densas…"
              className="w-full p-3 bg-[var(--surface)] border border-[var(--line)] rounded-[4px] text-[0.94rem]"
            />
            <div className="flex justify-end">
              <button
                type="button"
                disabled={guardandoNota}
                onClick={async () => {
                  setGuardandoNota(true);
                  await guardarNotaAlumnoCloud(alumnoActivo.id, notaEdit);
                  setGuardandoNota(false);
                  if (modo === 'local') {
                    mostrarToast('Nota interdisciplinar guardada.');
                  }
                }}
                className="min-h-[44px] px-5 bg-[var(--accent)] text-[var(--accent-ink)] rounded-[4px] font-bold cursor-pointer"
              >
                {guardandoNota ? 'Guardando…' : 'Guardar nota'}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
