# Validación de Nexora Frontend V4

Esta versión parte de la última base estable de Nexora Frontend y conserva los contratos con el backend Spring Security por sesión.

## Verificaciones ejecutadas en el entorno de generación

- `npm run verify:source`: correcto.
- `npm run verify:ui`: correcto.
- Sintaxis TypeScript: 47 archivos, 0 errores de parseo.
- Estructura HTML: 18 plantillas, 0 problemas de anidación detectados.
- Balance CSS: correcto.
- Normalización de fecha para `input[type=date]`: 4/4 casos verificados.
- No se muestran instrucciones visuales de Escape/Enter; la funcionalidad permanece activa.
- Paginación: 5 registros para tablas/historiales/catálogos/lookups y 8 productos en catálogo cliente.

## Compilación Angular

Se intentó ejecutar `npm ci`, pero el entorno de generación no pudo resolver `registry.npmjs.org` (`EAI_AGAIN`), por lo que Angular CLI no pudo instalarse aquí y `ng build` no estuvo disponible. No se añadieron dependencias nuevas ni se modificaron las versiones del proyecto.

En un equipo con acceso a npm, ejecutar:

```bash
npm ci
npm run verify:source
npm run verify:ui
npm run build
npm start
```
