import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useCamino } from '../context/CaminoContext';
import { ETAPAS, secuencia, unidadesDe } from '../data/curriculum';
import { StudentRecord, UnitDef } from '../types/camino';
import { vozDisponible } from '../utils/audio';
import { fecha } from '../utils/printTemplates';

/* =========================================================
   CONTENEDOR BASE DE DIÁLOGO ACCESIBLE
   ========================================================= */
const ModalFrame: React.FC<{
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ title, onClose, children }) => {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-4"
    >
      <div className="bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] rounded-[4px] w-full max-w-[700px] max-h-[88vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--line)] flex items-center justify-between gap-4">
          <h2 className="font-editorial text-[1.4rem] text-[var(--ink)]">
            {title}
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="min-h-[44px] min-w-[44px] rounded-[4px] border border-[var(--line)] flex items-center justify-center hover:border-[var(--ink)] cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

/* =========================================================
   AJUSTES DE LECTURA Y VOZ
   ========================================================= */
export const AjustesModal: React.FC = () => {
  const {
    ajustes,
    actualizarAjustes,
    modalAjustesAbierto,
    setModalAjustesAbierto,
  } = useCamino();

  if (!modalAjustesAbierto) return null;
  const hayVoz = vozDisponible();

  return (
    <ModalFrame
      title="Ajustes"
      onClose={() => setModalAjustesAbierto(false)}
    >
      <div className="p-6 space-y-4 overflow-y-auto">
        <label className="min-h-[44px] flex items-center gap-3 font-semibold cursor-pointer">
          <input
            type="checkbox"
            checked={ajustes.grande}
            onChange={(e) => actualizarAjustes({ grande: e.target.checked })}
            className="w-6 h-6 accent-[var(--ok)]"
          />
          <span>Letra más grande</span>
        </label>

        <label className="min-h-[44px] flex items-center gap-3 font-semibold cursor-pointer">
          <input
            type="checkbox"
            checked={ajustes.contraste}
            onChange={(e) => actualizarAjustes({ contraste: e.target.checked })}
            className="w-6 h-6 accent-[var(--ok)]"
          />
          <span>Alto contraste (amarillo sobre negro)</span>
        </label>

        <label
          className={`min-h-[44px] flex items-center gap-3 font-semibold ${
            hayVoz ? 'cursor-pointer' : 'opacity-50'
          }`}
        >
          <input
            type="checkbox"
            checked={ajustes.voz}
            disabled={!hayVoz}
            onChange={(e) => actualizarAjustes({ voz: e.target.checked })}
            className="w-6 h-6 accent-[var(--ok)]"
          />
          <span>
            Hablar en voz alta durante las láminas
            {hayVoz ? '' : ' (no disponible aquí)'}
          </span>
        </label>
      </div>
      <div className="px-6 py-4 border-t border-[var(--line)] flex justify-end">
        <button
          type="button"
          onClick={() => setModalAjustesAbierto(false)}
          className="min-h-[44px] px-5 bg-[var(--accent)] text-[var(--accent-ink)] rounded-[4px] font-bold cursor-pointer"
        >
          Listo
        </button>
      </div>
    </ModalFrame>
  );
};

/* =========================================================
   PERFIL DE ACOMPAÑAMIENTO
   ========================================================= */
export const PerfilModal: React.FC = () => {
  const { perfil, setPerfil, modalPerfilAbierto, setModalPerfilAbierto } =
    useCamino();
  const [nino, setNino] = useState(perfil?.nino || '');
  const [acompanante, setAcompanante] = useState(perfil?.acompanante || '');
  const [relacion, setRelacion] = useState(perfil?.relacion || 'Mamá');

  useEffect(() => {
    if (modalPerfilAbierto) {
      setNino(perfil?.nino || '');
      setAcompanante(perfil?.acompanante || '');
      setRelacion(perfil?.relacion || 'Mamá');
    }
  }, [modalPerfilAbierto, perfil]);

  if (!modalPerfilAbierto) return null;

  return (
    <ModalFrame
      title="Datos del acompañamiento"
      onClose={() => setModalPerfilAbierto(false)}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!nino.trim() || !acompanante.trim()) return;
          setPerfil({
            nino: nino.trim(),
            acompanante: acompanante.trim(),
            relacion,
          });
          setModalPerfilAbierto(false);
        }}
      >
        <div className="p-6 space-y-4 overflow-y-auto">
          <label className="flex flex-col gap-1.5 font-semibold text-[0.9rem]">
            <span>Nombre del niño o niña</span>
            <input
              type="text"
              required
              value={nino}
              onChange={(e) => setNino(e.target.value)}
              className="min-h-[44px] px-3 bg-[var(--surface)] border border-[var(--line)] rounded-[4px]"
            />
          </label>
          <label className="flex flex-col gap-1.5 font-semibold text-[0.9rem]">
            <span>Su nombre</span>
            <input
              type="text"
              required
              value={acompanante}
              onChange={(e) => setAcompanante(e.target.value)}
              className="min-h-[44px] px-3 bg-[var(--surface)] border border-[var(--line)] rounded-[4px]"
            />
          </label>
          <label className="flex flex-col gap-1.5 font-semibold text-[0.9rem]">
            <span>Usted es</span>
            <select
              value={relacion}
              onChange={(e) => setRelacion(e.target.value)}
              className="min-h-[44px] px-3 bg-[var(--surface)] border border-[var(--line)] rounded-[4px]"
            >
              {[
                'Mamá',
                'Papá',
                'Abuela o abuelo',
                'Tía o tío',
                'Docente de aula',
                'Otro acompañante',
              ].map((op) => (
                <option key={op}>{op}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="px-6 py-4 border-t border-[var(--line)] flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setModalPerfilAbierto(false)}
            className="min-h-[44px] px-4 rounded-[4px] border border-[var(--line)] font-semibold cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="min-h-[44px] px-5 bg-[var(--accent)] text-[var(--accent-ink)] rounded-[4px] font-bold cursor-pointer"
          >
            Guardar
          </button>
        </div>
      </form>
    </ModalFrame>
  );
};

/* =========================================================
   CONFIRMACIÓN GENÉRICA
   ========================================================= */
export const ConfirmarModal: React.FC<{
  mensaje: string;
  textoOk: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ mensaje, textoOk, onConfirm, onCancel }) => (
  <ModalFrame title={mensaje} onClose={onCancel}>
    <div className="px-6 py-5 border-t border-[var(--line)] flex justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="min-h-[44px] px-4 rounded-[4px] border border-[var(--line)] font-semibold cursor-pointer"
      >
        Cancelar
      </button>
      <button
        type="button"
        onClick={onConfirm}
        className="min-h-[44px] px-5 bg-[var(--accent)] text-[var(--accent-ink)] rounded-[4px] font-bold cursor-pointer"
      >
        {textoOk}
      </button>
    </div>
  </ModalFrame>
);

