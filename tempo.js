var edfUrl = 'http://particuliers.edf.com/gestion-de-mon-contrat/options-tempo-et-ejp/option-tempo/la-couleur-du-jour-2585.html';
var apiUrl = 'http://api-tempo.18ruedivona.eu';

var casper = require('casper').create();

casper.on('remote.alert', function(alert) {
    this.log('[remote.alert] ' + alert, 'warning');
});

function getTempoObjectsOnRemote() {
    function Tempo() {
        var year;
        var month;
        var day;
        var color;

        this.parseDay = function(elem) {
            var regex = /(\d{2}|\d{1})(.*)(\d{4})$/g;
            var matches = regex.exec(elem.innerText);

            var frenchMonths = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

            day   = parseInt(matches[1], 10);
            month = frenchMonths.indexOf(matches[2].trim()) + 1;
            year  = parseInt(matches[3], 10);
        };

        this.parseColor = function(elem) {
            var classList = elem.classList;
            classList.remove('hp');
            color = classList.item(0);
        };

        this.toObject = function() {
            return {
                'year':  year,
                'month': month,
                'day':   day,
                'color': color
            }
        };
    }

    var tempoDays = new Array();
    var tempoDayNodeList = document.querySelectorAll('.TempoDay');
    for (var i = 0; i < tempoDayNodeList.length; ++i) {
        var dayElem = tempoDayNodeList[i].querySelector('h4');
        var colorElem = tempoDayNodeList[i].querySelector('.tempoHours .hp');

        if (dayElem && colorElem) {
            var tempo = new Tempo();
            tempo.parseDay(dayElem);
            tempo.parseColor(colorElem);

            tempoDays.push(tempo.toObject());
        }
    }

    return tempoDays;
}

casper
    .start(edfUrl)
    .then(function() {
        var tempos = this.evaluate(getTempoObjectsOnRemote);
        this.each(tempos, function(self, tempo, i) {
            self.thenOpen(apiUrl, {method: 'post', data: tempo}, function() {
                this.log('[POST TO API] : '+ JSON.stringify(tempo), 'debug');
            });
        });
    })
    .run();