import { readFileSync } from 'node:fs';

function source(file) {
  return readFileSync(file, 'utf8');
}

const failures = [];
const orderedDependencies = [
  ['src/app/layout/layout.ts', 'private readonly auth = inject(AuthService);', 'readonly usuario$ = this.auth.usuario$;'],
  ['src/app/shared/modal/modal.ts', 'readonly modal = inject(ModalService);', 'readonly state$ = this.modal.state$;'],
  ['src/app/pages/login/login.ts', 'private readonly fb = inject(FormBuilder);', 'readonly form = this.fb.nonNullable.group'],
  ['src/app/pages/admin/catalogos/catalogos.ts', 'private readonly fb = inject(FormBuilder);', 'readonly form = this.fb.nonNullable.group'],
  ['src/app/pages/admin/productos/productos.ts', 'private readonly fb = inject(FormBuilder);', 'readonly form = this.fb.nonNullable.group'],
  ['src/app/pages/admin/usuarios/usuarios.ts', 'private readonly fb = inject(FormBuilder);', 'readonly form = this.fb.nonNullable.group'],
  ['src/app/pages/vendedor/nueva-venta/nueva-venta.ts', 'private readonly fb = inject(FormBuilder);', 'readonly form = this.fb.nonNullable.group']
];

for (const [file, dependency, initializer] of orderedDependencies) {
  const text = source(file);
  const depIndex = text.indexOf(dependency);
  const initIndex = text.indexOf(initializer);
  if (depIndex < 0 || initIndex < 0 || depIndex > initIndex) {
    failures.push(`${file}: la dependencia debe inicializarse con inject() antes del campo que la utiliza.`);
  }
}

const catalog = source('src/app/pages/admin/catalogos/catalogos.ts');
if (!catalog.includes("this.filas = (data as Marca[]).map")) failures.push('Catalogos: falta el mapeo tipado de Marca[].');
if (!catalog.includes("this.filas = (data as Estado[]).map")) failures.push('Catalogos: falta el mapeo tipado de Estado[].');
if (!catalog.includes("this.filas = (data as Tipo[]).map")) failures.push('Catalogos: falta el mapeo tipado de Tipo[].');
if (/return\s*\{\s*id:\s*item\.idTipo/.test(catalog)) failures.push('Catalogos: persiste el estrechamiento inseguro de la unión.');

if (failures.length) {
  console.error('Validación de inicialización falló:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Validación de inicialización y catálogos: OK');
