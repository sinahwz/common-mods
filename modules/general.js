const shell = require('shelljs');
const dateFormat = require('date-format');
const chalk = require('chalk');

/**
* Allows timeouts before conrinuing
* modules/anthill-common-modules/modules/general/timeout
* @param {Number} ms - time to wait in miliseconds
* @returns {}
*/
const timeout = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));

/**
* Executes a shell command
* modules/anthill-common-modules/modules/general/commandExec
* @param {String} command - command to be executed
* @param {Boolean} silent - no outputs to be printed
* @param {Boolean} printCmd - to print the command in console
* @returns {}
*/
const commandExec = (command, silent = false, printCmd = true) => new Promise((resolve, reject) => {
  try {
    if (printCmd) {
      console.log('\n  Executing command::::::: ', command);
    }
    shell.exec(command, { silent }, (code, stdout, stderr) => {
      if (stderr && code !== 0) reject(stderr);
      else resolve(stdout);
    });
  } catch (err) {
    console.log('[ERR][commandExec] ', err);
    reject(err);
  }
});

/**
* Ensures the passed string is in JSON format
* modules/anthill-common-modules/modules/general/ensureJson
* @param {String} string
* @returns {}
*/
const ensureJson = (str) => {
  let result;
  try {
    result = JSON.parse(str);
  } catch (e) {
    return str;
  }
  return result;
};

/**
* Capitalizes the first letter of the String
* modules/anthill-common-modules/modules/general/capitalizeFirstLetter
* @param {String} string - string to have it's first letter capitalized
* @returns {}
*/
const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

/**
* Returns a standard date and time format
* modules/anthill-common-modules/modules/general/dateAndTime
* @returns {String} Date and time in the format: 'yyyy-MM-dd hh:mm:ss'
*/
const dateAndTime = () => dateFormat('yyyy-MM-dd hh:mm:ss', new Date());

/**
* Stylish console.log
* modules/anthill-common-modules/modules/general/chalkIt
* @params {String} text - text to log
* @params {Boolean} isError
* @returns {}
*/
const chalkIt = (text, options = {}) => {
  const {
    isError,
    bg = 'green',
  } = options;
  if (isError) {
    console.log(chalk.bgRed.bold(text));
  } else {
    const bgColor = 'bg' + bg.charAt(0).toUpperCase() + bg.slice(1);
    console.log(chalk[bgColor].bold(text));
  }
};

module.exports = {
  commandExec,
  timeout,
  ensureJson,
  capitalizeFirstLetter,
  dateAndTime,
  chalkIt,
};
