//Core Module
const path = require('path')

// Get the directory of the main module or current working directory
const mainPath = require.main?.filename || process.argv[1] || __filename;
module.exports = path.dirname(mainPath || __dirname)