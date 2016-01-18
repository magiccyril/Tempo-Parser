var env = process.env.NODE_ENV || 'development'
  , config = require('./config')[env]
  , request = require('request')
  , moment = require('moment');

function parseValue (value) {
  value = value.toLowerCase();

  switch (value) {
    case 'non_ejp':
      return false;

    case 'EST_EJP':
      return true;
    }
};

function parseZone (zone) {
  zone = zone.toLowerCase();

  switch (zone) {
    case 'ejpnord':
      return 'north';

    case 'ejpsud':
      return 'south';

    case 'ejpouest':
      return 'west';

    case 'ejppaca':
      return 'paca';
    }
};

function createEjpObject (date, rawObject) {
  var zones = {};
  for (var rawZone in rawObject) {
    zones[parseZone(rawZone)] = parseValue(rawObject[rawZone]);
  }
  
  if (zones.west == undefined || zones.paca == undefined || zones.north == undefined || zones.south == undefined) {
    return null;
  }
  
  return {
    year: date.format('YYYY'),
    month: date.format('MM'),
    day: date.format('DD'),
    zones: zones
  };
};

function postToApi (ejp) {
  request.post({
    url: config.apiUrl + '/ejp?apikey=' + config.apiKey,
    json: ejp
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

request(createWsUrl(config.urlJsonTempo, 'ejp'), function (error, response, json) {
  if (error) {
    console.log('Cannot access EDF URL');
    return;
  }

  json = JSON.parse(json);
  
  var today = createEjpObject(moment(), json.JourJ);
  if (today) {
    postToApi(today);
  }

  var tomorrow = createEjpObject(moment().add(1, 'day'), json.JourJ1);
  if (tomorrow) {
    postToApi(tomorrow);
  }
});
