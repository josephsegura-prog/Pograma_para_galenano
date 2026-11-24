import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AjustesUsuario,
  DoneRecord,
  ModoPersistencia,
  PerfilAcompanamiento,
  RolUsuario,
  RutaApp,
  StudentRecord,
  UnitDef,
} from '../types/camino';
import { callar, setCloudTTS } from '../utils/audio';
import { CloudDownloads, setCloudDownloads } from '../utils/printTemplates';

/* =========================================================
   LOCALSTORAGE WRAPPER
   ========================================================= */
export const LS = {
  get<T>(k: string, d: T): T {
    try {
      const v = localStorage.getItem(k);
      return v ? (JSON.parse(v) as T) : d;
    } catch {
      return d;
    }
  },
  set(k: string, v: unknown) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {
      // storage full or unavailable
    }
  },
};

/* =========================================================
   TIPOS DE CONECTOR CLOUD (window.claude.use)
   ========================================================= */
interface CloudUser {
  id: () => Promise<string>;
  canEdit: () => Promise<boolean>;
  isOwner: () => Promise<boolean>;
}
interface DocSnap {
  exists: boolean;
  metadata: { hasPendingWrites: boolean; fromCache: boolean };
  data: () => Record<string, unknown>;
}
interface ColSnap {
  docs: Array<{ id: string; data: () => Record<string, unknown> }>;
}
interface CloudDocRef {
  path: string;
  set: (d: unknown) => Promise<void>;
  update: (d: unknown) => Promise<void>;
  delete: () => Promise<void>;
  onSnapshot: (
    cb: (sn: DocSnap) => void,
    err?: (e: unknown) => void
  ) => () => void;
}
interface CloudDB {
  doc: (path: string) => CloudDocRef;
  collection: (path: string) => {
    onSnapshot: (
      cb: (sn: ColSnap) => void,
      err?: (e: unknown) => void
    ) => () => void;
  };
}

declare global {
  interface Window {
    claude?: {
      use?: (name: 'user' | 'db' | 'tts' | 'downloads') => Promise<unknown>;
    };
  }
}

