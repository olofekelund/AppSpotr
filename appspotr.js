var http = require('http');

var options = {
  host: 'api2.appspotr.com',
  path: '/givemeachallenge'
};

var solveTheChallenge = function(list) {
  if (list.length === 1) return list;

  var head = list.shift();

  for (var i = 0; i < list.length; i++) {
    if (list[i] === head) {
        list.splice(i, 1);

        return solveTheChallenge(list);
    }
  }
  return head;
};

var req = http.get(options, function(res) {
  var bodyChunks = [];

  res.on('data', function(chunk) {
    bodyChunks.push(chunk);
  }).on('end', function() {
    var body = Buffer.concat(bodyChunks);
    body = JSON.parse(body);
    
    var words = body.quiz;
    var copy = words.slice();

    var answer = solveTheChallenge(words);

    console.log('And the answer is: ', answer);

    var answerCount = 0;
    var wrongCount = 0;

    copy.forEach(function(element) {
        if (element === answer) answerCount++;
        else wrongCount++;
    });

    console.log('Answer: ', answerCount);
    console.log('Wrong: ', wrongCount);
    // ...and/or process the entire body here.
  });
});

req.on('error', function(e) {
  console.log('ERROR: ' + e.message);
});
