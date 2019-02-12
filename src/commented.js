'use strict'

const Decoder = require('./decoder')

function plural (c) {
  if (c > 1) {
    return 's'
  } else {
    return ''
  }
}

function indent (n) {
  return (new Array(n + 1)).join(' ')
}

function comment (maxDepth, depth, label) {
  return indent(2 * (maxDepth - depth - 2)) + '-- ' + label
}

function numberToHex (n) {
  return (new Buffer([n])).toString('hex')
}

/**
 * Generate the expanded format of RFC 7049, section 2.2.1
 *
 * @extends {Decoder}
 */
class Commented extends Decoder {
  constructor (opts) {
    opts = opts || {}
    let maxIndentDepth = 10
    if (opts.maxIndentDepth != null) {
      maxIndentDepth = opts.maxIndentDepth
      delete opts.maxIndentDepth
    }

    super(opts)
    this.depth = 0
    this.maxIndentDepth = maxIndentDepth
  }

  _push (val, hasChildren) {
    this.depth++
    const adjustedVal = indent(2 * this.depth) + val + '\n'
    super._push(adjustedVal, hasChildren)
  }

  createTag (tagNumber, value) {
    return `${tagNumber}(${value})`
  }

  createInt (raw) {
    console.log('int', raw)
    const val = super.createInt(raw)
    return numberToHex(val) + comment(this.maxIndentDepth, this.depth, val)
  }

  createInt32 (f, g) {
    return numberToHex(super.createInt32(f, g))
  }

  createInt64 (f1, f2, g1, g2) {
    return numberToHex(super.createInt64(f1, f2, g1, g2))
  }

  createInt32Neg (f, g) {
    return numberToHex(super.createInt32Neg(f, g))
  }

  createInt64Neg (f1, f2, g1, g2) {
    return numberToHex(super.createInt64Neg(f1, f2, g1, g2))
  }

  createTrue () {
    return 'true'
  }

  createFalse () {
    return 'false'
  }

  createFloat (val) {
    const fl = super.createFloat(val)
    if (utils.isNegativeZero(val)) {
      return '-0_1'
    }

    return `${fl}_1`
  }

  createFloatSingle (a, b, c, d) {
    const fl = super.createFloatSingle(a, b, c, d)
    return `${fl}_2`
  }

  createFloatDouble (a, b, c, d, e, f, g, h) {
    const fl = super.createFloatDouble(a, b, c, d, e, f, g, h)
    return `${fl}_3`
  }

  createByteString (raw, len) {
    const val = raw.join(', ')

    if (len === -1) {
      return `(_ ${val})`
    }
    return `h'${val}`
  }

  createByteStringFromHeap (start, end) {
    const val = (new Buffer(
      super.createByteStringFromHeap(start, end)
    )).toString('hex')

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

  createArray (arr, len) {
    const val = super.createArray(arr, len)

    if (len === -1) {
      // indefinite
      return `[_ ${val.join(', ')}]`
    }

    return `[${val.join(', ')}]`
  }

  createMap (map, len) {
    const val = super.createMap(map)
    const list = Array.from(val.keys())
          .reduce(collectObject(val), '')

    if (len === -1) {
      return `{_ ${list}}`
    }

    return `{${list}}`
  }

  createObject (obj, len) {
    const val = super.createObject(obj)
    const map = Object.keys(val)
          .reduce(collectObject(val), '')

    if (len === -1) {
      return `{_ ${map}}`
    }

    return `{${map}}`
  }

  createUtf8String (raw, len) {
    const val = raw.join(', ')

    if (len === -1) {
      return `(_ ${val})`
    }

    return `"${val}"`
  }

  createUtf8StringFromHeap (start, end) {
    const val = (new Buffer(
      super.createUtf8StringFromHeap(start, end)
    )).toString('utf8')

    return `"${val}"`
  }

  static comment (input, enc) {
    if (typeof input === 'string') {
      input = new Buffer(input, enc || 'hex')
    }

    const com = new Commented()
    return com.decodeFirst(input) + '0x' + input.toString('hex') + '\n'
  }
}

module.exports = Commented
