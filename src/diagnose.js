'use strict'

const stream = require('stream')
const util = require('util')
const Decoder = require('./decoder')
const Simple = require('./simple')
const utils = require('./utils')
const c = require('./constants')
const bignumber = require('bignumber.js')

/**
 * Output the diagnostic format from a stream of CBOR bytes.
 *
 */
class Diagnose extends Decoder {
  constructor (opts) {
    super(opts)
  }

  _createTag (tagNumber, value) {
    return `${tagNumber}(${value})`
  }

  createFloat (val) {
    const fl = super.createFloat(val)
    return `${fl}_3`
  }

  createFloatSingle (a, b, c, d) {
    const fl = super.createFloatSingle(a, b, c, d)
    return `${fl}_3`
  }

  createFloatDouble (a, b, c, d, e, f, g, h) {
    const fl = super.createFloatDouble(a, b, c, d, e, f, g, h)
    return `${fl}_3`
  }

  createByteString (start, end) {
    const val = (new Buffer(super.createByteString(start, end))).toString('hex')

    return `h'${val}'`
  }

  createInfinity () {
    return 'Infinity_1'
  }

  createInfinityNeg () {
    return '-Infinity_1'
  }

  createNaN () {
    return 'NaN_1'
  }

  createNaNNeg () {
    return '-NaN_1'
  }

  createNull () {
    return 'null'
  }

  createUndefined () {
    return 'undefined'
  }

  createSimpleUnassigned (val) {
    return `simple(${val})`
  }

  createUtf8String (start, end) {
    const val = (new Buffer(super.createUtf8String(start, end))).toString('utf8')

    return `"${val}"`
  }

  static diagnose (input) {
    if (typeof input === 'string') {
      input = new Buffer(input, enc || 'hex')
    }

    const dec = new Diagnose()
    const raw = dec.decodeFirst(input)

    return raw
  }
}

module.exports = Diagnose
