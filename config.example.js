var
  , tempo    = 'http://particuliers.edf.com/gestion-de-mon-contrat/options-tempo-et-ejp/option-tempo/la-couleur-du-jour-2585.html'
  , ejp      = 'https://particuliers.edf.com/gestion-de-mon-contrat/options-tarifaires/option-ejp/l-observatoire-2584.html'
  , apiUrl   = ''
  , apiKey   = '';

module.exports = {
  development: {
    tempo: tempo,
    ejp: ejp,
    apiKey: apiKey
  },
  test: {
    tempo: tempo,
    ejp: ejp,
    apiKey: apiKey
  },
  production: {}
}
