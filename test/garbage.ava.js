'use strict'

const test = require('ava')
const cbor = require('../src/cbor')
const garbage = require('garbage')

const REPEATS = parseInt(process.env['NODE_CBOR_GARBAGE'] || 10000)
test('garbage', t => {
  if (process.env.NO_GARBAGE) {
    return
  }
  t.plan(REPEATS)
  const inp = []
  for (let i = 0; i < REPEATS; i++) {
    inp.push(garbage(100))
  }
  return Promise.all(inp.map(g => {
    const c = cbor.encode(g)
    return cbor.decodeFirst(c)
      .then(val => t.deepEqual(val, g))
  }))
})
