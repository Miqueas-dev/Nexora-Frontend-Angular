import { describe, expect, it } from 'vitest';
import { toDateInputValue } from './date-input';

describe('toDateInputValue', () => {
  it('conserva una fecha SQL yyyy-MM-dd', () => {
    expect(toDateInputValue('1994-09-29')).toBe('1994-09-29');
  });

  it('extrae la fecha de una fecha ISO con hora', () => {
    expect(toDateInputValue('1994-09-29T00:00:00.000Z')).toBe('1994-09-29');
  });

  it('normaliza una fecha dd/MM/yyyy', () => {
    expect(toDateInputValue('29/09/1994')).toBe('1994-09-29');
  });

  it('devuelve vacío para valores no utilizables', () => {
    expect(toDateInputValue('')).toBe('');
    expect(toDateInputValue(undefined)).toBe('');
  });
});
