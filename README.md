# Nexora Frontend Angular

Frontend académico basado en el patrón trabajado en clase con AutoManager:

- Angular standalone components.
- `FormsModule` / `ngModel`.
- `HttpClient` + `Observable` + `subscribe`.
- Rutas con `app.routes.ts`.
- Bootstrap 5.
- `@if` y `@for` en plantillas.
- Sesión de Spring Security mediante `JSESSIONID` y `withCredentials: true`.

## Roles

- ADMIN: dashboard, productos, usuarios y ventas.
- VENDEDOR: dashboard, nueva venta y mis ventas.
- CLIENTE: inicio, catálogo y mis compras.

No se incluyen pantallas separadas para Estado o Tipo. Se consumen como catálogos internos donde son necesarios.

## Ejecutar

1. Levantar Spring Boot en `http://localhost:8080`.
2. Verificar CORS con `http://localhost:4200` y `allowCredentials(true)`.
3. Ejecutar `npm install`.
4. Ejecutar `npm start`.
5. Abrir `http://localhost:4200`.
