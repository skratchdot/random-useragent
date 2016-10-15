var randomUseragent = require('random-useragent');
var ua = randomUseragent.getRandom(); // gets a random user agent string
var data = randomUseragent.getRandomData(); // gets random user agent data
console.log('Random useragent:', ua);
console.log('Random useragent data:', data);
