# Requisitos funcionales

| Código | Descripción | Prioridad | Historia relacionada |
|--------|-------------|-----------|----------------------|
| RF-01 | El Taller debe permitir descargar la composición actual del lienzo A4 como archivo SVG estandarizado, incluyendo el triángulo de orientación y todos los elementos visibles. | Media | [#6](https://github.com/josephsegura-prog/Pograma_para_galenano/issues/6) |
| RF-02 | El editor debe identificar cada par de puntos cuya distancia física sea menor a 2.5 mm y mostrar una advertencia asociada a ambos puntos. | Alta | [#7](https://github.com/josephsegura-prog/Pograma_para_galenano/issues/7) |

## Criterios de trazabilidad

- El lienzo exportable se representa en formato A4 de `210 x 297 mm`.
- Los elementos exportados por RF-01 deben usar las mismas coordenadas físicas que aplica RF-02 para validar distancias.
- Cuando una historia cambie su comportamiento o diseño, deben actualizarse a la vez el requisito relacionado, la documentación y el diagrama de casos de uso.
