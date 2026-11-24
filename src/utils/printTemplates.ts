import {
  ETAPAS,
  filaPts,
  GEO,
  H,
  MODULOS,
  numEnModulo,
  W,
} from '../data/curriculum';
import { UnitDef } from '../types/camino';

export interface CloudDownloads {
  save: (opts: { filename: string; data: string }) => Promise<void>;
}

let cloudDL: CloudDownloads | null = null;

export function setCloudDownloads(dl: CloudDownloads | null) {
  cloudDL = dl;
}

export function hasCloudDownloads(): boolean {
  return !!cloudDL;
}

export const esc = (s: unknown): string =>
  String(s ?? '').replace(/[&<>"']/g, (c) => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return map[c] || c;
  });

export function fecha(ts?: number): string {
  if (!ts) return '—';
  const d = new Date(ts);
  const dias = Math.floor((Date.now() - ts) / 864e5);
  if (dias < 1) return 'hoy';
  if (dias < 2) return 'ayer';
  if (dias < 8) return `hace ${dias} días`;
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

export function slug(s: string): string {
  return String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
}

export function pSVG(inner: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><rect x="0" y="0" width="${W}" height="${H}" fill="#fff"/><path d="M14 14 H50 L14 50 Z" fill="#000"/>${inner}</svg>`;
}

export function pd(x: number, y: number, r: number, escala: number): string {
  return `<circle cx="${x}" cy="${y}" r="${(r * escala).toFixed(1)}" fill="#000"/>`;
}

export function pdoble(
  x: number,
  y: number,
  r: number,
  escala: number
): string {
  return (
    pd(x, y, r, escala) +
    `<circle cx="${x}" cy="${y}" r="${((r + 9) * escala).toFixed(1)}" fill="none" stroke="#000" stroke-width="${(5 * escala).toFixed(1)}"/>`
  );
}

export interface LaminaGenerada {
  titulo: string;
  svg: string;
}

export function laminas(u: UnitDef, escala: number): LaminaGenerada[] {
  const t = (u.actividad && u.actividad.tipo) || 'ninguna';
  const out: LaminaGenerada[] = [];
  const seqSVG = (pts: [number, number][]) =>
    pSVG(
      pts
        .map(([x, y], i) =>
          i === 0 ? pdoble(x, y, 11, escala) : pd(x, y, 11, escala)
        )
        .join('')
    );

  if (t === 'presencia') {
    out.push({
      titulo: 'Lámina: ¿hay punto?',
      svg: pSVG(
        GEO.presencia
          .map(
            (c) =>
              `<rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" rx="10" fill="none" stroke="#000" stroke-width="3"/>` +
              (c.punto ? pd(c.x + c.w / 2, c.y + c.h / 2, 15, escala) : '')
          )
          .join('')
      ),
    });
  }
  if (t === 'tamanos') {
    out.push({
      titulo: 'Lámina: grandes y pequeños',
      svg: pSVG(
        GEO.tamanos
          .map(([x, y, g]) => pd(x, y, g ? 22 : 9, escala))
          .join('')
      ),
    });
  }
  if (t === 'camino') {
    out.push({ titulo: 'Lámina: el camino', svg: seqSVG(GEO.camino) });
  }
  if (t === 'buscar') {
    const n = Math.min(10, (u.actividad && u.actividad.n) || 10);
    out.push({
      titulo: `Lámina: ${n} puntos escondidos`,
      svg: pSVG(
        GEO.buscar
          .slice(0, n)
          .map(([x, y]) => pd(x, y, 13, escala))
          .join('')
      ),
    });
  }
  if (t === 'referencia') {
    out.push({
      titulo: 'Lámina: punto de partida',
      svg: pSVG(
        pdoble(GEO.referencia.casa[0], GEO.referencia.casa[1], 12, escala) +
          GEO.referencia.pts
            .map(([x, y]) => pd(x, y, 13, escala))
            .join('')
      ),
    });
  }
  if (t === 'direcciones') {
    const d = GEO.direcciones;
    out.push({
      titulo: 'Lámina: direcciones',
      svg: pSVG(
        pdoble(d.c[0], d.c[1], 14, escala) +
          Object.values(d.o)
            .map(
              ([x, y]) =>
                pd(x, y, 13, escala) +
                filaPts(d.c[0], d.c[1], x, y, 6)
                  .slice(1, -1)
                  .map(([a, b]) => pd(a, b, 4, escala))
                  .join('')
            )
            .join('')
      ),
    });
  }
  if (t === 'cuerpo') {
    const c = GEO.cuerpo;
    out.push({
      titulo: 'Lámina: mi cuerpo (de espaldas)',
      svg: pSVG(
        `<g fill="none" stroke="#000" stroke-width="5" stroke-linecap="round"><circle cx="300" cy="72" r="38"/><rect x="252" y="118" width="96" height="128" rx="30"/><path d="M256 140 L170 228 M344 140 L430 228 M280 246 L262 342 M320 246 L338 342"/></g>` +
          Object.entries(c)
            .map(([k, [x, y]]) =>
              k === 'centro' ? pdoble(x, y, 12, escala) : pd(x, y, 12, escala)
            )
            .join('')
      ),
    });
  }
  if (t === 'laberinto') {
    const M = GEO.laberinto;
    const cw = W / M[0].length;
    const ch = H / M.length;
    let s = '';
    M.forEach((f, y) =>
      [...f].forEach((c, x) => {
        const cx = x * cw + cw / 2;
        const cy = y * ch + ch / 2;
        if (c === '#') {
          s += `<rect x="${x * cw + 2}" y="${y * ch + 2}" width="${cw - 4}" height="${ch - 4}" rx="5" fill="#000"/>`;
        } else if (c === 'S') {
          s += pdoble(cx, cy, 7, escala);
        } else if (c === 'M') {
          s += `<rect x="${cx - 17}" y="${cy - 17}" width="34" height="34" rx="4" fill="none" stroke="#000" stroke-width="5"/>`;
        } else {
          s += pd(cx, cy, 5, escala);
        }
      })
    );
    out.push({ titulo: 'Lámina: laberinto', svg: pSVG(s) });
  }
  if (t === 'lineas') {
    Object.values(GEO.lineas).forEach((l) =>
      out.push({
        titulo: `Lámina: línea ${l.nombre.toLowerCase()}`,
        svg: seqSVG(l.pts),
      })
    );
  }
  if (t === 'formas') {
    Object.values(GEO.formas).forEach((l) =>
      out.push({
        titulo: `Lámina: ${l.nombre.toLowerCase()}`,
        svg: seqSVG(l.pts),
      })
    );
  }

  return out;
}

