import { describe, expect, it } from 'vitest';
import { filterLookupItems, LookupItem } from './lookup-modal';

const items: LookupItem[] = [
  { id: 1, title: 'Carlos Perez', subtitle: 'DNI 12345678', detail: 'carlos@nexora.com', icon: 'user' },
  { id: 2, title: 'Ana Torres', subtitle: 'DNI 87654321', detail: 'ana@nexora.com', icon: 'user' }
];

describe('filterLookupItems', () => {
  it('devuelve todos los registros cuando no hay texto de búsqueda', () => {
    expect(filterLookupItems(items, '')).toHaveLength(2);
  });

  it('filtra en tiempo real por nombre, DNI o detalle secundario', () => {
    expect(filterLookupItems(items, '87654321').map(item => item.id)).toEqual([2]);
    expect(filterLookupItems(items, 'carlos@nexora').map(item => item.id)).toEqual([1]);
  });

  it('ignora mayúsculas y espacios externos', () => {
    expect(filterLookupItems(items, '  ANA  ').map(item => item.id)).toEqual([2]);
  });
});
