var env = process.env.NODE_ENV || 'development'
  , config = require('./config')[env]
  , request = require('request')
  , parseString = require('xml2js').parseString;

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

function parseDate (date) {
  date = date.split('-');

  return {
    year: date[0],
    month: date[1],
    day: date[2]
  };
};

function parseEdfObject (object) {
  var date = parseDate(object['$'].v);
  var color = parseColor(object.Value[0]['$'].v);

  return {
    year: date.year,
    month: date.month,
    day: date.day,
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

request(config.urlXmlTempo, function (error, response, xml) {
  if (error) {
    console.log('Cannot access EDF URL');
    return;
  }

  parseString(xml, function (err, json) {
    var objects = json.EffacementTempo.Effacement[0].DateTempo;
    for (var i = 0; i < objects.length; i++) {
      postToApi(parseEdfObject(objects[i]));
    }
  });
});
