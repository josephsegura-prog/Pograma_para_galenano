# Requisitos funcionales

| Código | Descripción | Prioridad | Historia relacionada |
|--------|-------------|-----------|----------------------|
| RF-01 | El Taller debe permitir descargar la composición actual del lienzo A4 como archivo SVG estandarizado, incluyendo el triángulo de orientación y todos los elementos visibles. | Media | [#6](https://github.com/josephsegura-prog/Pograma_para_galenano/issues/6) |
| RF-02 | El editor debe identificar cada par de puntos cuya distancia física sea menor a 2.5 mm y mostrar una advertencia asociada a ambos puntos. | Alta | [#7](https://github.com/josephsegura-prog/Pograma_para_galenano/issues/7), [#9](https://github.com/josephsegura-prog/Pograma_para_galenano/issues/9), [#10](https://github.com/josephsegura-prog/Pograma_para_galenano/issues/10) |
| RF-03 | El lienzo del Taller debe permitir ajustar automáticamente puntos y celdillas Braille a una retícula activa de 5 mm. | Media | [#11](https://github.com/josephsegura-prog/Pograma_para_galenano/issues/11) |

## Criterios de trazabilidad

- El lienzo exportable se representa en formato A4 de `210 x 297 mm`.
- Los elementos exportados por RF-01 deben usar las mismas coordenadas físicas que aplica RF-02 para validar distancias.
- Las historias técnicas #9 y #10 son implementaciones específicas de RF-02 y deben verificar las reglas de RNF-01 y RNF-03.
- La retícula de RF-03 se mide en coordenadas físicas y debe producir posiciones múltiples exactas de 5 mm.
- Cuando una historia cambie su comportamiento o diseño, deben actualizarse a la vez el requisito relacionado, la documentación y el diagrama de casos de uso.
