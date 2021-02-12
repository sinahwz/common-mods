const shell = require('shelljs');
const dateFormat = require('date-format');
const chalk = require('chalk');

/**
* Allows timeouts before conrinuing
* common-mods/modules/general/timeout
* @param {Number} ms - time to wait in miliseconds
* @returns {}
*/
const timeout = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

/**
* Executes a shell command
* common-mods/modules/general/commandExec
* @param {String} command - command to be executed
* @param {Boolean} silent - no outputs to be printed
* @param {Boolean} printCmd - to print the command in console
* @returns {}
*/
const commandExec = (command, silent = false, printCmd = true) => new Promise((resolve, reject) => {
  // TODO: support array of commands
  try {
    if (printCmd) {
      console.log('\n  [DEV] Executing command::::::: ', command);
    }
    shell.exec(command, { silent }, (statusCode, stdOut, stdErr) => {
      if (statusCode !== 0) {
        console.log(' [ERR][commandExec][shell]', {
          stdErr,
          statusCode,
        });
        reject(stdErr);
      } else resolve(stdOut);
    });
  } catch (err) {
    console.log('[ERR][commandExec] ', err);
    reject(err);
  }
});

/**
* Ensures the passed string is in JSON format
* common-mods/modules/general/ensureJson
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
* common-mods/modules/general/capitalizeFirstLetter
* @param {String} string - string to have it's first letter capitalized
* @returns {}
*/
const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

/**
* Returns a standard date and time format
* common-mods/modules/general/dateAndTime
* @param {String} date - date to be converted to the desired format
* @returns {String} Date and time in the format: 'yyyy-MM-dd hh:mm:ss'
*/
const dateAndTime = (date) => dateFormat('yyyy-MM-dd hh:mm:ss', date || new Date());

/**
* Stylish console.log
* common-mods/modules/general/chalkIt
* @params {String} text - text to log
* @params {Boolean} isError
* @returns {}
*/
const chalkIt = (text, options = {}) => {
  const {
    isError,
    data = '',
    font = 'black',
    bg = 'green',
  } = options;
  if (isError) {
    console.log(chalk.bgRed.bold(text));
  } else {
    const bgColor = `bg${bg.charAt(0).toUpperCase()}${bg.slice(1)}`;
    console.log(chalk[font][bgColor].bold(text));
  }
  console.log(data);
};

module.exports = {
  commandExec,
  timeout,
  ensureJson,
  capitalizeFirstLetter,
  dateAndTime,
  chalkIt,
};
