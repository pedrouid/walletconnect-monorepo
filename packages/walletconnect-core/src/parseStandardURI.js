// Parse EIP681 and EIP1328 standard URI formats
// (c) Pedro Gomes <pedrouid@protonmail.com>
// MIT License

function parseRequiredParams(path, prefix, keys) {
  const required = { prefix }
  path = path.replace(`${prefix}-`, '')
  const values = path.split('@')
  keys.forEach((key, idx) => (required[key] = values[idx] || ''))
  return required
}

function parseParamsString(paramsString) {
  if (!paramsString) return {}

  let parameters = {}

  let pairs = (paramsString[0] === '?'
    ? paramsString.substr(1)
    : paramsString
  ).split('&')

  for (let i = 0; i < pairs.length; i++) {
    const key = pairs[i].match(/\w+(?==)/i)
      ? pairs[i].match(/\w+(?==)/i)[0]
      : null
    const value = pairs[i].match(/=.+/i)
      ? pairs[i].match(/=.+/i)[0].substr(1)
      : ''
    if (key) {
      parameters[decodeURIComponent(key)] = decodeURIComponent(value)
    }
  }
  return parameters
}

function parseStandardURI(string) {
  if (!string || typeof string !== 'string') {
    throw new Error('URI is not a string')
  }

  const pathStart = string.indexOf(':')

  const pathEnd = string.indexOf('?')

  const protocol = string.substring(0, pathStart)

  let required = {}

  let path =
    string.indexOf('?') !== -1
      ? string.substring(pathStart + 1, pathEnd)
      : string.substring(pathStart + 1)

  if (path.startsWith('pay')) {
    required = parseRequiredParams(path, 'pay', ['targetAddress', 'chainID'])
  } else if (path.startsWith('wc')) {
    required = parseRequiredParams(path, 'wc', ['sessionID', 'version'])
  } else {
    throw new Error('URI missing prefix')
  }

  const paramsString =
    string.indexOf('?') !== -1 ? string.substring(pathEnd) : ''

  const parameters = parseParamsString(paramsString)

  return { protocol, ...required, ...parameters }
}

export default parseStandardURI