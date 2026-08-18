import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const read = file => readFileSync(file, 'utf8');
const failures = [];
const files = [];
const walk = dir => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full); else files.push(full);
  }
};
walk('src/app');

for (const file of files.filter(file => file.endsWith('.html'))) {
  const text = read(file);
  if (/<kbd>|nx-modal-shortcuts|nx-modal-keyboard/.test(text)) failures.push(`${file}: muestra instrucciones visibles de teclado.`);
  if (/\bEsc\b[^<]{0,40}(cerr|limp|desenf)|\bEnter\b[^<]{0,40}(guard|acept|confirm|seleccion)/i.test(text)) failures.push(`${file}: persiste texto de ayuda de Escape/Enter.`);
}

const page5Files = [
  'src/app/pages/admin/usuarios/usuarios.ts',
  'src/app/pages/admin/productos/productos.ts',
  'src/app/pages/admin/ventas/ventas.ts',
  'src/app/pages/vendedor/mis-ventas/mis-ventas.ts',
  'src/app/pages/cliente/mis-compras/mis-compras.ts'
];
for (const file of page5Files) {
  if (!/pageSize\s*=\s*5/.test(read(file))) failures.push(`${file}: la paginación debe ser de 5 registros.`);
}

const catalogTs = read('src/app/pages/admin/catalogos/catalogos.ts');
const catalogHtml = read('src/app/pages/admin/catalogos/catalogos.html');
if (!/pageSize\s*=\s*5/.test(catalogTs) || !catalogTs.includes('filasPagina')) failures.push('Catálogos: falta paginación de 5 registros.');
if (!catalogHtml.includes('<app-pagination')) failures.push('Catálogos: falta el control de paginación.');

const clientProductsTs = read('src/app/pages/cliente/productos/productos.ts');
const clientProductsHtml = read('src/app/pages/cliente/productos/productos.html');
if (!/pageSize\s*=\s*8/.test(clientProductsTs) || !clientProductsTs.includes('productosPagina')) failures.push('Catálogo cliente: falta paginación de 8 productos.');
if (!clientProductsHtml.includes('<app-pagination')) failures.push('Catálogo cliente: falta el control de paginación.');

const lookupTs = read('src/app/shared/lookup-modal/lookup-modal.ts');
const lookupHtml = read('src/app/shared/lookup-modal/lookup-modal.html');
if (!/pageSize\s*=\s*5/.test(lookupTs) || !lookupTs.includes('pagedItems')) failures.push('Lookup modal: falta paginación interna de 5 registros.');
if (!lookupHtml.includes('<app-pagination')) failures.push('Lookup modal: falta el control de paginación.');

const loginHtml = read('src/app/pages/login/login.html');
if (loginHtml.includes('Volver a Nexora')) failures.push('Login: todavía muestra “Volver a Nexora”.');
if (!loginHtml.includes('> Regresar')) failures.push('Login: falta el botón secundario “Regresar”.');

const usersTs = read('src/app/pages/admin/usuarios/usuarios.ts');
if (!usersTs.includes('toDateInputValue(usuario.fecnacUsuario)')) failures.push('Usuarios: la fecha no se normaliza al editar.');

const layout = read('src/app/layout/layout.html');
if (!layout.includes('nx-profile-identity')) failures.push('Sidebar: falta la identidad sin truncado y rol integrado.');

const styles = read('src/styles.css');
for (const marker of [
  'NEXORA · UI REFINEMENT V4',
  '.nx-topbar{justify-content:space-between',
  '.nx-profile-card>div small{white-space:normal',
  'scrollbar-width:none',
  '.nx-login-return',
  '.nx-btn-primary:active'
]) {
  if (!styles.includes(marker)) failures.push(`CSS: falta ajuste V4 requerido (${marker}).`);
}

if (failures.length) {
  console.error('Validación UI V4 falló:');
  failures.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}
console.log('Validación UI V4: OK.');
