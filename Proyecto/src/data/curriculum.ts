import { DoneRecord, ModuloDef, RolUsuario, UnitDef } from '../types/camino';

export const ETAPAS: Record<number, string> = {
  1: 'Puntos y dimensiones',
  2: 'Orientación espacial',
  3: 'Formas abiertas',
  4: 'Formas cerradas',
  5: 'Texturas y realidad',
  6: 'Celdilla Braille',
};

export const MODULOS: ModuloDef[] = [
  {
    id: 'm1',
    num: 1,
    titulo: 'Primeros puntos, espacio y formas',
    desc: 'Diez unidades para preparar las manos antes del Braille: el punto, su tamaño, los caminos, el centro del cuerpo, las direcciones, las líneas y las figuras.',
  },
  {
    id: 'm2',
    num: 2,
    titulo: 'Texturas y mundo real',
    desc: 'Del dibujo en relieve al objeto de verdad: la silueta de un árbol y su corteza, una flor, una casa.',
  },
  {
    id: 'm3',
    num: 3,
    titulo: 'Hacia la celdilla Braille',
    desc: 'La celdilla de seis puntos, sus posiciones y las primeras letras.',
  },
];

export const BASE: UnitDef[] = [
  {
    id: 'm1u1',
    modulo: 'm1',
    etapa: 1,
    titulo: '¿Hay punto o no hay punto?',
    duracion: '10 a 15 min',
    objetivo:
      'Que el niño descubra con la yema del dedo si en un lugar hay un punto en relieve o no hay nada.',
    materiales: [
      'Lámina 1 impresa en relieve (6 cuadros)',
      'Una mesa despejada',
      'Un lugar tranquilo, sin televisor ni radio',
    ],
    pasos: [
      'Siente al niño frente a la mesa y ponga la lámina derecha, con la esquina marcada (el triángulo) arriba a la izquierda.',
      'Tome con suavidad la mano con la que el niño come y apoye la yema de su dedo índice en el primer cuadro.',
      'Pregúntele: "¿Hay punto o no hay punto?". Espere la respuesta sin apurarlo.',
      'Si acierta, celébrelo con la voz: "¡Muy bien, lo encontraste!". Si no, vuelvan a pasar el dedo despacio juntos.',
      'Repitan con los 6 cuadros. Al final cuenten juntos cuántos puntos encontraron.',
    ],
    mano: 'Ponga su mano encima de la del niño, como un guante, y deje libre su dedo índice. Muévanse despacio y sin apretar: el niño debe sentir, no empujar.',
    consejo:
      'Si el niño retira la mano, pare y jueguen a tocar cosas conocidas (una toalla, una moneda, una hoja). Aceptar el contacto también se aprende.',
    competencia: 'Discrimina táctilmente la presencia o ausencia de un punto en relieve.',
    resultado: 'Identifica correctamente al menos 4 de los 6 cuadros.',
    criterio:
      'Observe si explora con la yema (no con la uña ni con la palma) y si responde con seguridad.',
    actividad: { tipo: 'presencia' },
  },
  {
    id: 'm1u2',
    modulo: 'm1',
    etapa: 1,
    titulo: 'Puntos grandes y puntos pequeños',
    duracion: '15 min',
    objetivo:
      'Que el niño note la diferencia de tamaño entre un punto grande y uno pequeño y adapte la yema del dedo a cada uno.',
    materiales: [
      'Lámina 2 en relieve (8 puntos de dos tamaños)',
      'Una pelota grande y una canica o botón pequeño',
    ],
    pasos: [
      'Antes de la lámina, póngale en las manos la pelota y luego el botón. Diga: "Esto es grande, esto es pequeño".',
      'Ponga la lámina con la esquina marcada arriba a la izquierda y lleve el dedo del niño al primer punto grande.',
      'Ahora llévelo a un punto pequeño y diga: "Este es pequeño, casi no se siente".',
      'Pídale: "Busca un punto grande". Cuando lo encuentre, pídale uno pequeño. Alternen.',
      'Terminen cuando haya encontrado 3 grandes y 3 pequeños.',
    ],
    mano: 'Guíe solo la muñeca, no los dedos. Así el niño mueve sus dedos libremente y siente el tamaño por sí mismo.',
    consejo:
      'Si confunde los tamaños, vuelvan a la pelota y el botón. Comparar con objetos reales ayuda mucho.',
    competencia: 'Diferencia dimensiones de puntos en relieve (grande / pequeño).',
    resultado: 'Señala 3 puntos grandes y 3 pequeños cuando se le pide.',
    criterio:
      'Registre si necesita volver a los objetos concretos o si discrimina directamente en la lámina.',
    actividad: { tipo: 'tamanos' },
  },
  {
    id: 'm1u3',
    modulo: 'm1',
    etapa: 1,
    titulo: 'El camino de puntos',
    duracion: '15 min',
    objetivo:
      'Que el niño siga una fila de puntos de izquierda a derecha sin saltarse ninguno, como se lee el Braille.',
    materiales: [
      'Lámina 3 en relieve (fila de 8 puntos)',
      'Un carrito de juguete o una ficha',
    ],
    pasos: [
      'Jueguen primero en la mesa: deslice el carrito de izquierda a derecha y diga "el carrito va para este lado".',
      'Ponga la lámina y lleve el dedo del niño al primer punto, el que es doble (el punto de partida).',
      'Diga: "Vamos a seguir el camino" y avancen punto por punto hacia la derecha, contando en voz alta.',
      'Al llegar al final, diga: "¡Llegamos!" y vuelvan juntos al punto de partida.',
      'Repitan 3 veces. La última vez, suelte un poco la mano y deje que el niño avance solo.',
    ],
    mano: 'Al inicio su mano va encima de la del niño. En cada repetición, aflójela un poco. La meta es que al final el niño haga el camino solo.',
    consejo: 'Si se salta puntos, vayan más despacio y cuenten en voz alta cada punto.',
    competencia: 'Realiza rastreo digital ordenado de izquierda a derecha.',
    resultado:
      'Recorre la fila completa sin omitir puntos en al menos 1 de 3 intentos sin ayuda.',
    criterio:
      'Observe la dirección del movimiento y si regresa al punto de partida por sí mismo.',
    actividad: { tipo: 'camino' },
  },
  {
    id: 'm1u4',
    modulo: 'm1',
    etapa: 1,
    titulo: 'El laberinto',
    duracion: '15 a 20 min',
    objetivo:
      'Que el niño siga un camino de puntos, encuentre los bloqueos y busque otra salida hasta llegar a la meta.',
    materiales: [
      'Lámina 4 en relieve (laberinto)',
      'Un premio pequeño para la meta (un aplauso, una canción)',
    ],
    pasos: [
      'Cuente la historia: "Un conejito quiere llegar a su casa y tiene que encontrar el camino".',
      'Ponga el dedo del niño en la salida (el punto doble) y explíquele que las zonas lisas y altas son paredes.',
      'Avancen siguiendo los puntitos. Cuando toquen una pared, diga: "¡Uy, bloqueado! Busquemos otro camino".',
      'Al llegar a la meta (el cuadro), celébrenlo con el premio.',
      'Hagan el laberinto 2 veces. La segunda, deje que el niño decida por dónde ir.',
    ],
    mano: 'En los cruces, detenga la mano del niño y pregúntele: "¿Seguimos derecho o damos la vuelta?". Déjelo decidir.',
    consejo:
      'Equivocarse de camino es parte del juego. No corrija rápido: dele tiempo para que sienta la pared.',
    competencia: 'Resuelve recorridos táctiles con caminos abiertos y bloqueos.',
    resultado: 'Llega a la meta reconociendo al menos 2 bloqueos.',
    criterio: 'Valore la persistencia ante el bloqueo y la capacidad de retroceder.',
    actividad: { tipo: 'laberinto' },
  },
  {
    id: 'm1u5',
    modulo: 'm1',
    etapa: 1,
    titulo: 'Reto: encuentra los 10 puntos',
    duracion: '15 min',
    objetivo:
      'Que el niño explore toda la lámina de forma ordenada hasta encontrar los 10 puntos escondidos.',
    materiales: [
      'Lámina 5 en relieve (10 puntos repartidos)',
      '10 fichas, granos o tapas para contar',
    ],
    pasos: [
      'Explique el reto: "En esta hoja hay 10 puntos escondidos. ¡Vamos a encontrarlos todos!".',
      'Empiecen en la esquina marcada y recorran la hoja por filas, de izquierda a derecha y de arriba hacia abajo.',
      'Cada vez que encuentre un punto, el niño pone una ficha en un vaso y cuentan juntos.',
      'Si ya pasaron por toda la hoja y faltan puntos, vuelvan a empezar desde la esquina.',
      'Al llegar a 10, celebren el logro.',
    ],
    mano: 'Enséñele a usar las dos manos: una se queda quieta en la esquina como "ancla" y la otra busca.',
    consejo:
      'Si se cansa, dejen el reto en 5 puntos y terminen otro día. El reto debe ser divertido.',
    competencia:
      'Explora sistemáticamente una superficie y mantiene la permanencia del objeto.',
    resultado: 'Encuentra los 10 puntos con una exploración ordenada.',
    criterio:
      'Observe si usa la mano de anclaje y si sigue un orden (filas) o explora al azar.',
    actividad: { tipo: 'buscar', n: 10 },
  },
  {
    id: 'm1u6',
    modulo: 'm1',
    etapa: 2,
    titulo: 'Mi cuerpo es el centro',
    duracion: '15 min',
    objetivo:
      'Que el niño reconozca su propio cuerpo como el punto de referencia (centroide) desde donde se ubica todo lo demás.',
    materiales: ['Espacio libre en el piso', 'Una cinta o pañuelo para la muñeca derecha'],
    pasos: [
      'Ponga la cinta en la muñeca derecha del niño. Diga: "Esta es tu mano derecha".',
      'Toque con él su barriga y diga: "Este es tu centro. Desde aquí empieza todo".',
      'Pídale que se toque la cabeza ("arriba") y luego los pies ("abajo").',
      'Pídale que levante la mano derecha (la de la cinta) y luego la izquierda.',
      'Hagan el juego "Simón dice": "Simón dice: toca tu centro, toca arriba, toca tu mano izquierda".',
    ],
    mano: 'Aquí no se guía la mano sobre la lámina: se acompaña el cuerpo. Párese detrás del niño, mirando hacia el mismo lado; así su derecha es la misma que la de él.',
    consejo:
      'Nunca se ponga de frente para enseñar derecha e izquierda: se invierten y el niño se confunde.',
    competencia:
      'Construye su esquema corporal y reconoce su cuerpo como punto de referencia.',
    resultado: 'Señala centro, arriba, abajo, derecha e izquierda en su cuerpo.',
    criterio: 'Registre si diferencia derecha e izquierda sin la cinta.',
    actividad: { tipo: 'cuerpo' },
  },
  {
    id: 'm1u7',
    modulo: 'm1',
    etapa: 2,
    titulo: 'Arriba, abajo, izquierda, derecha',
    duracion: '15 min',
    objetivo:
      'Que el niño mueva el dedo desde un punto central hacia arriba, abajo, izquierda y derecha cuando se le pide.',
    materiales: ['Lámina 7 en relieve (un punto central y 4 puntos alrededor)'],
    pasos: [
      'Ponga el dedo del niño en el punto del centro. Diga: "Aquí estás tú, en tu centro".',
      'Diga "sube" y lleve su dedo hacia el punto de arriba. Vuelvan al centro.',
      'Repitan con "baja", "a la izquierda" y "a la derecha", volviendo siempre al centro.',
      'Ahora diga una dirección sin guiar la mano y deje que el niño la busque.',
      'Hagan 8 órdenes en desorden. Celebren cada acierto.',
    ],
    mano: 'Después de cada movimiento, vuelvan al centro. Ese regreso es tan importante como el movimiento.',
    consejo: 'Si duda entre izquierda y derecha, recuérdele la cinta de la unidad anterior.',
    competencia:
      'Se orienta en el plano a partir de un centro: arriba, abajo, izquierda, derecha.',
    resultado: 'Ejecuta correctamente 6 de 8 órdenes de dirección.',
    criterio: 'Observe si regresa al centro sin que se le pida.',
    actividad: { tipo: 'direcciones' },
  },
  {
    id: 'm1u8',
    modulo: 'm1',
    etapa: 2,
    titulo: 'El punto de partida',
    duracion: '15 min',
    objetivo:
      'Que el niño use el punto doble de la esquina como lugar de salida y regreso cada vez que explora una lámina.',
    materiales: ['Lámina 8 en relieve (punto doble y 4 puntos)'],
    pasos: [
      'Muéstrele el punto doble de la esquina de arriba a la izquierda. Diga: "Esta es tu casa. Siempre salimos de aquí".',
      'Desde la casa, salgan a buscar cualquier punto de la hoja.',
      'Cuando lo encuentre, diga: "¡Ahora volvamos a casa!" y regresen al punto doble.',
      'Repitan hasta visitar los 4 puntos, volviendo a casa cada vez.',
      'Al final pregúntele: "¿Dónde está tu casa?" y deje que la encuentre solo.',
    ],
    mano: 'Al volver a casa, deje que el niño deslice el dedo por la hoja. No levante su mano: el camino de regreso también se siente.',
    consejo:
      'Este punto de partida va a aparecer en todas las láminas siguientes. Vale la pena repetirlo varias veces.',
    competencia: 'Usa un punto de referencia para iniciar y finalizar la exploración.',
    resultado: 'Regresa al punto de partida de forma autónoma en 3 de 4 recorridos.',
    criterio: 'Observe si busca el punto doble al iniciar sin que se lo indiquen.',
    actividad: { tipo: 'referencia' },
  },
  {
    id: 'm1u9',
    modulo: 'm1',
    etapa: 3,
    titulo: 'Líneas rectas, inclinadas y curvas',
    duracion: '20 min',
    objetivo:
      'Que el niño siga líneas de puntos en distintas direcciones y note cuando una línea cambia de rumbo poco a poco (curva).',
    materiales: ['Láminas 9A a 9D en relieve (4 líneas)', 'Un cordón o lana'],
    pasos: [
      'Con el cordón estirado sobre la mesa, deje que el niño lo recorra: "Esta línea es recta".',
      'Doble el cordón en forma de arco: "Esta línea se curva, va cambiando de camino".',
      'En la lámina, recorran la línea acostada (horizontal), desde el punto doble.',
      'Sigan con la línea parada (vertical), la inclinada (diagonal) y por último la curva.',
      'En la curva, pregunte: "¿Sientes que el camino va subiendo y luego bajando?".',
    ],
    mano: 'En la curva, acompañe solo con dos dedos sobre la muñeca. El niño debe sentir el cambio de dirección, no que usted lo lleve.',
    consejo:
      'Si una línea se le hace difícil, vuelvan al cordón y luego regresen a la lámina.',
    competencia: 'Reconoce líneas abiertas rectas, diagonales y curvas.',
    resultado: 'Recorre las 4 líneas y distingue la curva de las rectas.',
    criterio: 'Valore la continuidad del trazo y la verbalización del cambio de dirección.',
    actividad: { tipo: 'lineas' },
  },
  {
    id: 'm1u10',
    modulo: 'm1',
    etapa: 4,
    titulo: 'Cerrar la figura: cuadrado y círculo',
    duracion: '20 min',
    objetivo:
      'Que el niño recorra un contorno completo y descubra que al volver al inicio la figura queda cerrada.',
    materiales: [
      'Láminas 10A y 10B en relieve',
      'Un bloque cuadrado y una tapa redonda',
    ],
    pasos: [
      'Den al niño el bloque cuadrado. Recorran juntos su borde: "Tiene esquinas, y al dar la vuelta llegamos al mismo lugar".',
      'En la lámina 10A, empiecen en el punto doble y recorran el cuadrado hasta volver al inicio.',
      'Pregunte: "¿Cuántas esquinas sentiste?". Cuenten juntos: 4.',
      'Ahora la tapa redonda: "Esta no tiene esquinas, es redondita".',
      'En la lámina 10B recorran el círculo hasta cerrarlo. Comparen las dos figuras.',
    ],
    mano: 'Deténganse en cada esquina del cuadrado y diga "¡esquina!". En el círculo, el movimiento es continuo, sin paradas.',
    consejo:
      'Si al niño le cuesta cerrar la figura, pongan un granito de arroz pegado en el punto de inicio para que lo reconozca al volver.',
    competencia:
      'Cierra contornos e identifica figuras geométricas básicas (cuadrado, círculo).',
    resultado:
      'Recorre ambas figuras hasta cerrarlas y nombra cuál tiene esquinas.',
    criterio: 'Observe si reconoce el punto de cierre y si cuenta las esquinas.',
    actividad: { tipo: 'formas' },
  },
];

