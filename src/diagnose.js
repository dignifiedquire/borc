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

  createByteString (start, end) {
    const val = (new Buffer(super.createByteString(start, end))).toString('hex')

    return `h'${val}'`
  }

  static diagnose (input) {
    if (typeof input === 'string') {
      input = new Buffer(input, enc || 'hex')
    }

    const dec = new Diagnose()
    return dec.decodeAll(input).join('')
  }
}

module.exports = Diagnose
