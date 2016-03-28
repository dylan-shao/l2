var fs = require('fs');
var db = require('./db');

var interviews = [];

fs.readFile(__dirname + '/qs1/Barclays.txt', 'utf8', function(err, cnt) {
    console.log(err, cnt.length);
    var lines = cnt.split('\n');
    var interview = {};
    lines.forEach(function(l) {
        var line = l.trim();
        if (line.startsWith('---')) {
            //TODO, add previous interview info to interviews list
            if (!!interview.Client) interviews.push(interview);
            interview = {};
            return;
        }

        var isHeader = false;
        ['Client', 'Candidate', 'Date', 'Type'].forEach(function(k) {
            if (line.startsWith(k)) {
                interview[k] = line.split(':')[1].trim();
                isHeader = true;
            }
        });

        if (!isHeader) {
            var matchRes = /^\d+\.\s*(.*)/.exec(line.trim());
            if (!matchRes) return;
            if (!interview.questions) interview.questions = [];
            interview.questions.push(matchRes[1]);
        }
    })
    if (!!interview.Client) interviews.push(interview);
    console.log(interviews.length, interviews[0].questions.length, interviews[0].questions[0]);
    db.saveInterviews(interviews)
        .then(function(info){
            console.log("save after", info);
            return db.dbConn.then(function(db){db.close();})
        })
        .catch(console.log);

})

db.saveInterviews(interviews);