export function parseHash(hash: string): RutaApp {
  const h = (hash || '').replace(/^#/, '');
  if (!h || h === 'landing') return { vista: 'landing' };
  if (h === 'aula') return { vista: 'aula' };
  if (h === 'docente') return { vista: 'docente' };
  if (h === 'taller') return { vista: 'taller' };
  if (h === 'evaluacion') return { vista: 'evaluacion' };
  if (h.startsWith('evaluacion/')) {
    return { vista: 'evaluacion', alumnoId: decodeURIComponent(h.slice('evaluacion/'.length)) };
  }
  if (h.startsWith('u-')) return { vista: 'unidad', unitId: h.slice(2) };
  return { vista: 'aula' };
}

interface CaminoContextValue {
  ruta: RutaApp;
  navegar: (hash: string) => void;
  modo: ModoPersistencia;
  rol: RolUsuario;
  setRol: (rol: RolUsuario) => void;
  puedeDocente: boolean;
  uid: string | null;
  soloLectura: boolean;
  cargando: boolean;
  perfil: PerfilAcompanamiento | null;
  setPerfil: (p: PerfilAcompanamiento) => void;
  done: Record<string, DoneRecord>;
  checks: Record<string, boolean[]>;
  actividades: Record<string, boolean>;
  intentos: Record<string, number>;
  notaDocente: string;
  setNotaLocal: (nota: string) => void;
  contenido: Record<string, Partial<UnitDef>>;
  alumnos: StudentRecord[];
  ajustes: AjustesUsuario;
  actualizarAjustes: (patch: Partial<AjustesUsuario>) => void;
  tabUnidad: 'guia' | 'lamina' | 'docente';
  setTabUnidad: (tab: 'guia' | 'lamina' | 'docente') => void;
  marcarPaso: (unitId: string, idx: number, checked: boolean) => void;
  completarActividadDigital: (unitId: string) => void;
  registrarCierreUnidad: (unitId: string, logro: 'solo' | 'ayuda' | 'aun') => void;
  guardarContenido: (id: string, obj: Partial<UnitDef> | null) => void;
  guardarNotaAlumnoCloud: (alumnoId: string, nota: string) => Promise<void>;
  reiniciarAvanceAlumno: (alumnoId: string, perfilAlumno: PerfilAcompanamiento, notaPrev?: string) => Promise<void>;
  toastMsg: string | null;
  mostrarToast: (msg: string) => void;
  anunciarVivo: (msg: string) => void;
  vivoText: string;
  modalAjustesAbierto: boolean;
  setModalAjustesAbierto: (open: boolean) => void;
  modalPerfilAbierto: boolean;
  setModalPerfilAbierto: (open: boolean) => void;
}

const CaminoContext = createContext<CaminoContextValue | null>(null);

const DEFAULT_AJUSTES: AjustesUsuario = {
  voz: true,
  grande: false,
  contraste: false,
  escala: 1,
};

export const CaminoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const savedProg = LS.get<{
    perfil?: PerfilAcompanamiento | null;
    done?: Record<string, DoneRecord>;
    checks?: Record<string, boolean[]>;
    actividades?: Record<string, boolean>;
    intentos?: Record<string, number>;
    notaDocente?: string;
  } | null>('ct-progreso', null);

  const [ruta, setRuta] = useState<RutaApp>(() => parseHash(window.location.hash));
  const [modo, setModo] = useState<ModoPersistencia>('local');
  const [rol, setRolState] = useState<RolUsuario>(() =>
    LS.get<RolUsuario>('ct-rol', 'acompanante')
  );
  const [puedeDocente, setPuedeDocente] = useState<boolean>(false);
  const [uid, setUid] = useState<string | null>(null);
  const [soloLectura, setSoloLectura] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(false);

  const [perfil, setPerfilState] = useState<PerfilAcompanamiento | null>(
    savedProg?.perfil || null
  );
  const [done, setDone] = useState<Record<string, DoneRecord>>(
    savedProg?.done || {}
  );
  const [checks, setChecks] = useState<Record<string, boolean[]>>(
    savedProg?.checks || {}
  );
  const [actividades, setActividades] = useState<Record<string, boolean>>(
    savedProg?.actividades || {}
  );
  const [intentos, setIntentos] = useState<Record<string, number>>(
    savedProg?.intentos || {}
  );
  const [notaDocente, setNotaDocente] = useState<string>(
    savedProg?.notaDocente || ''
  );

  const [contenido, setContenido] = useState<Record<string, Partial<UnitDef>>>(
    () => LS.get<Record<string, Partial<UnitDef>>>('ct-contenido', {})
  );
  const [alumnos, setAlumnos] = useState<StudentRecord[]>([]);
  const [ajustes, setAjustes] = useState<AjustesUsuario>(() => ({
    ...DEFAULT_AJUSTES,
    ...LS.get<Partial<AjustesUsuario>>('ct-ajustes', {}),
  }));
  const [tabUnidad, setTabUnidad] = useState<'guia' | 'lamina' | 'docente'>('guia');

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [vivoText, setVivoText] = useState<string>('');
  const [modalAjustesAbierto, setModalAjustesAbierto] = useState<boolean>(false);
  const [modalPerfilAbierto, setModalPerfilAbierto] = useState<boolean>(false);

  const dbRef = useRef<CloudDB | null>(null);
  const existeRef = useRef<boolean>(false);
  const pendienteRef = useRef<boolean>(false);
  const soloLecturaRef = useRef<boolean>(false);
  const tGuardarRef = useRef<number | null>(null);
  const colasRef = useRef<Record<string, Promise<unknown>>>({});
  const toastTimerRef = useRef<number | null>(null);

  const stateSnapshotRef = useRef({
    perfil,
    done,
    checks,
    actividades,
    intentos,
    notaDocente,
    modo,
    uid,
  });

  useEffect(() => {
    stateSnapshotRef.current = {
      perfil,
      done,
      checks,
      actividades,
      intentos,
      notaDocente,
      modo,
      uid,
    };
  }, [perfil, done, checks, actividades, intentos, notaDocente, modo, uid]);

  const mostrarToast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMsg(null), 3200);
  }, []);

  const anunciarVivo = useCallback((msg: string) => {
    setVivoText(msg);
  }, []);

  // Aplicar clases funcionales html.grande y :root.contraste
  useEffect(() => {
    const r = document.documentElement;
    r.classList.toggle('grande', !!ajustes.grande);
    r.classList.toggle('contraste', !!ajustes.contraste);
    LS.set('ct-ajustes', ajustes);
  }, [ajustes]);

  const actualizarAjustes = useCallback((patch: Partial<AjustesUsuario>) => {
    setAjustes((prev) => {
      const next = { ...prev, ...patch };
      if (patch.voz === false) callar();
      return next;
    });
  }, []);

  const errorDb = useCallback(
    (e: unknown) => {
      const c = (e as { code?: string } | null)?.code;
      if (c === 'invalid_argument' && !soloLecturaRef.current) {
        soloLecturaRef.current = true;
        setSoloLectura(true);
        mostrarToast(
          'No se pudo guardar en la nube. El avance queda guardado en este dispositivo.'
        );
      } else if (c === 'quota_exceeded') {
        mostrarToast('La base de datos está llena. Avísale al docente.');
      } else if (c === 'unavailable') {
        mostrarToast('Sin conexión por ahora. Intentaremos de nuevo.');
      }
    },
    [mostrarToast]
  );

  const enCola = useCallback(
    (path: string, fn: () => Promise<unknown>) => {
      const colas = colasRef.current;
      colas[path] = (colas[path] || Promise.resolve())
        .then(fn)
        .catch((e) => errorDb(e));
      return colas[path];
    },
    [errorDb]
  );

  const persistirProgreso = useCallback(
    (override?: {
      perfil?: PerfilAcompanamiento | null;
      done?: Record<string, DoneRecord>;
      checks?: Record<string, boolean[]>;
      actividades?: Record<string, boolean>;
      intentos?: Record<string, number>;
      notaDocente?: string;
    }) => {
      const cur = stateSnapshotRef.current;
      const payload = {
        perfil: override?.perfil !== undefined ? override.perfil : cur.perfil,
        done: override?.done !== undefined ? override.done : cur.done,
        checks: override?.checks !== undefined ? override.checks : cur.checks,
        actividades:
          override?.actividades !== undefined
            ? override.actividades
            : cur.actividades,
        intentos:
          override?.intentos !== undefined ? override.intentos : cur.intentos,
        notaDocente:
          override?.notaDocente !== undefined
            ? override.notaDocente
            : cur.notaDocente,
        actualizado: Date.now(),
      };
      LS.set('ct-progreso', payload);

      if (
        cur.modo !== 'nube' ||
        soloLecturaRef.current ||
        !cur.uid ||
        !dbRef.current
      ) {
        return;
      }

      pendienteRef.current = true;
      if (tGuardarRef.current) window.clearTimeout(tGuardarRef.current);
      tGuardarRef.current = window.setTimeout(() => {
        const db = dbRef.current;
        if (!db || !cur.uid) return;
        const ref = db.doc(`progreso/${cur.uid}`);
        enCola(ref.path, async () => {
          if (existeRef.current) {
            await ref.update(payload);
          } else {
            await ref.set(payload);
            existeRef.current = true;
          }
        }).finally(() => {
          pendienteRef.current = false;
        });
      }, 500);
    },
    [enCola]
  );

  // Conectar con window.claude.use al iniciar
  useEffect(() => {
    let cancelado = false;
    const unsubs: Array<() => void> = [];

    async function usar(name: 'user' | 'db' | 'tts' | 'downloads') {
      try {
        return window.claude && window.claude.use
          ? await window.claude.use(name)
          : null;
      } catch {
        return null;
      }
    }

    (async function conectar() {
      if (!(window.claude && window.claude.use)) return;
      setCargando(true);
      const [userRaw, dbRaw, ttsRaw, dlRaw] = await Promise.all([
        usar('user'),
        usar('db'),
        usar('tts'),
        usar('downloads'),
      ]);
      if (cancelado) return;

      const user = userRaw as CloudUser | null;
      const db = dbRaw as CloudDB | null;
      setCloudTTS((ttsRaw as Parameters<typeof setCloudTTS>[0]) || null);
      setCloudDownloads((dlRaw as CloudDownloads) || null);

      let localUid: string | null = null;
      let canDoc = false;
      try {
        if (user) {
          localUid = await user.id();
          canDoc = !!(await user.canEdit()) || !!(await user.isOwner());
        }
      } catch {
        // noop
      }
      if (cancelado) return;

      setUid(localUid);
      setPuedeDocente(canDoc);
      if (canDoc && LS.get<RolUsuario | null>('ct-rol', null) === null) {
        setRolState('docente');
      } else if (!canDoc && LS.get<RolUsuario>('ct-rol', 'acompanante') === 'docente' && db) {
        setRolState('acompanante');
      }

      if (db && localUid) {
        dbRef.current = db;
        setModo('nube');
        const timeout = window.setTimeout(() => {
          if (!cancelado) {
            setCargando(false);
            mostrarToast(
              'No pudimos conectar con la nube todavía. Puede seguir trabajando.'
            );
          }
        }, 10000);

        const u1 = db.doc(`progreso/${localUid}`).onSnapshot(
          (sn) => {
            window.clearTimeout(timeout);
            setCargando(false);
            if (sn.metadata.hasPendingWrites || pendienteRef.current) return;
            if (sn.exists) {
              const d = sn.data() as {
                perfil?: PerfilAcompanamiento;
                done?: Record<string, DoneRecord>;
                checks?: Record<string, boolean[]>;
                actividades?: Record<string, boolean>;
                intentos?: Record<string, number>;
                notaDocente?: string;
              };
              existeRef.current = true;
              if (d.perfil) setPerfilState(d.perfil);
              if (d.done) setDone({ ...d.done });
              if (d.checks) setChecks({ ...d.checks });
              if (d.actividades) setActividades({ ...d.actividades });
              if (d.intentos) setIntentos({ ...d.intentos });
              setNotaDocente(d.notaDocente || '');
              LS.set('ct-progreso', {
                perfil: d.perfil || stateSnapshotRef.current.perfil,
                done: d.done || {},
                checks: d.checks || {},
                actividades: d.actividades || {},
                intentos: d.intentos || {},
                notaDocente: d.notaDocente || '',
              });
            } else if (!sn.metadata.fromCache) {
              existeRef.current = false;
              if (stateSnapshotRef.current.perfil) {
                persistirProgreso();
              }
            }
          },
          (e) => {
            window.clearTimeout(timeout);
            setCargando(false);
            errorDb(e);
          }
        );
        unsubs.push(u1);

        const u2 = db.collection('contenido').onSnapshot(
          (sn) => {
            const c: Record<string, Partial<UnitDef>> = {};
            sn.docs.forEach((doc) => {
              c[doc.id] = doc.data() as Partial<UnitDef>;
            });
            setContenido(c);
            LS.set('ct-contenido', c);
          },
          () => {}
        );
        unsubs.push(u2);

        if (canDoc) {
          const u3 = db.collection('progreso').onSnapshot(
            (sn) => {
              setAlumnos(
                sn.docs.map((doc) => ({
                  id: doc.id,
                  ...(doc.data() as Omit<StudentRecord, 'id'>),
                }))
              );
            },
            () => {}
          );
          unsubs.push(u3);
        }
      } else {
        setCargando(false);
      }
    })();

    return () => {
      cancelado = true;
      unsubs.forEach((fn) => fn());
    };
  }, [errorDb, mostrarToast, persistirProgreso]);

  // Hash routing listener
  useEffect(() => {
    const onHashChange = () => {
      callar();
      const parsed = parseHash(window.location.hash);
      if (parsed.vista === 'unidad') {
        setTabUnidad('guia');
      }
      setRuta(parsed);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navegar = useCallback((hash: string) => {
    const clean = hash.startsWith('#') ? hash : `#${hash}`;
    if (window.location.hash === clean) {
      setRuta(parseHash(clean));
      window.scrollTo(0, 0);
    } else {
      window.location.hash = clean;
    }
  }, []);

  const setRol = useCallback(
    (nextRol: RolUsuario) => {
      setRolState(nextRol);
      LS.set('ct-rol', nextRol);
      if (nextRol !== 'docente' && window.location.hash === '#docente') {
        navegar('#aula');
      }
    },
    [navegar]
  );

  const setPerfil = useCallback(
    (p: PerfilAcompanamiento) => {
      setPerfilState(p);
      persistirProgreso({ perfil: p });
    },
    [persistirProgreso]
  );

  const setNotaLocal = useCallback(
    (nota: string) => {
      setNotaDocente(nota);
      persistirProgreso({ notaDocente: nota });
    },
    [persistirProgreso]
  );

  const marcarPaso = useCallback(
    (unitId: string, idx: number, checked: boolean) => {
      setChecks((prev) => {
        const arr = (prev[unitId] || []).slice();
        arr[idx] = checked;
        const next = { ...prev, [unitId]: arr };
        persistirProgreso({ checks: next });
        return next;
      });
    },
    [persistirProgreso]
  );

  const completarActividadDigital = useCallback(
    (unitId: string) => {
      setActividades((prev) => {
        if (prev[unitId]) return prev;
        const next = { ...prev, [unitId]: true };
        persistirProgreso({ actividades: next });
        return next;
      });
    },
    [persistirProgreso]
  );

  const registrarCierreUnidad = useCallback(
    (unitId: string, logro: 'solo' | 'ayuda' | 'aun') => {
      if (logro === 'aun') {
        setIntentos((prev) => {
          const next = { ...prev, [unitId]: (prev[unitId] || 0) + 1 };
          persistirProgreso({ intentos: next });
          return next;
        });
        return;
      }
      setDone((prev) => {
        const next: Record<string, DoneRecord> = {
          ...prev,
          [unitId]: { t: Date.now(), logro },
        };
        persistirProgreso({ done: next });
        return next;
      });
    },
    [persistirProgreso]
  );

  const guardarContenido = useCallback(
    (id: string, obj: Partial<UnitDef> | null) => {
      setContenido((prev) => {
        const next = { ...prev };
        if (obj === null) delete next[id];
        else next[id] = obj;
        LS.set('ct-contenido', next);
        return next;
      });
      if (modo === 'nube' && dbRef.current) {
        const ref = dbRef.current.doc(`contenido/${id}`);
        enCola(ref.path, () => (obj === null ? ref.delete() : ref.set(obj)));
      }
    },
    [enCola, modo]
  );

  const guardarNotaAlumnoCloud = useCallback(
    async (alumnoId: string, nota: string) => {
      if (modo === 'local' || alumnoId === 'local') {
        setNotaLocal(nota);
        mostrarToast('Nota guardada.');
        return;
      }
      if (!dbRef.current) return;
      const ref = dbRef.current.doc(`progreso/${alumnoId}`);
      await enCola(ref.path, () => ref.update({ notaDocente: nota }));
      mostrarToast('Nota guardada.');
    },
    [enCola, modo, mostrarToast, setNotaLocal]
  );

  const reiniciarAvanceAlumno = useCallback(
    async (
      alumnoId: string,
      perfilAlumno: PerfilAcompanamiento,
      notaPrev = ''
    ) => {
      if (modo === 'local' || alumnoId === 'local') {
        setDone({});
        setChecks({});
        setActividades({});
        setIntentos({});
        persistirProgreso({
          done: {},
          checks: {},
          actividades: {},
          intentos: {},
        });
        mostrarToast('Avance reiniciado.');
        return;
      }
      if (!dbRef.current) return;
      const ref = dbRef.current.doc(`progreso/${alumnoId}`);
      await enCola(ref.path, () =>
        ref.set({
          perfil: perfilAlumno,
          notaDocente: notaPrev,
          done: {},
          checks: {},
          actividades: {},
          intentos: {},
          actualizado: Date.now(),
        })
      );
      mostrarToast('Avance reiniciado.');
    },
    [enCola, modo, mostrarToast, persistirProgreso]
  );

  return (
    <CaminoContext.Provider
      value={{
        ruta,
        navegar,
        modo,
        rol,
        setRol,
        puedeDocente,
        uid,
        soloLectura,
        cargando,
        perfil,
        setPerfil,
        done,
        checks,
        actividades,
        intentos,
        notaDocente,
        setNotaLocal,
        contenido,
        alumnos,
        ajustes,
        actualizarAjustes,
        tabUnidad,
        setTabUnidad,
        marcarPaso,
        completarActividadDigital,
        registrarCierreUnidad,
        guardarContenido,
        guardarNotaAlumnoCloud,
        reiniciarAvanceAlumno,
        toastMsg,
        mostrarToast,
        anunciarVivo,
        vivoText,
        modalAjustesAbierto,
        setModalAjustesAbierto,
        modalPerfilAbierto,
        setModalPerfilAbierto,
      }}
    >
      {children}
    </CaminoContext.Provider>
  );
};

export function useCamino(): CaminoContextValue {
  const ctx = useContext(CaminoContext);
  if (!ctx) throw new Error('useCamino debe usarse dentro de CaminoProvider');
  return ctx;
}