/* =========================================================
   DETALLE DE ALUMNO (PANEL DOCENTE)
   ========================================================= */
export const AlumnoDetalleModal: React.FC<{
  alumno: StudentRecord;
  onClose: () => void;
}> = ({ alumno, onClose }) => {
  const {
    contenido,
    guardarNotaAlumnoCloud,
    reiniciarAvanceAlumno,
    navegar,
  } = useCamino();
  const [nota, setNota] = useState(alumno.notaDocente || '');
  const [confirmReset, setConfirmReset] = useState(false);

  const seq = secuencia(contenido);
  const d = alumno.done || {};

  if (confirmReset) {
    return (
      <ConfirmarModal
        mensaje={`¿Reiniciar todo el avance de ${alumno.perfil.nino}? Volverá a empezar en la Unidad 1.`}
        textoOk="Reiniciar"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          setConfirmReset(false);
          reiniciarAvanceAlumno(
            alumno.id,
            alumno.perfil,
            alumno.notaDocente || ''
          );
          onClose();
        }}
      />
    );
  }

  return (
    <ModalFrame
      title={`Seguimiento: ${alumno.perfil.nino}`}
      onClose={onClose}
    >
      <div className="p-6 space-y-4 overflow-y-auto">
        <p className="text-[0.9rem] text-[var(--muted)]">
          Acompaña: {alumno.perfil.acompanante} ({alumno.perfil.relacion || ''})
          · Última actividad {fecha(alumno.actualizado)}
        </p>

        <div className="overflow-x-auto border border-[var(--line)] rounded-[4px]">
          <table className="w-full text-[0.9rem] border-collapse">
            <thead>
              <tr className="border-b border-[var(--line)] text-[0.76rem] uppercase tracking-[0.05em] text-[var(--muted)]">
                <th className="p-2.5 text-left">Unidad</th>
                <th className="p-2.5 text-left">Estado</th>
                <th className="p-2.5 text-left">Práctica digital</th>
                <th className="p-2.5 text-left">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {seq.map((u, i) => {
                const x = d[u.id];
                const it = (alumno.intentos || {})[u.id];
                return (
                  <tr key={u.id} className="border-b border-[var(--line)]">
                    <td className="p-2.5">
                      {i + 1}. {u.titulo}
                    </td>
                    <td className="p-2.5">
                      {x ? (
                        <span
                          className={`inline-block px-2 py-0.5 rounded-[4px] text-[0.76rem] font-bold border ${
                            x.logro === 'solo'
                              ? 'bg-[var(--ok-soft)] border-[var(--ok)] text-[var(--ok)]'
                              : 'bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--ink)]'
                          }`}
                        >
                          {x.logro === 'solo' ? 'Solo' : 'Con ayuda'}
                        </span>
                      ) : it ? (
                        <span className="inline-block px-2 py-0.5 rounded-[4px] text-[0.76rem] font-bold border border-[var(--warn)] bg-[var(--warn-soft)] text-[var(--warn)]">
                          {it} {it === 1 ? 'intento' : 'intentos'}
                        </span>
                      ) : (
                        <span className="text-[var(--muted)]">Pendiente</span>
                      )}
                    </td>
                    <td className="p-2.5">
                      {(alumno.actividades || {})[u.id] ? '✓' : '—'}
                    </td>
                    <td className="p-2.5 tabular-nums">
                      {x ? fecha(x.t) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <label className="flex flex-col gap-1.5 font-semibold text-[0.9rem]">
          <span>Nota del docente para el seguimiento</span>
          <textarea
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            rows={3}
            className="p-3 bg-[var(--surface)] border border-[var(--line)] rounded-[4px]"
          />
        </label>
      </div>

      <div className="px-6 py-4 border-t border-[var(--line)] flex flex-wrap justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="min-h-[44px] px-4 rounded-[4px] border border-[var(--warn)] text-[var(--warn)] font-semibold cursor-pointer"
          >
            Reiniciar avance
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              navegar(`#evaluacion/${encodeURIComponent(alumno.id)}`);
            }}
            className="min-h-[44px] px-4 rounded-[4px] border border-[var(--ink)] font-semibold cursor-pointer"
          >
            Abrir ficha háptica
          </button>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 rounded-[4px] border border-[var(--line)] font-semibold cursor-pointer"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={async () => {
              await guardarNotaAlumnoCloud(alumno.id, nota);
              onClose();
            }}
            className="min-h-[44px] px-5 bg-[var(--accent)] text-[var(--accent-ink)] rounded-[4px] font-bold cursor-pointer"
          >
            Guardar nota
          </button>
        </div>
      </div>
    </ModalFrame>
  );
};