/* Geometría compartida por la lámina interactiva y la lámina para imprimir (viewBox 600 x 400) */
export const W = 600;
export const H = 400;

export function filaPts(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  n: number
): [number, number][] {
  const a: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    a.push([Math.round(x1 + (x2 - x1) * t), Math.round(y1 + (y2 - y1) * t)]);
  }
  return a;
}

export const GEO = {
  presencia: [0, 1, 2, 3, 4, 5].map((i) => ({
    x: 65 + (i % 3) * 165,
    y: 55 + Math.floor(i / 3) * 160,
    w: 140,
    h: 130,
    punto: [1, 0, 1, 1, 0, 1][i],
  })),
  tamanos: [
    [110, 110, 1],
    [235, 85, 0],
    [360, 130, 1],
    [490, 95, 0],
    [150, 285, 0],
    [280, 305, 1],
    [400, 265, 0],
    [505, 300, 1],
  ] as [number, number, number][],
  camino: filaPts(90, 200, 510, 200, 8),
  laberinto: [
    '#########',
    '#S..#...#',
    '###.#.#.#',
    '#...#.#.#',
    '#.###.#.#',
    '#.....#M#',
    '#########',
  ],
  buscar: [
    [95, 85],
    [235, 65],
    [395, 95],
    [525, 70],
    [160, 190],
    [320, 210],
    [485, 200],
    [95, 320],
    [265, 330],
    [470, 325],
  ] as [number, number][],
  direcciones: {
    c: [300, 200] as [number, number],
    o: {
      arriba: [300, 65] as [number, number],
      abajo: [300, 335] as [number, number],
      izquierda: [110, 200] as [number, number],
      derecha: [490, 200] as [number, number],
    },
  },
  referencia: {
    casa: [75, 75] as [number, number],
    pts: [
      [260, 130],
      [470, 95],
      [400, 300],
      [170, 300],
    ] as [number, number][],
  },
  lineas: {
    horizontal: { nombre: 'Acostada', pts: filaPts(90, 200, 510, 200, 8) },
    vertical: { nombre: 'Parada', pts: filaPts(300, 55, 300, 345, 6) },
    diagonal: { nombre: 'Inclinada', pts: filaPts(120, 330, 480, 70, 7) },
    curva: {
      nombre: 'Curva',
      pts: Array.from({ length: 9 }, (_, i) => {
        const t = i / 8;
        return [
          Math.round(90 + 420 * t),
          Math.round(310 - 220 * Math.sin(Math.PI * t)),
        ] as [number, number];
      }),
    },
  } as Record<string, { nombre: string; cerrada?: boolean; pts: [number, number][] }>,
  formas: {
    cuadrado: {
      nombre: 'Cuadrado',
      cerrada: true,
      pts: (() => {
        const a: number[][] = [];
        const x0 = 190;
        const y0 = 80;
        const s = 220;
        const k = 4;
        for (let i = 0; i < k; i++) a.push([x0 + (s * i) / k, y0]);
        for (let i = 0; i < k; i++) a.push([x0 + s, y0 + (s * i) / k]);
        for (let i = 0; i < k; i++) a.push([x0 + s - (s * i) / k, y0 + s]);
        for (let i = 0; i < k; i++) a.push([x0, y0 + s - (s * i) / k]);
        return a.map((p) => p.map(Math.round) as [number, number]);
      })(),
    },
    circulo: {
      nombre: 'Círculo',
      cerrada: true,
      pts: Array.from({ length: 14 }, (_, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 14;
        return [
          Math.round(300 + 125 * Math.cos(a)),
          Math.round(195 + 125 * Math.sin(a)),
        ] as [number, number];
      }),
    },
  } as Record<string, { nombre: string; cerrada?: boolean; pts: [number, number][] }>,
  cuerpo: {
    cabeza: [300, 72, 'La cabeza está ARRIBA.'],
    centro: [
      300,
      180,
      'Aquí, en la barriga, está tu CENTRO. Desde aquí empieza todo.',
    ],
    manoIzq: [160, 238, 'Esta es tu mano IZQUIERDA.'],
    manoDer: [440, 238, 'Esta es tu mano DERECHA.'],
    pies: [300, 360, 'Los pies están ABAJO.'],
  } as Record<string, [number, number, string]>,
};

