/* eslint-env mocha */
'use strict'

const expect = require('chai').expect

const cbor = require('../')
const cases = require('./fixtures/cases')

function testAll (list) {
  list.forEach(c => {
    expect(
      '\n' + cbor.comment(cases.toBuffer(c))
    ).to.be.eql(
      c[2] + '\n'
    )
  })
}

function failAll (list) {
  list.forEach(c => {
    expect(
      () => cbor.comment(cases.toBuffer(c))
    ).to.throw
  })
}

describe('Commented', () => {
  it.only('good', () => testAll(cases.good))
  it('encode', () => testAll(cases.encodeGood))
  it('decode', () => failAll(cases.decodeGood))
  it('fail', () => failAll(cases.decodeBad))
})
