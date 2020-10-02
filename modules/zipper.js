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

// TODO: add 'exclude' parameter
module.exports.zipper = async (source, zipName, dest) => new Promise(async (resolve, reject) => {
  const config = typeof source === 'string'
    ? { directory: source }
    : { ...source };

  if (pathExists(source)) {
    const nameWithDotZip = zipName.endsWith('.zip') ? zipName : `${zipName}.zip`;
    const zipPath = `${dest}/${nameWithDotZip}`;
    await ensurePath(dest);
    const outputZip = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    archive.on('error', (err) => {
      console.log('[ERR][zipper] ', err);
      reject(err);
    });

    outputZip.on('close', () => {
      console.log(`${archive.pointer()} total bytes`);
      console.log('[DEV][zipper] archiver has been finalized and the output file descriptor has closed.');

      setTimeout(() => {
        resolve(zipPath);
      }, 1000);
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

    console.log(' :::: source', source);
    archive.directory(source, false);

    // TODO: useful when trying to exclude paths
    // TODO: issue is that, it adds all glob matches files under 'source'
    // archive.glob(`${source}/**/*`, {
    //   // ignore: ['mydir/**', 'file.txt'],
    // });

    archive.pipe(outputZip);
    archive.finalize();
  } else {
    const err = {
      errMessage: ` [ERR][zipper] path not found: ${source}`,
    };
    reject(err);
  }
});
