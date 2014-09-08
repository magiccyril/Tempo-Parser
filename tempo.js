var env = process.env.NODE_ENV || 'development'
  , config = require('./config')[env]
  , request = require('request')
  , cheerio = require('cheerio');

function Tempo () {
  var year;
  var month;
  var day;
  var color;

  this.parseDay = function (elem) {
    var regex = /(\d{2}|\d{1})(.*)(\d{4})$/g;
    var matches = regex.exec(elem.text());

    var frenchMonths = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

    day   = parseInt(matches[1], 10);
    month = frenchMonths.indexOf(matches[2].trim()) + 1;
    year  = parseInt(matches[3], 10);
  };

  this.parseColor = function (elem) {
    var classList = elem.removeClass('hp').attr('class');
    color = classList.split(' ')[0];
  };

  this.toObject = function () {
    return {
      'year':  year,
      'month': month,
      'day':   day,
      'color': color
    }
  };
};

function postToApi (tempo) {
  request.post({
    url: config.apiUrl + '/tempo?apikey=' + config.apiKey,
    json: tempo.toObject()
  }, function(error, response, html) {
    if (error || response.statusCode != 200) {
      console.log('Error when saving');
    }
  });
}

request(config.urlTempo, function (error, response, html) {
  if (error) {
    console.log('Cannot access EDF URL');
    return;
  }
  var $ = cheerio.load(html);
  var tempoDay = $('.TempoDay');

  for (var i = 0; i < 2; ++i) {
    $ = cheerio.load(tempoDay[i]);

    var dayElem = $('h4');
    var colorElem = $('.tempoHours .hp');

    if (dayElem && colorElem) {
      var tempo = new Tempo();
      tempo.parseDay(dayElem);
      tempo.parseColor(colorElem);

      postToApi(tempo);
    }
  }
});
