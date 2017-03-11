importScripts('string_score.min.js');

var data;

var fields = ['Department', 'Semester', 'Paper', 'Year'];

onmessage = function(e) {
    if (e.data.type === 'data') {
        console.log('Got data');
        data = e.data.data;
        for (var i = 0; i < data.length; ++i) {
            for (var f = 0; f < fields.length; ++f) {
                data[i][fields[f]] = data[i][fields[f]].toLowerCase();
            }
        }
    } else if (e.data.type === 'query') {
        var query = e.data.query;
        query = query.toLowerCase();
        var terms = query.split(/\s+/);
        var fuzz = 0.3;
        console.log('got query: ', query);
        for (var j = 0; j < data.length; ++j) {
            data[j].score = {'Department': 0, 'Semester': 0, 'Paper': 0, 'Year': 0, 'total': 1};
            for (var t = 0; t < terms.length; ++t) {
                var maxTermScore = 0, maxField;
                for (var f = 0; f < fields.length; ++f) {
                    var termFieldScore = data[j][fields[f]].score(terms[t], fuzz);
                    if (termFieldScore > maxTermScore) {
                        maxTermScore = termFieldScore;
                        maxField = f;
                    }
                }
                data[j].score[fields[maxField]] += maxTermScore;
            }
            for (var f = 0; f < fields.length; ++f) {
                data[j].score.total += Math.pow(Math.max(data[j].score[fields[f]], 0.2) - 0.2, 1);
            }
        }
        data.sort(function(a, b) {
            return b.score.total - a.score.total;
        });
        var results = data.slice(0, 40);
        console.log('results: ', results);
        postMessage(results);
    }
};