export const NUMS = [
  '',
  'uno',
  'dos',
  'tres',
  'cuatro',
  'cinco',
  'seis',
  'siete',
  'ocho',
  'nueve',
  'diez',
];

const CAMPOS: (keyof UnitDef)[] = [
  'titulo',
  'objetivo',
  'duracion',
  'materiales',
  'pasos',
  'mano',
  'consejo',
  'competencia',
  'resultado',
  'criterio',
  'oculta',
  'etapa',
];

export function aplicar(b: UnitDef, ov?: Partial<UnitDef>): UnitDef {
  if (!ov) return b;
  const o: UnitDef = { ...b };
  CAMPOS.forEach((k) => {
    if (ov[k] !== undefined) {
      (o as unknown as Record<string, unknown>)[k] = ov[k];
    }
  });
  o.editada = true;
  return o;
}

export function unidadesDe(
  mid: 'm1' | 'm2' | 'm3',
  contenido: Record<string, Partial<UnitDef>>,
  todas = false
): UnitDef[] {
  const base = BASE.filter((b) => b.modulo === mid).map((b, i) => ({
    ...aplicar(b, contenido[b.id]),
    orden: i + 1,
    base: true,
  }));
  const cus = Object.entries(contenido)
    .filter(([, c]) => c && c.custom && c.modulo === mid)
    .map(([id, c]) => ({
      ...(c as UnitDef),
      id,
      orden: typeof c.orden === 'number' ? c.orden : 100,
      actividad: c.actividad || { tipo: 'ninguna' as const },
      materiales: c.materiales || [],
      pasos: c.pasos || [],
    }));
  const a = [...base, ...cus].sort((x, y) => (x.orden || 0) - (y.orden || 0));
  return todas ? a : a.filter((u) => !u.oculta);
}

