import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const failures = [];
const allFiles = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full); else allFiles.push(full);
  }
}
walk(join(root, 'src/app'));

const tsFiles = allFiles.filter(f => f.endsWith('.ts'));
for (const file of tsFiles) {
  const text = readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const diagnostics = sf.parseDiagnostics ?? [];
  for (const d of diagnostics) failures.push(`${file}: error de sintaxis TS ${d.code}: ${ts.flattenDiagnosticMessageText(d.messageText, ' ')}`);
}

const htmlFiles = allFiles.filter(f => f.endsWith('.html'));
for (const file of htmlFiles) {
  const text = readFileSync(file, 'utf8');
  if (/<select\b/i.test(text)) failures.push(`${file}: persiste un <select>; debe usar lookup modal.`);
  if (/nx-dialog-backdrop[^>]*\(click\)/i.test(text)) failures.push(`${file}: el backdrop de diálogo aún cierra por clic.`);
  if (/autofocus/i.test(text)) failures.push(`${file}: no se permite autofocus.`);
}

const requiredLookups = [
  'src/app/pages/admin/usuarios/usuarios.html',
  'src/app/pages/admin/productos/productos.html',
  'src/app/pages/vendedor/nueva-venta/nueva-venta.html'
];
for (const rel of requiredLookups) {
  const text = readFileSync(join(root, rel), 'utf8');
  if (!text.includes('<app-lookup-modal')) failures.push(`${rel}: falta el selector modal reutilizable.`);
}

const sprite = readFileSync(join(root, 'public/icons.svg'), 'utf8');
const iconIds = new Set([...sprite.matchAll(/symbol id="([^"]+)"/g)].map(m => m[1]));
for (const file of htmlFiles) {
  const text = readFileSync(file, 'utf8');
  for (const match of text.matchAll(/href="\/icons\.svg#([^"{]+)"/g)) {
    if (!iconIds.has(match[1])) failures.push(`${file}: icono inexistente #${match[1]}`);
  }
}

const source = tsFiles.map(f => readFileSync(f, 'utf8')).join('\n');
if (/\bwindow\.(alert|confirm|prompt)\s*\(/.test(source)) failures.push('Se encontró un diálogo nativo window.alert/confirm/prompt.');
if (/(^|[^.\w])(alert|prompt)\s*\(/m.test(source)) failures.push('Se encontró alert/prompt nativo.');

const productUtil = readFileSync(join(root, 'src/app/utils/product-image.ts'), 'utf8');
if (!productUtil.includes("generic: '/images/product-placeholder.svg'")) failures.push('Falta fallback local de imagen de producto.');
if (!readFileSync(join(root, 'public/images/product-placeholder.svg'), 'utf8').includes('<svg')) failures.push('Fallback SVG de producto inválido.');

if (failures.length) {
  console.error('Validación UI V3 falló:');
  failures.forEach(f => console.error(`- ${f}`));
  process.exit(1);
}
console.log(`Validación UI V3: OK (${tsFiles.length} TS, ${htmlFiles.length} HTML, ${iconIds.size} iconos).`);
