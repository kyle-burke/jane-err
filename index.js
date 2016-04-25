var spellchecker = require('spellchecker');

var list = spellchecker.getCorrectionsForMisspelling('wall');

console.log('word provided: wall');
console.log('related words: ');
console.log(list);