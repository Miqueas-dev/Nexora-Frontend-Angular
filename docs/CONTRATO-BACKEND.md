# Contrato backend usado por Nexora Frontend

Base: `http://localhost:8080/api`

## Autenticación
- `POST /auth/login` → público
- `GET /auth/me` → autenticado
- `POST /auth/logout` → autenticado

## Productos
- `GET /productos` → ADMIN, VENDEDOR, CLIENTE
- `POST /productos` → ADMIN
- `PUT /productos/{id}` → ADMIN
- `DELETE /productos/{id}` → ADMIN

## Usuarios
- `GET /usuarios` → ADMIN
- `GET /usuarios/clientes` → ADMIN, VENDEDOR
- `POST /usuarios` → ADMIN
- `PUT /usuarios/{id}` → ADMIN
- `DELETE /usuarios/{id}` → ADMIN

## Catálogos
- `GET /marcas`, `/estados`, `/tipos` → autenticados
- altas, cambios y eliminaciones → ADMIN

## Comprobantes
- `POST /comprobantes` → VENDEDOR
- `GET /comprobantes` → ADMIN
- `GET /comprobantes/{id}` → ADMIN
- `GET /comprobantes/vendedor/mias` → VENDEDOR
- `GET /comprobantes/mios` → CLIENTE

No existe endpoint público de autorregistro ni endpoint de compra directa para CLIENTE en el backend analizado; por esa razón el frontend no simula esas operaciones.

## Registro público de Cliente

### POST `/api/auth/registro-cliente`
Endpoint público para creación de cuentas Cliente.

Angular envía únicamente:

```json
{
  "dniUsuario": "70000010",
  "nombreUsuario": "Luis",
  "apepatUsuario": "Perez",
  "apematUsuario": "Lopez",
  "correoUsuario": "luis@nexora.com",
  "claveUsuario": "cliente123",
  "fecnacUsuario": "2000-05-15"
}
```

El backend asigna automáticamente Tipo `Cliente` y Estado `Activo` y cifra la contraseña con BCrypt. El frontend no debe enviar ni permitir seleccionar rol o estado en este flujo.

## Separación de experiencias

- Cliente: `/login` + `/cliente/*`.
- Personal interno: `/backoffice/login` + `/app/admin/*` o `/app/vendedor/*`.
- El endpoint de autenticación sigue siendo `POST /api/auth/login`; Angular valida que el rol corresponda al portal desde el que se intenta acceder.
