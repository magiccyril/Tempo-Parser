var urlTempo      = 'http://particuliers.edf.com/gestion-de-mon-contrat/options-tempo-et-ejp/option-tempo/la-couleur-du-jour-2585.html'
  , urlXmlTempo   = 'http://edf-ejp-tempo.sfr-sh.fr/EDI/site/france/effacementsTempo.xml'
  , urlJsonTempo  = 'https://particulier.edf.fr/bin/edf_rc/servlets/ejptemponew'
  , urlEjp        = 'https://particuliers.edf.com/gestion-de-mon-contrat/options-tarifaires/option-ejp/l-observatoire-2584.html'
  , urlXmlEjp     = 'http://edf-ejp-tempo.sfr-sh.fr/EDI/site/france/effacementsEJP.xml'
  , urlJsonEjp    = 'https://particulier.edf.fr/bin/edf_rc/servlets/ejptemponew'
  , apiUrl        = ''
  , apiKey        = '';

module.exports = {
  development: {
    urlTempo: urlTempo,
    urlXmlTempo: urlXmlTempo,
    urlJsonTempo: urlJsonTempo,
    urlEjp: urlEjp,
    urlXmlEjp: urlXmlEjp,
    urlJsonEjp: urlJsonEjp,
    apiUrl: apiUrl,
    apiKey: apiKey
  },
  test: {
    urlTempo: urlTempo,
    urlXmlTempo: urlXmlTempo,
    urlJsonTempo: urlJsonTempo,
    urlEjp: urlEjp,
    urlXmlEjp: urlXmlEjp,
    urlJsonEjp: urlJsonEjp,
    apiUrl: apiUrl,
    apiKey: apiKey
  },
  production: {}
}
