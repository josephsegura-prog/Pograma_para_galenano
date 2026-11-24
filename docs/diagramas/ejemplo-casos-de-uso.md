# Diagramas del proyecto (Mermaid)

## Caso de uso del Taller

Los docentes realizan dos acciones relacionadas dentro del Taller: exportar la lámina y validar la separación entre puntos.

```mermaid
flowchart TD
    Docente([Docente])
    Taller[Editor Taller]
    Lienzo[(Lienzo A4)]
    Exportar{RF-01: Descargar SVG}
    Validar{RF-02: Validar distancia}
    SVG[[Archivo SVG 210 x 297 mm]]
    Advertencia[[Advertencia de puntos menores a 2.5 mm]]

    Docente --> Taller
    Taller --> Lienzo
    Lienzo --> Exportar
    Exportar --> SVG
    Lienzo --> Validar
    Validar -->|Distancia menor a 2.5 mm| Advertencia
    Advertencia -->|Mover o separar puntos| Validar
    Validar -->|Todos cumplen RNF-01| Lienzo
```

## Trazabilidad

- [RF-01](../requisitos/funcionales.md) y [RNF-02](../requisitos/no-funcionales.md) corresponden a la historia [#6](https://github.com/josephsegura-prog/Pograma_para_galenano/issues/6).
- [RF-02](../requisitos/funcionales.md), [RNF-01](../requisitos/no-funcionales.md) y [RNF-03](../requisitos/no-funcionales.md) corresponden a la historia [#7](https://github.com/josephsegura-prog/Pograma_para_galenano/issues/7).
