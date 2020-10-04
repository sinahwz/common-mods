const fs = require('fs-extra');
const archiver = require('archiver');
const { ensurePath, pathExists } = require('./file_handler');

/**
 * @typedef {object} ZipperConfig
 * @property {string} [directory] - if you want to create a ZIP from directory
 * @property {string} [zipName] - name of the ZIP you want to create, ignored if `outputStream === true`
 * @property {string} [dest] - dest of the created ZIP, ignored if `outputStream === true`
 * @property {string} [directory] - if you want to create a zip from directory
 * @property {ReadableStream|ReadableStream[]} - streamor array of streams to be read from
 * @property {string} [glob] - e.g. if you want a directory with some excluded files you may pass src/**\/!(banana.txt)
 *                                  or to exclude a subdirectrory src/!(bananas)/**\/*
 *                                  Note: "\" is used for escaping comment end in the examples above
 * @property {boolean} [outputStream=false] - by default the handler will create a file in the fs and resolve the path
 */

/**
* Creates a zip file from source
* common-mods/modules/zipper
* @param {String|ZipperConfig} source
* @param {String} zipName
* @param {String} dest
* @param {Object} options
* @param {Array} options.excludedPaths
* @returns {string|ReadableStream}
*/

module.exports.zipper = async (source, zipName, dest) => new Promise(async (resolve, reject) => {
  const config = typeof source === 'string'
    ? { directory: source, zipName, dest }
    : { ...source };

  const archive = archiver('zip', {
    zlib: { level: 9 },
  });

  archive.on('error', (err) => {
    console.log('[ERR][zipper] ', err);
    reject(err);
  });

  // good practice to catch warnings (ie stat failures and other non-blocking errors)
  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
      // log warning
      console.log('[DEV] Archive Warning', err);
    } else {
      console.error('[DEV] Archive error', err);
    }
  });

  // handle directory
  if (config.directory) {
    console.log(' :::: source', config.directory);
    if (pathExists(config.directory)) {
      archive.directory(config.directory, false);
    } else {
      const err = {
        errMessage: ` [ERR][zipper] path not found: ${config.directory}`,
      };
      reject(err);
    }
  }

  if (config.glob) {
    archive.glob(config.glob);
  }

  // finalize archive input
  archive.finalize();

  // handle archive output
  if (config.outputStream) {
    resolve(archive);
  } else {
    const nameWithDotZip = config.zipName.endsWith('.zip') ? config.zipName : `${config.zipName}.zip`;
    const zipPath = `${config.dest}/${nameWithDotZip}`;
    await ensurePath(config.dest);
    const outputZip = fs.createWriteStream(zipPath);

    outputZip.on('close', () => {
      console.log(`${archive.pointer()} total bytes`);
      console.log('[DEV][zipper] archiver has been finalized and the output file descriptor has closed.');

      // TODO: do we really need this timeout...
      setTimeout(() => {
        resolve(zipPath);
      }, 1000);
    });
    archive.pipe(outputZip);
  }
});
