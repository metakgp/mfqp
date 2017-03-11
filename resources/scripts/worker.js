var data;
var fuseLengths = [8, 16, 32, 64, 128];
var fuses = [];

messageQueue = [];

onmessage = function(e) {
    if (e.data.type === 'data') {
        data = e.data.data;
        var options = {keys: ['Department', 'Semester', 'Paper', 'Year']};
        for (var i = 0; i < fuseLengths.length; ++i) {
            options.maxPatternLength = fuseLengths[i];
            fuses.push(new Fuse(data, options));
        }
    } else if (e.data.type === 'query') {
        var results = [];
        var query = e.data.query;
        for (var j = 0; j < fuseLengths.length; ++j) {
            if (query.length <= fuseLengths[j]) {
                results = fuses[j].search(query);
                break;
            }
        }
        postMessage(results);
    }
};
