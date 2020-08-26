/* eslint-env mocha */
'use strict'

const { expect } = require('aegir/utils/chai')
const uint8ArrayFromString = require('uint8arrays/from-string')

const cbor = require('../')

describe('tagged', () => {
  it('create', () => {
    const tag = new cbor.Tagged(1, 'one')

    expect(tag.tag).to.be.eql(1)
    expect(tag.value).to.be.eql('one')
    expect(tag.toString()).to.be.eql('1("one")')

    expect(cbor.encode(tag)).to.be.eql(uint8ArrayFromString('c1636f6e65', 'base16'))
  })

  it('edges', () => {
    expect(
      () => new cbor.Tagged(-11, 'one')
    ).to.throw()

    expect(
      () => new cbor.Tagged(1.1, 'one')
    ).to.throw()

    expect(
      () => new cbor.Tagged('zero', 'one')
    ).to.throw()
  })
})
