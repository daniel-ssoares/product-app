import assert from 'node:assert/strict';

const base = process.env.API_URL ?? 'http://localhost:5127/api/products';
const input = { name: '  Item de teste  ', description: 'Teste de integração', category: 'Escritório', price: 12.5, stock: 2 };
const send = (method, path = '', body) => fetch(base + path, {
  method, headers: { 'Content-Type': 'application/json' },
  body: body === undefined ? undefined : JSON.stringify(body)
});
let id;
try {
  const list = await send('GET');
  assert.equal(list.status, 200);
  assert.ok(Array.isArray(await list.json()));
  const created = await send('POST', '', { ...input, id: 999999, createdAt: '2000-01-01T00:00:00Z' });
  assert.equal(created.status, 201);
  const product = await created.json();
  id = product.id;
  assert.notEqual(id, 999999);
  assert.notEqual(product.createdAt, '2000-01-01T00:00:00Z');
  assert.equal(product.name, 'Item de teste');
  assert.ok(created.headers.get('location').endsWith('/' + id));
  const updated = await send('PUT', '/' + id, { ...input, category: 'Periféricos', stock: 0 });
  assert.equal(updated.status, 200);
  const result = await updated.json();
  assert.equal(result.category, 'Periféricos');
  assert.equal(result.stock, 0);
  assert.equal(result.createdAt, product.createdAt);
  for (const invalid of [
    { name: '   ' }, { description: '' }, { category: 'Jogos' },
    { price: 0 }, { price: null }, { stock: -1 }, { stock: 1.5 }, { stock: null }
  ]) {
    const response = await send('POST', '', { ...input, ...invalid });
    assert.equal(response.status, 400, JSON.stringify(invalid));
    assert.ok((await response.json()).errors);
  }
  assert.equal((await send('DELETE', '/' + id)).status, 204);
  const missing = await send('GET', '/' + id);
  assert.equal(missing.status, 404);
  assert.equal((await missing.json()).status, 404);
  assert.equal((await send('PUT', '/' + id, input)).status, 404);
  assert.equal((await send('DELETE', '/' + id)).status, 404);
  id = undefined;
  console.log('OK: CRUD, validações, categorias, campos do servidor e respostas 404.');
} finally {
  if (id !== undefined) await send('DELETE', '/' + id);
}
