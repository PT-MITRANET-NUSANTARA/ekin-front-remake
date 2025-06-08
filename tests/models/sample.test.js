import { test, expect } from 'vitest';

function sum(a, b) {
    return a + b;
}

test('Menambahkan 1 + 2 harus sama dengan 3', () => {
    expect(sum(1, 2)).toBe(3);
});

test('Menambahkan 5 + 7 harus sama dengan 12', () => {
    expect(sum(5, 7)).toBe(12);
});