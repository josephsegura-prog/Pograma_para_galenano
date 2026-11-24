# Proyecto Braille

Proyecto para enseñar Braille a niños ("desarrollado con metodología **Scrum** y tablero **Kanban**") en GitHub Projects.

## Equipo
| Rol | Integrante |
|-----|-----------|
| Product Owner | _pendiente_ |
| Scrum Master | _pendiente_ |
| Equipo de desarrollo | _pendiente_ |

## Cómo está organizado el repo
- `docs/investigacion/`: lo que vamos investigando sobre Braille y su enseñanza.
- `docs/requisitos/`: requisitos funcionales y no funcionales.
- `docs/actas/`: actas de cada ceremonia (planning, review, retrospectiva).
- `docs/diagramas/`: diagramas en código (Mermaid), versionados junto al proyecto.
- `docs/definition-of-done.md`: nuestro DoD.
- `.github/ISSUE_TEMPLATE/`: plantillas para épicas, historias de usuario e historias técnicas.

## Cómo trabajamos
1. Todo requerimiento se registra como **Issue** (épica, historia de usuario o historia técnica).
2. Los Issues viven en el tablero de GitHub Projects (Backlog, Sprint Backlog, En progreso, En revisión, Hecho).
3. Cada ceremonia deja un acta en `docs/actas/`.
4. Si un cambio altera el diseño original, se actualizan los diagramas y la documentación en el mismo Pull Request.
5. Un Issue solo pasa a Hecho si cumple el [DoD](docs/definition-of-done.md).

## Trazabilidad del Taller

Las historias funcionales del Taller deben mantener referencias explícitas a los requisitos que implementan:

| Historia | Requisito funcional | Requisitos no funcionales | Resultado documentado |
|----------|---------------------|----------------------------|-----------------------|
| [#6 Exportar lámina A4 a SVG](https://github.com/josephsegura-prog/Pograma_para_galenano/issues/6) | [RF-01](docs/requisitos/funcionales.md) | RNF-02 | Generación vectorial estándar de la composición actual |
| [#7 Validar distancia mínima](https://github.com/josephsegura-prog/Pograma_para_galenano/issues/7) | [RF-02](docs/requisitos/funcionales.md) | RNF-01 y RNF-03 | Advertencia de pares de puntos menores a 2.5 mm |
| [#9 Integrar cálculo euclidiano](https://github.com/josephsegura-prog/Pograma_para_galenano/issues/9) | [RF-02](docs/requisitos/funcionales.md) | RNF-01, RNF-03 y RNF-04 | Servicio de separación física activado tras interacciones y arrastres |
| [#10 Conectar validación con TallerView](https://github.com/josephsegura-prog/Pograma_para_galenano/issues/10) | [RF-02](docs/requisitos/funcionales.md) | RNF-01, RNF-03 y RNF-04 | Clase visual y tooltip exacto en los puntos conflictivos |
| [#11 Implementar snap-to-grid](https://github.com/josephsegura-prog/Pograma_para_galenano/issues/11) | [RF-03](docs/requisitos/funcionales.md) | RNF-05 | Ajuste automático de puntos y celdillas a una retícula de 5 mm |

Las decisiones de diseño del Taller deben representarse en [los diagramas](docs/diagramas/ejemplo-casos-de-uso.md) y verificarse contra el [DoD](docs/definition-of-done.md).