export async function entregar(
  nombre: string,
  datos: string,
  mimeType = 'text/plain;charset=utf-8',
  onToast?: (msg: string) => void
): Promise<void> {
  if (cloudDL) {
    try {
      await cloudDL.save({ filename: nombre, data: datos });
      onToast?.(`Archivo listo: ${nombre}`);
      return;
    } catch (e: unknown) {
      const err = e as { code?: string };
      if (err && err.code === 'declined') return;
    }
  }

  // Descarga nativa automática en navegador estándar vía Blob + URL.createObjectURL
  try {
    const blob = new Blob([datos], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onToast?.(`Archivo descargado: ${nombre}`);
  } catch {
    onToast?.('La descarga no está disponible en esta vista.');
  }
}

export function descargarSVG(
  u: UnitDef,
  escala: number,
  contenido: Record<string, Partial<UnitDef>>,
  onToast?: (msg: string) => void
) {
  const ls = laminas(u, escala);
  if (!ls.length) return;
  const n = numEnModulo(u, contenido).i;
  if (ls.length === 1) {
    return entregar(
      `lamina-${n}-${slug(u.titulo)}.svg`,
      ls[0].svg.replace('<svg ', '<svg width="297mm" height="198mm" '),
      'image/svg+xml;charset=utf-8',
      onToast
    );
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="297mm" height="${198 * ls.length}mm" viewBox="0 0 ${W} ${H * ls.length}">${ls
    .map(
      (l, i) =>
        `<g transform="translate(0 ${H * i})">${l.svg
          .replace(/^<svg[^>]*>/, '')
          .replace(/<\/svg>$/, '')}</g>`
    )
    .join('')}</svg>`;
  return entregar(
    `laminas-${n}-${slug(u.titulo)}.svg`,
    svg,
    'image/svg+xml;charset=utf-8',
    onToast
  );
}

export function descargarCartilla(
  u: UnitDef,
  escala: number,
  contenido: Record<string, Partial<UnitDef>>,
  conDocente: boolean,
  onToast?: (msg: string) => void
) {
  const n = numEnModulo(u, contenido);
  const m = MODULOS.find((x) => x.id === u.modulo);
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Cartilla ${n.i} - ${esc(u.titulo)}</title><style>
@page{size:A4 landscape;margin:12mm}body{font-family:Arial,Helvetica,sans-serif;font-size:15pt;color:#111;margin:0}
.pag{page-break-after:always;min-height:180mm;padding:4mm}.pag:last-child{page-break-after:auto}
.zona{display:inline-block;background:#FDF2E6;border:1px solid #C88A1E;color:#1C1917;padding:4px 12px;border-radius:4px;font-weight:bold;font-size:11pt;letter-spacing:.05em}
h1{font-size:24pt;margin:8px 0}h2{font-size:15pt;margin:14px 0 4px;color:#1C1917}ol,ul{margin:4px 0;padding-left:22px}li{margin:3px 0}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:12mm}.caja{border:1.5px solid #1C1917;border-radius:4px;padding:8px 12px;margin-top:8px}
.tactil svg{width:100%;height:178mm;display:block}.pie{font-size:8pt;color:#686158;text-align:right}
</style></head><body>
<section class="pag"><span class="zona">ZONA DEL ACOMPAÑANTE · Módulo ${m ? m.num : 1} · Unidad ${n.i}</span><h1>${esc(u.titulo)}</h1><p><b>Para qué sirve:</b> ${esc(u.objetivo)}</p>
<div class="cols"><div><h2>Paso a paso</h2><ol>${(u.pasos || []).map((p) => `<li>${esc(p)} &#9744;</li>`).join('')}</ol></div><div><h2>Lo que necesitan</h2><ul>${(u.materiales || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul><div class="caja"><b>Cómo guiar la mano:</b> ${esc(u.mano || '')}</div><div class="caja"><b>Si algo no sale:</b> ${esc(u.consejo || '')}</div>
<p style="margin-top:10px">¿Cómo le fue? &#9744; Lo logró solo &nbsp; &#9744; Con ayuda &nbsp; &#9744; Aún no &nbsp;&nbsp; Fecha: ________</p></div></div></section>
${
  conDocente
    ? `<section class="pag"><span class="zona">GESTIÓN DOCENTE</span><h1>${esc(u.titulo)}</h1><h2>Competencia</h2><p>${esc(u.competencia || '')}</p><h2>Resultado de aprendizaje esperado</h2><p>${esc(u.resultado || '')}</p><h2>Criterio de evaluación formativa</h2><p>${esc(u.criterio || '')}</p><h2>Etapa</h2><p>${esc(ETAPAS[u.etapa] || '')}</p></section>`
    : ''
}
${laminas(u, escala)
  .map(
    (l) =>
      `<section class="pag tactil">${l.svg}<p class="pie">${esc(l.titulo)} · Unidad ${n.i} · Camino Táctil · El triángulo va arriba a la izquierda</p></section>`
  )
  .join('')}
</body></html>`;
  return entregar(
    `cartilla-${n.i}-${slug(u.titulo)}.html`,
    html,
    'text/html;charset=utf-8',
    onToast
  );
}
