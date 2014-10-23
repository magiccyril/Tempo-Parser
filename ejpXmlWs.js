var env = process.env.NODE_ENV || 'development'
  , config = require('./config')[env]
  , request = require('request')
  , parseString = require('xml2js').parseString;

function parseValue (value) {
  value = value.toLowerCase();

  switch (value) {
    case 'non':
      return false;

    case 'oui':
      return true;
    }
};

function parseZoneName (name) {
  name = name.toLowerCase();

  switch (name) {
    case 'ejp_nord':
      return 'north';

    case 'ejp_sud':
      return 'south';

    case 'ejp_ouest':
      return 'west';

    case 'ejp_paca':
      return 'paca';
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

function parseEdfZone (zone) {
  var object = {
    zone: undefined,
    dates: []
  };

  object.zone = parseZoneName(zone['$'].v);

  var dates = zone.DateEJP;
  for (var i = 0; i < dates.length; i++) {
    var date = parseDate(dates[i]['$'].v);
    var value = parseValue(dates[i].Value[0]['$'].v);
    object.dates.push({
      date: date,
      value: value
    });
  }

  return object;
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

request(config.urlXmlEjp, function (error, response, xml) {
  if (error) {
    console.log('Cannot access EDF URL');
    return;
  }

  parseString(xml, function (err, json) {
    var toPost = {};
    var zones = json.EffacementEJP.Effacement[0].Region;
    for (var i = 0; i < zones.length; i++) {
      var object = parseEdfZone(zones[i]);

      for (var j = 0; j < object.dates.length; j++) {
        var key = '' + object.dates[j].date.year + object.dates[j].date.month + object.dates[j].date.day;

        if (toPost[key] === undefined) {
          toPost[key] = {
            year: object.dates[j].date.year,
            month: object.dates[j].date.month,
            day: object.dates[j].date.day,
            zones: {}
          };
        }

        toPost[key].zones[object.zone] = object.dates[j].value;
      }
    }

    for (var i in toPost) {
      postToApi(toPost[i]);
    }
  });
});
