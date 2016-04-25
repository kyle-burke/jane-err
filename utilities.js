var spellchecker = require('spellchecker');
var wordnikApiKey = require('./wordnik');
var request = require('request-promise');
var Promise = require('bluebird');
var titles = require('./titles');

Array.prototype.randomElement = function() {
  return this[Math.floor(Math.random()*this.length)];
};

// we only want the most fertile, pun-able words to be used
function wordIsBoring(word) {
  var boringWords = [
    'the',
    'an',
    'a',
    'of',
    'to',
    'and'
  ];

  return boringWords.indexOf(word.toLowerCase()) > -1;
}

function getRelatedWords(input) {
  return spellchecker.getCorrectionsForMisspelling(input.toLowerCase());
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

function pickRandomWordFromList(list) {
  return list[Math.floor(Math.random()*list.length)];
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

  return Promise.all([request(optionsFirst), request(optionsSecond)])
  .then(function(response) {
    firstDefinition = JSON.parse(response[0]);
    secondDefinition = JSON.parse(response[1]);
    return firstDefinition[0].partOfSpeech === secondDefinition[0].partOfSpeech;
  })
}

function replaceWord(wordArray, oldWord, newWord) {
  wordArray[wordArray.indexOf(oldWord)] = newWord;

  return wordArray;
}

module.exports = {
  wordIsBoring: wordIsBoring,
  getRelatedWords: getRelatedWords,
  pickSimilarWords: pickSimilarWords,
  comparePartsOfSpeech: comparePartsOfSpeech,
  replaceWord: replaceWord
}