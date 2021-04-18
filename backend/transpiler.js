// Transpile tout le code qui suit cette ligne avec Babel
require('babel-register')({ presets: ['env'] });
require('babel-polyfill');

// Importe le reste de l'application
module.exports = require('./index.js');