export function secuencia(contenido: Record<string, Partial<UnitDef>>): UnitDef[] {
  return MODULOS.flatMap((m) => unidadesDe(m.id, contenido));
}

export function unidad(
  id: string,
  contenido: Record<string, Partial<UnitDef>>
): UnitDef | undefined {
  return MODULOS.flatMap((m) => unidadesDe(m.id, contenido, true)).find(
    (u) => u.id === id
  );
}

export function abierta(
  u: UnitDef,
  rol: RolUsuario,
  done: Record<string, DoneRecord>,
  contenido: Record<string, Partial<UnitDef>>
): boolean {
  if (rol === 'docente') return true;
  const s = secuencia(contenido);
  const i = s.findIndex((x) => x.id === u.id);
  return i >= 0 && s.slice(0, i).every((x) => !!done[x.id]);
}

export function pendiente(
  done: Record<string, DoneRecord>,
  contenido: Record<string, Partial<UnitDef>>
): UnitDef | undefined {
  return secuencia(contenido).find((x) => !done[x.id]);
}

export function anteriorDe(
  u: UnitDef,
  contenido: Record<string, Partial<UnitDef>>
): UnitDef | null {
  const s = secuencia(contenido);
  const i = s.findIndex((x) => x.id === u.id);
  return i > 0 ? s[i - 1] : null;
}

export function siguienteDe(
  u: UnitDef,
  contenido: Record<string, Partial<UnitDef>>
): UnitDef | null {
  const s = secuencia(contenido);
  const i = s.findIndex((x) => x.id === u.id);
  return i >= 0 && i + 1 < s.length ? s[i + 1] : null;
}

export function numEnModulo(
  u: UnitDef,
  contenido: Record<string, Partial<UnitDef>>
): { i: number; n: number } {
  const l = unidadesDe(u.modulo, contenido);
  return { i: l.findIndex((x) => x.id === u.id) + 1, n: l.length };
}

export function avanceMod(
  mid: 'm1' | 'm2' | 'm3',
  done: Record<string, DoneRecord>,
  contenido: Record<string, Partial<UnitDef>>
): { h: number; n: number; p: number } {
  const l = unidadesDe(mid, contenido);
  const h = l.filter((u) => !!done[u.id]).length;
  return { h, n: l.length, p: l.length ? Math.round((h * 100) / l.length) : 0 };
}
