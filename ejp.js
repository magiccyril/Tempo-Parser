var env = process.env.NODE_ENV || 'development'
  , config = require('./config')[env]
  , request = require('request')
  , cheerio = require('cheerio');

function EJP () {
  var year;
  var month;
  var day;
  var zones = {
    'north': undefined,
    'paca': undefined,
    'west': undefined,
    'south': undefined
  };

  var indexToZone = function (index) {
    switch (index) {
      case 1:
        return 'north';

      case 2:
        return 'paca';

      case 3:
        return 'west';

      case 4:
        return 'south';
    }
  };

  this.parseDay = function (elem) {
    var regex = /(\d{2}|\d{1})(.*)(\d{4})$/g;
    var matches = regex.exec(elem.text());

    var frenchMonths = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

    day   = parseInt(matches[1], 10);
    month = frenchMonths.indexOf(matches[2].trim()) + 1;
    year  = parseInt(matches[3], 10);
  };

  this.parseZones = function (elems) {
    for (var i = 1; i < elems.length; i++) {
      var $ = cheerio.load(elems[i]);
      var src = $('img').attr('src');
      if (src) {
        var srcUrlParts = src.split('/');
        var filename = srcUrlParts[srcUrlParts.length - 1];

        var isEJP = undefined;
        if ('ejp_oui.png' === filename) {
          isEJP = true;
        }
        if ('ejp_non.png' === filename) {
          isEJP = false;
        }

        zones[indexToZone(i)] = isEJP;
      }
    }
  };

  this.isZonesValid = function () {
    return 'boolean' === typeof zones.north
      && 'boolean' === typeof zones.paca
      && 'boolean' === typeof zones.west
      && 'boolean' === typeof zones.south;
  };

  this.toObject = function () {
    return {
      'year':  year,
      'month': month,
      'day':   day,
      'zones': zones
    }
  };
};

function postToApi (ejp) {
  request.post({
    url: config.apiUrl + '/ejp?apikey=' + config.apiKey,
    json: ejp.toObject()
  }, function(error, response, html) {
    if (error || response.statusCode != 200) {
      console.log('Error when saving');
    }
  });
}

request(config.urlEjp, function (error, response, html) {
  if (error) {
    console.log('Cannot access EDF URL');
    return;
  }
  var $ = cheerio.load(html);
  var ejpDay = $('.EJPDay');

  for (var i = 0; i < 2; ++i) {
    $ = cheerio.load(ejpDay[i]);

    var dayElem = $('caption');
    var zoneElems = $('.reacapEJPDay td');

    if (dayElem && zoneElems) {
      var ejp = new EJP();
      ejp.parseDay(dayElem);
      ejp.parseZones(zoneElems);

      if (ejp.isZonesValid()) {
        postToApi(ejp);
      }
    }
  }
});
