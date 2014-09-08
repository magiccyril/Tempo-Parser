var
  , tempo    = 'http://particuliers.edf.com/gestion-de-mon-contrat/options-tempo-et-ejp/option-tempo/la-couleur-du-jour-2585.html'
  , ejp      = 'https://particuliers.edf.com/gestion-de-mon-contrat/options-tarifaires/option-ejp/l-observatoire-2584.html'
  , apiUrl   = ''
  , apikey   = '';

module.exports = {
  development: {
    tempo: tempo,
    ejp: ejp,
    apikey: apikey
  },
  test: {
    tempo: tempo,
    ejp: ejp,
    apikey: apikey
  },
  production: {}
}
