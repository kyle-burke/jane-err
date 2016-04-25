var http = require('http');
var utils = require('./utilities');
var titles = require('./titles');

function handleRequest(request, response) {

  var title = titles.randomElement();
  var newTitle = '';

  while (newTitle === '') {
    // break title into words
    var titleWords = title.split(' ');
    var word = titleWords.randomElement();
    console.log('random word from title: ' + word);
    // BORING. try again
    if (utils.wordIsBoring(word)) {
      continue;
    }
    // use spellchecker to get similar words
    var relatedWords = utils.getRelatedWords(word);
    // pick some words that are within x degrees of separation from our original word
    var punWords = utils.pickSimilarWords(word, relatedWords, 1);
    var punWord = punWords.randomElement();
    if (punWord === undefined) {
      continue;
    }

    var punWordCapitalized = punWord[0].toUpperCase() + punWord.slice(1);

    var newTitle = utils.replaceWord(titleWords, word, punWordCapitalized);
    console.log('pun word: ' + punWord);
  }

  response.writeHead(200, {"Content-Type": "application/json"});
  response.end(JSON.stringify({'title': newTitle.join(' ')}));
}

var server = http.createServer(handleRequest);

server.listen(8008, function() {
  console.log('Server ready at localhost:8008');
})