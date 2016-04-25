var spellchecker = require('spellchecker');
var wordnikApiKey = require('./wordnik');
var http = require('request-promise');
var Promise = require('bluebird');

var originalWord = 'wall';
var list = getRelatedWords(originalWord);
var related = pickSimilarWords(originalWord, list, 1);

console.log(related);

comparePartsOfSpeech('cat', 'dog')
.then(function(same) {
  console.log(same);
});

function getRelatedWords(input) {
  return spellchecker.getCorrectionsForMisspelling(input);
}

function pickSimilarWords(rootWord, words, degreesOfSeparation) {
  var validWords = [];

  for (var i = 0; i < words.length; i++) {
    if (rootWord.length !== words[i].length) {
      continue;
    }

    var difference = 0;
    for (var j = 0; j < words[i].length; j++) {
      if (rootWord[j] !== words[i][j]) {
        difference++;
      }
    }

    if (difference <= degreesOfSeparation && difference !== 0) {
      validWords.push(words[i]);
    }
  }

  return validWords;
}

function comparePartsOfSpeech(first, second) {
  var optionsFirst = {
    uri: 'http://api.wordnik.com:80/v4/word.json/' + first + '/definitions',
    qs: {
      api_key: wordnikApiKey
    }
  };

  var optionsSecond = {
    uri: 'http://api.wordnik.com:80/v4/word.json/' + second + '/definitions',
    qs: {
      api_key: wordnikApiKey
    }
  };

  return Promise.all([http(optionsFirst), http(optionsSecond)])
  .then(function(response) {
    firstDefinition = JSON.parse(response[0]);
    secondDefinition = JSON.parse(response[1]);
    return firstDefinition[0].partOfSpeech === secondDefinition[0].partOfSpeech;
  })
}