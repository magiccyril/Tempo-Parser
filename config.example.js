var urlTempo = 'http://particuliers.edf.com/gestion-de-mon-contrat/options-tempo-et-ejp/option-tempo/la-couleur-du-jour-2585.html'
  , urlEjp   = 'https://particuliers.edf.com/gestion-de-mon-contrat/options-tarifaires/option-ejp/l-observatoire-2584.html'
  , apiUrl   = ''
  , apiKey   = '';

module.exports = {
  development: {
    urlTempo: urlTempo,
    urlEjp: urlEjp,
    apiUrl: apiUrl,
    apiKey: apiKey
  },
  test: {
    urlTempo: urlTempo,
    urlEjp: urlEjp,
    apiUrl: apiUrl,
    apiKey: apiKey
  },
  production: {}
}
