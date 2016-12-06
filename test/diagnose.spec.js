/* eslint-env mocha */
'use strict'

const expect = require('chai').expect

const cbor = require('../')
const cases = require('./fixtures/cases')

function testAll (list) {
  list.forEach(c => {
    expect(
      cbor.diagnose(cases.toBuffer(c))
    ).to.be.eql(
      c[1]
    )
  })
}

function failAll (list) {
  list.forEach(c => {
    expect(
      () => cbor.diagnose(cases.toBuffer(c))
    ).to.throw
  })
}

describe('Diagnose', () => {
  it('diagnose', () => testAll(cases.good))
  it('decode', () => testAll(cases.decodeGood))
  it('edges', () => failAll(cases.decodeBad))
})

// test.cb('construct', t => {
//   const d = new cbor.Diagnose()
//   t.is(d.stream_errors, false)
//   d.stream_errors = true
//   const bs = new NoFilter()
//   d.pipe(bs)
//   d.on('end', function () {
//     t.is(bs.toString('utf8'), 'Error: unexpected end of input')
//     t.end()
//   })
//   d.end(new Buffer([0x18]))
// })

// test.cb('stream', t => {
//   const dt = new cbor.Diagnose({
//     separator: '-'
//   })
//   const bs = new NoFilter()

//   dt.on('end', function () {
//     t.is(bs.toString('utf8'), '1-')
//     t.end()
//   })
//   dt.on('error', function (er) {
//     t.ifError(er)
//   })
//   dt.pipe(bs)
//   dt.end(new Buffer('01', 'hex'))
// })

// test.cb('inputs', t => {
//   t.throws(() => {
//     cbor.diagnose()
//   })
//   cbor.diagnose('01', (er, d) => {
//     t.ifError(er)
//     t.truthy(d)
//     cbor.diagnose('AQ==', {encoding: 'base64'})
//       .then((d) => {
//         t.truthy(d)
//         cbor.diagnose('AQ==', {encoding: 'base64'}, (er, d) => {
//           t.ifError(er)
//           t.truthy(d)
//           t.end()
//         })
//       })
//   })
// })