/* =========================================================
   CREAR / EDITAR UNIDAD (GESTIÓN DE CONTENIDOS)
   ========================================================= */
export const UnidadEditarModal: React.FC<{
  unit?: UnitDef | null;
  moduloNuevo?: 'm1' | 'm2' | 'm3';
  onClose: () => void;
}> = ({ unit, moduloNuevo, onClose }) => {
  const { contenido, guardarContenido, mostrarToast, navegar } = useCamino();
  const nuevo = !unit;
  const baseObj: Partial<UnitDef> = unit || {
    titulo: '',
    objetivo: '',
    duracion: '15 min',
    materiales: [],
    pasos: [],
    mano: '',
    consejo: '',
    competencia: '',
    resultado: '',
    criterio: '',
    etapa: moduloNuevo === 'm2' ? 5 : moduloNuevo === 'm3' ? 6 : 1,
    actividad: { tipo: 'buscar', n: 5 },
  };
  const esCustom = nuevo || !!unit?.custom;

  const [titulo, setTitulo] = useState(baseObj.titulo || '');
  const [duracion, setDuracion] = useState(baseObj.duracion || '15 min');
  const [etapa, setEtapa] = useState<number>(baseObj.etapa || 1);
  const [objetivo, setObjetivo] = useState(baseObj.objetivo || '');
  const [materiales, setMateriales] = useState(
    (baseObj.materiales || []).join('\n')
  );
  const [pasos, setPasos] = useState((baseObj.pasos || []).join('\n'));
  const [mano, setMano] = useState(baseObj.mano || '');
  const [consejo, setConsejo] = useState(baseObj.consejo || '');
  const [competencia, setCompetencia] = useState(baseObj.competencia || '');
  const [resultado, setResultado] = useState(baseObj.resultado || '');
  const [criterio, setCriterio] = useState(baseObj.criterio || '');
  const [actTipo, setActTipo] = useState<'buscar' | 'ninguna'>(
    baseObj.actividad?.tipo === 'ninguna' ? 'ninguna' : 'buscar'
  );
  const [actN, setActN] = useState<number>(baseObj.actividad?.n || 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    const lineas = (s: string) =>
      s
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean);

    const payload: Partial<UnitDef> = {
      titulo: titulo.trim(),
      duracion: duracion.trim(),
      etapa,
      objetivo: objetivo.trim(),
      materiales: lineas(materiales),
      pasos: lineas(pasos),
      mano: mano.trim(),
      consejo: consejo.trim(),
      competencia: competencia.trim(),
      resultado: resultado.trim(),
      criterio: criterio.trim(),
    };

    if (esCustom) {
      payload.actividad = {
        tipo: actTipo,
        n: Math.min(10, Math.max(1, actN || 5)),
      };
    }

    let id: string;
    if (nuevo && moduloNuevo) {
      id = 'c' + Date.now().toString(36);
      const l = unidadesDe(moduloNuevo, contenido, true);
      Object.assign(payload, {
        custom: true,
        modulo: moduloNuevo,
        orden: l.length ? Math.max(...l.map((z) => z.orden || 0)) + 1 : 1,
      });
    } else if (unit?.custom) {
      id = unit.id;
      Object.assign(payload, {
        custom: true,
        modulo: unit.modulo,
        orden: unit.orden,
        oculta: !!unit.oculta,
      });
    } else {
      id = unit!.id;
      payload.oculta = !!unit?.oculta;
    }

    guardarContenido(id, payload);
    onClose();
    mostrarToast(nuevo ? 'Unidad creada.' : 'Cambios guardados.');
    if (nuevo) navegar(`#u-${id}`);
  };

  return (
    <ModalFrame
      title={nuevo ? 'Nueva unidad' : 'Editar unidad'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
        <div className="p-6 space-y-4 overflow-y-auto">
          <label className="flex flex-col gap-1 font-semibold text-[0.9rem]">
            <span>Título</span>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="min-h-[44px] px-3 bg-[var(--surface)] border border-[var(--line)] rounded-[4px]"
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 font-semibold text-[0.9rem]">
              <span>Duración</span>
              <input
                type="text"
                value={duracion}
                onChange={(e) => setDuracion(e.target.value)}
                className="min-h-[44px] px-3 bg-[var(--surface)] border border-[var(--line)] rounded-[4px]"
              />
            </label>
            <label className="flex flex-col gap-1 font-semibold text-[0.9rem]">
              <span>Etapa</span>
              <select
                value={etapa}
                onChange={(e) => setEtapa(+e.target.value)}
                className="min-h-[44px] px-3 bg-[var(--surface)] border border-[var(--line)] rounded-[4px]"
              >
                {Object.entries(ETAPAS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-1 font-semibold text-[0.9rem]">
            <span>Para qué sirve (objetivo)</span>
            <textarea
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              rows={2}
              className="p-3 bg-[var(--surface)] border border-[var(--line)] rounded-[4px]"
            />
          </label>

          <label className="flex flex-col gap-1 font-semibold text-[0.9rem]">
            <span>Lo que necesitan (uno por línea)</span>
            <textarea
              value={materiales}
              onChange={(e) => setMateriales(e.target.value)}
              rows={3}
              className="p-3 bg-[var(--surface)] border border-[var(--line)] rounded-[4px]"
            />
          </label>

          <label className="flex flex-col gap-1 font-semibold text-[0.9rem]">
            <span>Paso a paso (uno por línea)</span>
            <textarea
              value={pasos}
              onChange={(e) => setPasos(e.target.value)}
              rows={5}
              className="p-3 bg-[var(--surface)] border border-[var(--line)] rounded-[4px]"
            />
          </label>

          <label className="flex flex-col gap-1 font-semibold text-[0.9rem]">
            <span>Cómo guiar la mano</span>
            <textarea
              value={mano}
              onChange={(e) => setMano(e.target.value)}
              rows={2}
              className="p-3 bg-[var(--surface)] border border-[var(--line)] rounded-[4px]"
            />
          </label>

          <label className="flex flex-col gap-1 font-semibold text-[0.9rem]">
            <span>Si algo no sale</span>
            <textarea
              value={consejo}
              onChange={(e) => setConsejo(e.target.value)}
              rows={2}
              className="p-3 bg-[var(--surface)] border border-[var(--line)] rounded-[4px]"
            />
          </label>

          <label className="flex flex-col gap-1 font-semibold text-[0.9rem]">
            <span>Competencia (docente)</span>
            <input
              type="text"
              value={competencia}
              onChange={(e) => setCompetencia(e.target.value)}
              className="min-h-[44px] px-3 bg-[var(--surface)] border border-[var(--line)] rounded-[4px]"
            />
          </label>

          <label className="flex flex-col gap-1 font-semibold text-[0.9rem]">
            <span>Resultado esperado (docente)</span>
            <input
              type="text"
              value={resultado}
              onChange={(e) => setResultado(e.target.value)}
              className="min-h-[44px] px-3 bg-[var(--surface)] border border-[var(--line)] rounded-[4px]"
            />
          </label>

          <label className="flex flex-col gap-1 font-semibold text-[0.9rem]">
            <span>Criterio de evaluación (docente)</span>
            <input
              type="text"
              value={criterio}
              onChange={(e) => setCriterio(e.target.value)}
              className="min-h-[44px] px-3 bg-[var(--surface)] border border-[var(--line)] rounded-[4px]"
            />
          </label>

          {esCustom && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 font-semibold text-[0.9rem]">
                <span>Lámina interactiva</span>
                <select
                  value={actTipo}
                  onChange={(e) =>
                    setActTipo(e.target.value as 'buscar' | 'ninguna')
                  }
                  className="min-h-[44px] px-3 bg-[var(--surface)] border border-[var(--line)] rounded-[4px]"
                >
                  <option value="buscar">Buscar puntos escondidos</option>
                  <option value="ninguna">
                    Sin lámina (solo material físico)
                  </option>
                </select>
              </label>

              <label className="flex flex-col gap-1 font-semibold text-[0.9rem]">
                <span>Cantidad de puntos (1 a 10)</span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={actN}
                  onChange={(e) => setActN(+e.target.value)}
                  className="min-h-[44px] px-3 bg-[var(--surface)] border border-[var(--line)] rounded-[4px]"
                />
              </label>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[var(--line)] flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 rounded-[4px] border border-[var(--line)] font-semibold cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="min-h-[44px] px-5 bg-[var(--accent)] text-[var(--accent-ink)] rounded-[4px] font-bold cursor-pointer"
          >
            {nuevo ? 'Crear unidad' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </ModalFrame>
  );
};
