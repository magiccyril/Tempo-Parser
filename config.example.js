var urlTempo    = 'http://particuliers.edf.com/gestion-de-mon-contrat/options-tempo-et-ejp/option-tempo/la-couleur-du-jour-2585.html'
  , urlXmlTempo = 'http://edf-ejp-tempo.sfr-sh.fr/EDI/site/france/effacementsTempo.xml'
  , urlEjp      = 'https://particuliers.edf.com/gestion-de-mon-contrat/options-tarifaires/option-ejp/l-observatoire-2584.html'
  , urlXmlEjp   = 'http://edf-ejp-tempo.sfr-sh.fr/EDI/site/france/effacementsEJP.xml'
  , apiUrl      = ''
  , apiKey      = '';

module.exports = {
  development: {
    urlTempo: urlTempo,
    urlXmlTempo: urlXmlTempo,
    urlEjp: urlEjp,
    urlXmlEjp: urlXmlEjp,
    apiUrl: apiUrl,
    apiKey: apiKey
  },
  test: {
    urlTempo: urlTempo,
    urlXmlTempo: urlXmlTempo,
    urlEjp: urlEjp,
    urlXmlEjp: urlXmlEjp,
    apiUrl: apiUrl,
    apiKey: apiKey
  },
  production: {}
}
