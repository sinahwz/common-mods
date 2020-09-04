const fileHandler = require('./modules/file_handler');
const general = require('./modules/general');

module.exports = {
  ...fileHandler,
  ...general,
};
