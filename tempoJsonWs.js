var env = process.env.NODE_ENV || 'development'
  , config = require('./config')[env]
  , moment = require('moment')
  , request = require('request');

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

function parseColor (color) {
  color = color.toLowerCase();

  switch (color) {
    case 'bleu':
      return 'blue';

    case 'blanc':
      return 'white';

    case 'rouge':
      return 'red';
    }
};

function createTempoObject (date, rawColor) {
  var color = parseColor(rawColor);

  if (!color) {
    return null;
  }
  
  return {
    year: date.format('YYYY'),
    month: date.format('MM'),
    day: date.format('DD'),
    color: color
  };
};

function postToApi (tempo) {
  request.post({
    url: config.apiUrl + '/tempo?apikey=' + config.apiKey,
    json: tempo
  }, function(error, response, html) {
    if (error || response.statusCode != 200) {
      console.log('Error when saving');
    }
  });
};

function createWsUrl (base, type) {
    var date = moment().format("YYYY-MM-DD");
    return base + '?Date_a_remonter=' + date + '&TypeAlerte=' + type.toUpperCase();
}

request(createWsUrl(config.urlJsonTempo, 'tempo'), function (error, response, json) {
  if (error) {
    console.log('Cannot access EDF URL');
    return;
  }

  json = JSON.parse(json);
  
  var today = createTempoObject(moment(), json.JourJ.Tempo);
  if (today) {
    postToApi(today);
  }

  var tomorrow = createTempoObject(moment().add(1, 'day'), json.JourJ1.Tempo);
  if (tomorrow) {
    postToApi(tomorrow);
  }
});
