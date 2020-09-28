const fs = require('fs-extra');
const PATH = require('path');
const rimraf = require('rimraf');
const jsonfile = require('jsonfile');

/**
* Copies file(s)
* common-mods/modules/file_handler/copyFile
* @param {String} source
* @param {String} dest
* @returns {String} path
*/
const copyFiles = (source, dest) => new Promise(async (resolve, reject) => {
  try {
    await fs.copy(source, dest);
    resolve();
  } catch (err) {
    console.log('[ERR][copyFiles] ', err);
    reject(err);
  }
});

/**
* Reads a file
* common-mods/modules/file_handler/readFile
* @param {String} path
* @param {Boolean} toString - if the output should be converted to String
* @returns {Buffer | String} content of the file
*/
const readFile = (path, toString) => new Promise((resolve, reject) => {
  fs.readFile(path, (err, buff) => {
    if (!err) resolve(toString ? buff.toString() : buff);
    else {
      reject(err);
      console.log('[ERR][readFile] ', err);
    }
  });
});

/**
* Writes into a file, path is also ensured to be available
* common-mods/modules/file_handler/writeFile
* @param {String} path
* @param {Buffer} body
* @returns {String} path
*/
const writeFile = (path, body) => new Promise(async (resolve, reject) => {
  // TODO: make sure body is buffer, if string, convert to buffer
  // Need to ensure that each path is available before
  await ensurePath(`${path}/${Path.dirname(path)}`);

  fs.writeFile(path, body, (err) => {
    if (!err) {
      resolve(path);
    } else {
      console.log('[ERR][writeFile] ', err);
      reject(err);
    }
  });
});

/**
* Reads a directory, checks to see if it is a directory beforehand
* common-mods/modules/file_handler/readDir
* @param {String} path
* @returns {Array} list of dir contents, [] if not a directory
*/
const readDir = async (path) => {
  try {
    let content = [];
    if (isDirectory(path)) {
      content = await fs.readdir(path);
    }

    return Promise.resolve(content);
  } catch (err) {
    console.log('[ERR][readDir] ', err);
    return Promise.reject(err);
  }
};

/**
* Renames a file
* common-mods/modules/file_handler/renameFile
* @param {String} path
* @param {String} newPath
* @returns {Array} list of dir contents
*/
const renameFile = (path, newPath) => {
  return new Promise((resolve, reject) => {
    fs.rename(path, newPath, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        console.log('[ERR][renameFile] ', err);
        reject(err);
      }
    });
  });
};

/**
* Checks the file size
* common-mods/modules/file_handler/getFileSize
* @param {String} filename
* @returns {Number} size - size in Bytes
*/
const getFileSize = (filename) => new Promise((resolve, reject) => {
  try {
    const { size } = fs.statSync(filename);
    resolve(size); // size in Bytes
  } catch (err) {
    console.log('[ERR][getFileSize] ', err);
    reject(err);
  }
});

/**
* Checks if the path exists
* common-mods/modules/file_handler/pathExists
* @param {String} path
* @returns {}
*/
const pathExists = path => fs.existsSync(path);

/**
* Checks the path and creates it if it does not exists
* common-mods/modules/file_handler/ensurePath
* @param {String} path
* @returns {}
*/
const ensurePath = async(path) => {
  try {
    await fs.ensureDir(path);
    return Promise.resolve();
  } catch (err) {
    console.error('[ERR][ensurePath] ', err);
    return Promise.reject(err);
  }
};

/**
* Removes a directory
* common-mods/modules/file_handler/cleanPath
* @param {String} path
* @param {Boolean} includeParentFolder
* @returns {}
*/
const cleanPath = async (path, includeParentFolder) => {
  try {
    if (path) {
      if (includeParentFolder) {
        path = PATH.normalize(`${path}/..`);
      }
      await rimraf.sync(path);
    }
    return Promise.resolve();
  } catch (err) {
    console.log('[ERR][cleanPath] Could not clean path: ', path, err);
    return Promise.reject(err);
  }
};

/**
* Checks to see if the path is a directory
* common-mods/modules/file_handler/isDirectory
* @param {String} path
* @returns {Boolean}
*/
const isDirectory = (path) => fs.lstatSync(path).isDirectory();

/**
* Writes a JSON file
* common-mods/modules/file_handler/writeJson
* @param {String} path
* @param {Object} Obj - which will be converted to JSON
* @returns {}
*/
const writeJson = (path, obj) => new Promise((resolve, reject) => {
  jsonfile.writeFile(path, obj, { spaces: 2 }, (err) => {
    if (err) {
      console.log('[ERR][writeJson] ', err);
      reject(err);
    } else {
      resolve();
    }
  });
});

/**
* Reads a JSON file
* common-mods/modules/file_handler/readJson
* @param {String} path
* @returns {}
*/
const readJson = (path) => new Promise((resolve, reject) => {
  jsonfile.readFile(path, (err, obj) => {
    if (err) {
      console.log('[ERR][readJson] ', err);
      reject(err);
    } else {
      resolve(obj);
    }
  });
});

module.exports = {
  cleanPath,
  copyFiles,
  ensurePath,
  getFileSize,
  isDirectory,
  pathExists,
  readDir,
  readFile,
  readJson,
  renameFile,
  writeFile,
  writeJson,
};
