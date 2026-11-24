import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useCamino } from '../context/CaminoContext';
import {
  filaPts,
  MODULOS,
  secuencia,
  unidad,
  unidadesDe,
} from '../data/curriculum';
import { StudentRecord, UnitDef } from '../types/camino';
import { fecha, pd, pdoble, pSVG } from '../utils/printTemplates';
import {
  AlumnoDetalleModal,
  ConfirmarModal,
  UnidadEditarModal,
} from './Modals';

export const DocenteView: React.FC = () => {
  const {
    rol,
    modo,
    uid,
    soloLectura,
    cargando,
    perfil,
    done,
    checks,
    actividades,
    intentos,
    notaDocente,
    alumnos,
    contenido,
    ajustes,
    actualizarAjustes,
    guardarContenido,
    navegar,
  } = useCamino();

  const [alumnoModal, setAlumnoModal] = useState<StudentRecord | null>(null);
  const [editarUnit, setEditarUnit] = useState<UnitDef | null>(null);
  const [crearEnMod, setCrearEnMod] = useState<'m1' | 'm2' | 'm3' | null>(null);
  const [confirmState, setConfirmState] = useState<{
    mensaje: string;
    textoOk: string;
    onConfirm: () => void;
  } | null>(null);

  useEffect(() => {
    if (rol !== 'docente') {
      navegar('#aula');
    }
  }, [rol, navegar]);

  if (rol !== 'docente') return null;

  const seq = secuencia(contenido);
  const N = seq.length;
  const lista: StudentRecord[] =
    modo === 'nube'
      ? alumnos
      : perfil
        ? [
            {
              id: 'local',
              perfil,
              done,
              checks,
              actividades,
              intentos,
              notaDocente,
              actualizado: Date.now(),
            },
          ]
        : [];

  const conPerfil = lista
    .filter((a) => !!a.perfil)
    .sort((a, b) => (b.actualizado || 0) - (a.actualizado || 0));

  const tot = conPerfil.map(
    (a) => seq.filter((u) => !!(a.done || {})[u.id]).length
  );
  const prom = conPerfil.length
    ? Math.round((tot.reduce((x, y) => x + y, 0) / conPerfil.length) * 10) / 10
    : 0;
  const semana = conPerfil.filter(
    (a) => a.actualizado && Date.now() - a.actualizado < 7 * 864e5
  ).length;

  const prevSvg = pSVG(
    pdoble(80, 200, 12, ajustes.escala) +
      filaPts(180, 200, 520, 200, 6)
        .map(([x, y], i) => pd(x, y, i % 2 ? 9 : 13, ajustes.escala))
        .join('')
  );

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-10 space-y-10">
      {soloLectura && (
        <div
          role="status"
          className="border border-[var(--warn)] bg-[var(--warn-soft)] rounded-[4px] p-4 text-[0.94rem]"
        >
          <strong>Modo solo lectura en nube.</strong> Los cambios de progreso se
          guardan en este dispositivo.
        </div>
      )}

      <div className="space-y-2 pb-6 border-b border-[var(--line)]">
        <span className="block text-[0.78rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
          Panel docente
        </span>
        <h1 className="font-editorial text-[2.2rem] md:text-[2.6rem] text-[var(--ink)]">
          Seguimiento y gestión
        </h1>
        {modo === 'local' && (
          <p className="text-[0.94rem] text-[var(--muted)]">
            Modo local: aquí aparece el niño registrado en este dispositivo. Al
            conectar con la nube y compartir la app, verá a todos los niños.
          </p>
        )}
      </div>

      {/* Métricas globales */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-5 space-y-1">
          <span className="block text-[0.76rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
            Niños inscritos
          </span>
          <strong className="font-editorial text-[2.1rem] text-[var(--ink)] tabular-nums">
            {conPerfil.length}
          </strong>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-5 space-y-1">
          <span className="block text-[0.76rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
            Unidades en promedio
          </span>
          <strong className="font-editorial text-[2.1rem] text-[var(--ink)] tabular-nums">
            {prom}
            <span className="text-[1rem] text-[var(--muted)] font-legible ml-1">
              / {N}
            </span>
          </strong>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-5 space-y-1">
          <span className="block text-[0.76rem] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
            Activos esta semana
          </span>
          <strong className="font-editorial text-[2.1rem] text-[var(--ink)] tabular-nums">
            {semana}
          </strong>
        </div>
      </section>

      {/* Tabla de seguimiento por niño */}
      <section className="space-y-3">
        <h2 className="font-editorial text-[1.5rem] text-[var(--ink)]">
          Avance de cada niño
        </h2>
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] overflow-x-auto">
          {conPerfil.length > 0 ? (
            <table className="w-full text-[0.94rem] border-collapse">
              <thead>
                <tr className="border-b border-[var(--line)] text-[0.76rem] uppercase tracking-[0.05em] text-[var(--muted)]">
                  <th className="p-3.5 text-left">Niño</th>
                  <th className="p-3.5 text-left">Acompañante</th>
                  <th className="p-3.5 text-left">Avance</th>
                  <th className="p-3.5 text-left">Unidad actual</th>
                  <th className="p-3.5 text-left">Logros</th>
                  <th className="p-3.5 text-left">Última vez</th>
                  <th className="p-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {conPerfil.map((a) => {
                  const d = a.done || {};
                  const h = seq.filter((u) => !!d[u.id]).length;
                  const p = N ? Math.round((h * 100) / N) : 0;
                  const sig = seq.find((u) => !d[u.id]);
                  const so = Object.values(d).filter(
                    (x) => x.logro === 'solo'
                  ).length;
                  const ay = Object.values(d).filter(
                    (x) => x.logro === 'ayuda'
                  ).length;
                  const au = Object.values(a.intentos || {}).reduce(
                    (x, y) => x + y,
                    0
                  );

                  return (
                    <tr key={a.id} className="border-b border-[var(--line)]">
                      <td className="p-3.5">
                        <strong>{a.perfil.nino}</strong>
                        {a.id === uid && (
                          <span className="text-[var(--muted)] ml-1">
                            (usted)
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span>{a.perfil.acompanante}</span>
                        <span className="block text-[0.82rem] text-[var(--muted)]">
                          {a.perfil.relacion || ''}
                        </span>
                      </td>
                      <td className="p-3.5 min-w-[160px]">
                        <div className="h-2.5 rounded-[4px] bg-[var(--bg)] border border-[var(--line)] overflow-hidden mb-1">
                          <div
                            className="h-full bg-[var(--ok)]"
                            style={{ width: `${p}%` }}
                          />
                        </div>
                        <span className="text-[0.82rem] text-[var(--muted)] tabular-nums">
                          {h} de {N}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {sig ? sig.titulo : <strong>Terminó</strong>}
                      </td>
                      <td className="p-3.5">
                        <div className="flex flex-wrap gap-1">
                          {so > 0 && (
                            <span className="px-2 py-0.5 rounded-[4px] text-[0.76rem] font-bold border border-[var(--ok)] bg-[var(--ok-soft)] text-[var(--ok)] tabular-nums">
                              {so} solo
                            </span>
                          )}
                          {ay > 0 && (
                            <span className="px-2 py-0.5 rounded-[4px] text-[0.76rem] font-bold border border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--ink)] tabular-nums">
                              {ay} con ayuda
                            </span>
                          )}
                          {au > 0 && (
                            <span className="px-2 py-0.5 rounded-[4px] text-[0.76rem] font-bold border border-[var(--warn)] bg-[var(--warn-soft)] text-[var(--warn)] tabular-nums">
                              {au} por repetir
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 tabular-nums">
                        {fecha(a.actualizado)}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            type="button"
                            onClick={() => setAlumnoModal(a)}
                            className="min-h-[40px] px-3 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] text-[0.84rem] font-semibold hover:border-[var(--ink)] cursor-pointer"
                          >
                            Ver
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              navegar(
                                `#evaluacion/${encodeURIComponent(a.id)}`
                              )
                            }
                            className="min-h-[40px] px-3 rounded-[4px] border border-[var(--ink)] bg-[var(--surface)] text-[0.84rem] font-semibold hover:bg-[var(--bg)] cursor-pointer"
                          >
                            Evaluación
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="p-6 text-[var(--muted)]">
              {cargando
                ? 'Cargando…'
                : 'Todavía no hay niños inscritos. Comparta la app con las familias: cuando escriban el nombre del niño, aparecerán aquí.'}
            </p>
          )}
        </div>
      </section>

      {/* Gestión de contenidos */}
      <section className="space-y-4">
        <div>
          <h2 className="font-editorial text-[1.5rem] text-[var(--ink)]">
            Gestión de contenidos
          </h2>
          <p className="text-[0.94rem] text-[var(--muted)]">
            Cree, edite, oculte o elimine unidades. Los cambios les llegan a
            todas las familias.
          </p>
        </div>

        <div className="space-y-4">
          {MODULOS.map((m) => {
            const lista = unidadesDe(m.id, contenido, true);
            return (
              <div
                key={m.id}
                className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px]"
              >
                <div className="p-4 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-editorial text-[1.2rem] text-[var(--ink)]">
                    Módulo {m.num} · {m.titulo}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setCrearEnMod(m.id)}
                    className="min-h-[44px] px-3.5 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] text-[0.86rem] font-semibold hover:border-[var(--ink)] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span>Nueva unidad</span>
                  </button>
                </div>

                {lista.length > 0 ? (
                  lista.map((u, i) => (
                    <div
                      key={u.id}
                      className={`p-4 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3 ${
                        u.oculta ? 'opacity-55' : ''
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="tabular-nums">{i + 1}.</strong>
                        <span>{u.titulo}</span>
                        {u.custom && (
                          <span className="px-2 py-0.5 rounded-[4px] text-[0.74rem] font-bold border border-[var(--accent)] bg-[var(--accent-soft)]">
                            creada
                          </span>
                        )}
                        {u.editada && (
                          <span className="px-2 py-0.5 rounded-[4px] text-[0.74rem] font-bold border border-[var(--accent)] bg-[var(--accent-soft)]">
                            editada
                          </span>
                        )}
                        {u.oculta && (
                          <span className="px-2 py-0.5 rounded-[4px] text-[0.74rem] font-bold border border-[var(--warn)] bg-[var(--warn-soft)] text-[var(--warn)]">
                            oculta
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <a
                          href={`#u-${u.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            navegar(`#u-${u.id}`);
                          }}
                          className="min-h-[40px] px-3 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] text-[0.84rem] font-semibold inline-flex items-center hover:border-[var(--ink)]"
                        >
                          Abrir
                        </a>
                        <button
                          type="button"
                          onClick={() => setEditarUnit(u)}
                          className="min-h-[40px] px-3 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] text-[0.84rem] font-semibold hover:border-[var(--ink)] cursor-pointer"
                        >
                          Editar
                        </button>
                        {u.custom ? (
                          <button
                            type="button"
                            onClick={() =>
                              setConfirmState({
                                mensaje:
                                  '¿Eliminar esta unidad? Las familias dejarán de verla.',
                                textoOk: 'Eliminar',
                                onConfirm: () => {
                                  guardarContenido(u.id, null);
                                  setConfirmState(null);
                                },
                              })
                            }
                            className="min-h-[40px] px-3 rounded-[4px] border border-[var(--warn)] text-[var(--warn)] text-[0.84rem] font-semibold cursor-pointer"
                          >
                            Eliminar
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                const prev = contenido[u.id] || {};
                                guardarContenido(u.id, {
                                  ...prev,
                                  oculta: !u.oculta,
                                });
                              }}
                              className="min-h-[40px] px-3 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] text-[0.84rem] font-semibold hover:border-[var(--ink)] cursor-pointer"
                            >
                              {u.oculta ? 'Mostrar' : 'Ocultar'}
                            </button>
                            {u.editada && (
                              <button
                                type="button"
                                onClick={() =>
                                  setConfirmState({
                                    mensaje:
                                      '¿Restaurar el texto original de esta unidad?',
                                    textoOk: 'Restaurar',
                                    onConfirm: () => {
                                      guardarContenido(u.id, null);
                                      setConfirmState(null);
                                    },
                                  })
                                }
                                className="min-h-[40px] px-3 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] text-[0.84rem] font-semibold hover:border-[var(--ink)] cursor-pointer"
                              >
                                Restaurar original
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 border-t border-[var(--line)] text-[var(--muted)]">
                    Sin unidades todavía.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Calibración de impresión táctil */}
      <section className="space-y-3">
        <h2 className="font-editorial text-[1.5rem] text-[var(--ink)]">
          Calibración de impresión táctil
        </h2>
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-3">
            <label className="flex flex-col gap-2 font-semibold text-[0.95rem]">
              <span>
                Tamaño del punto en relieve:{' '}
                <strong className="tabular-nums">
                  {Math.round(ajustes.escala * 100)}%
                </strong>
              </span>
              <input
                type="range"
                min={0.7}
                max={1.5}
                step={0.05}
                value={ajustes.escala}
                onChange={(e) =>
                  actualizarAjustes({ escala: +e.target.value })
                }
                className="w-full accent-[var(--ink)]"
              />
            </label>
            <p className="text-[0.9rem] text-[var(--muted)]">
              Si los puntos salen muy juntos o ásperos y cansan al niño,
              bájelo. Si casi no se sienten, súbalo. Se aplica a todas las
              láminas y cartillas que descargue.
            </p>
          </div>

          <div
            className="bg-white border border-[var(--line)] rounded-[4px] p-2"
            dangerouslySetInnerHTML={{
              __html: prevSvg.replace(
                '<svg ',
                '<svg class="w-full h-auto block" role="img" aria-label="Vista previa de calibración del punto en relieve" '
              ),
            }}
          />
        </div>
      </section>

      {alumnoModal && (
        <AlumnoDetalleModal
          alumno={alumnoModal}
          onClose={() => setAlumnoModal(null)}
        />
      )}

      {(editarUnit || crearEnMod) && (
        <UnidadEditarModal
          unit={editarUnit}
          moduloNuevo={crearEnMod || undefined}
          onClose={() => {
            setEditarUnit(null);
            setCrearEnMod(null);
          }}
        />
      )}

      {confirmState && (
        <ConfirmarModal
          mensaje={confirmState.mensaje}
          textoOk={confirmState.textoOk}
          onConfirm={confirmState.onConfirm}
          onCancel={() => setConfirmState(null)}
        />
      )}
    </div>
  );
};
