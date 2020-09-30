const fs = require('fs-extra');
const archiver = require('archiver');
const { ensurePath, pathExists } = require('./file_handler');

/**
* Creates a zip file from source
* common-mods/modules/zipper
* @param {String} source
* @param {String} zipName
* @param {String} dest
* @param {Object} options
* @param {Array} options.excludedPaths
* @returns {}
*/

// TODO: add 'exclude' parameter
module.exports.zipper = async (source, zipName, dest) => new Promise(async (resolve, reject) => {
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
