const fileHandler = require('./modules/file_handler');
const general = require('./modules/general');
const { zipper } = require('./modules/zipper');

module.exports = {
  ...fileHandler,
  ...general,
  zipper,
};
