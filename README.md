# Nexora Frontend

Frontend Angular para el backend **Nexora**. La interfaz fue construida a partir del contrato real del proyecto Spring Boot y conserva un enfoque de código sencillo, modular y mantenible.

## Tecnologías

- Angular 21.2 (Standalone Components)
- TypeScript 5.9
- Bootstrap 5.3.8
- RxJS 7.8
- Formularios reactivos
- Sesión de Spring Security mediante cookie (`withCredentials`)

No utiliza JWT, Angular Material, PrimeNG, Chart.js ni diálogos nativos del navegador (`alert`, `confirm`, `prompt`).

La interfaz incluye un sistema de iconos SVG propio, tablas con contornos reforzados, componentes visuales responsive y modales personalizados, sin añadir nuevas dependencias de UI.

## Requisitos

- Node.js 22 o compatible con Angular 21
- npm
- Backend Nexora iniciado en `http://localhost:8080`
- MySQL y datos del backend configurados correctamente

## Ejecutar

```bash
npm install
npm start
```

Abrir:

```text
http://localhost:4200
```

## Compilar

```bash
npm run build
```

## Rutas principales

### Público
- `/` Landing page Nexora
- `/login` Inicio de sesión

### ADMIN
- `/app/admin/dashboard`
- `/app/admin/usuarios`
- `/app/admin/productos`
- `/app/admin/catalogos`
- `/app/admin/ventas`

### VENDEDOR
- `/app/vendedor/dashboard`
- `/app/vendedor/nueva-venta`
- `/app/vendedor/mis-ventas`

### CLIENTE
- `/app/cliente/dashboard`
- `/app/cliente/productos`
- `/app/cliente/mis-compras`

## Seguridad

El backend usa sesión de Spring Security. Todas las solicitudes HTTP del frontend se envían con credenciales mediante un interceptor. Los guards validan sesión y rol antes de permitir el acceso a cada panel.

Las validaciones del frontend son una primera barrera de experiencia de usuario. El backend conserva la validación final y sus mensajes de error se presentan dentro del sistema de modales de Nexora.

## Contrato de venta

El vendedor envía exactamente:

```json
{
  "idUsuario": 3,
  "detalles": [
    {
      "idProducto": 1,
      "cantidad": 2
    }
  ]
}
```

El frontend **no envía precio ni total**. Nexora toma el precio vigente desde la base de datos, valida el stock y calcula el total en el backend.

## Validaciones principales

### Usuario
- DNI: obligatorio, 8 dígitos
- Nombre: obligatorio, máximo 25 caracteres
- Apellido paterno: obligatorio, máximo 25 caracteres
- Apellido materno: obligatorio, máximo 25 caracteres
- Correo: obligatorio, formato válido, máximo 45 caracteres
- Contraseña: obligatoria al crear; opcional al editar
- Fecha de nacimiento: obligatoria y no futura
- Tipo: obligatorio
- Estado: obligatorio

### Producto
- Descripción: obligatoria, máximo 45 caracteres
- Stock: entero mayor o igual a 0
- Precio: mayor que 0
- Marca: obligatoria
- Estado: obligatorio

### Venta
- Cliente activo obligatorio
- Al menos un producto
- Producto activo y con stock
- Cantidad entera mayor que 0
- La suma solicitada no puede superar el stock mostrado
- El backend vuelve a validar toda la operación antes de guardarla

## Nota sobre el backend entregado

Para iniciar sesión, las contraseñas almacenadas en `tb_usuarios.usu_clave` deben estar codificadas con BCrypt, porque `CustomUserDetailsService` y `BCryptPasswordEncoder` trabajan con ese formato.

También debe existir el tipo `Vendedor` y un usuario activo con ese tipo para probar el panel de ventas. El script base entregado contiene inicialmente Administrador y Cliente, por lo que esta preparación depende de los datos cargados en la base de datos.

## Selectores modales y teclado

Los campos relacionados que podrían crecer a cientos o miles de registros (cliente, producto, marca, estado y tipo) no utilizan un `<select>` tradicional. Nexora abre un selector modal con búsqueda en tiempo real y permite elegir el registro con un clic; el formulario recibe automáticamente el identificador y muestra los datos seleccionados.

Los modales bloquean la interacción con el contenido del fondo y mantienen el foco dentro de la ventana cuando el usuario navega con `Tab`/`Shift+Tab`, sin aplicar autofocus al abrir.

- `Esc` en una caja con texto: limpia el texto.
- Segundo `Esc` sobre la caja vacía: retira el foco.
- Siguiente `Esc`: cierra el modal.
- `Esc` sin una caja enfocada: cierra el modal directamente.
- `Enter` envía los formularios modales únicamente cuando sus validaciones están completas.

## Imágenes de productos

El backend actual no expone una propiedad de imagen. Por ello, las imágenes de referencia se resuelven solo en la capa visual mediante `src/app/utils/product-image.ts`. Puedes reemplazar las URL de `PRODUCT_REFERENCE_IMAGES` por las imágenes definitivas sin cambiar el contrato del backend. Si una URL externa falla, se usa automáticamente `public/images/product-placeholder.svg`.

## Verificación local

Después de instalar dependencias puedes ejecutar:

```bash
npm run verify:source
npm run verify:ui
npm run build
```

## Arquitectura de acceso Nexora

El frontend separa la experiencia pública/Cliente del Back Office interno:

- `/` Landing pública orientada al cliente.
- `/registro` Registro público de Cliente.
- `/login` Acceso al Portal Cliente.
- `/cliente/*` Portal del Cliente con navegación horizontal.
- `/backoffice/login` Acceso interno para Administrador y Vendedor.
- `/app/admin/*` Back Office Administrador.
- `/app/vendedor/*` Back Office Vendedor.

El registro público consume `POST /api/auth/registro-cliente`. El backend asigna el Tipo Cliente y Estado Activo; Angular no envía roles ni estados durante el registro.

Las notificaciones de éxito, error, advertencia e información se muestran como toasts. Las confirmaciones destructivas continúan usando modal de confirmación.
