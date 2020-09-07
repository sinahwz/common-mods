const fs = require('fs-extra');
const archiver = require('archiver');
const { ensurePath, pathExists } = require('./file_handler');

// NOTE: this module makes a zip from a whole folder
module.exports.zipper = async (directory, zipName, storePath) => {
  return new Promise(async (resolve, reject) => {
    if (pathExists(directory)) {
      const zipPath = `${storePath}/${zipName}.zip`;
      await ensurePath(storePath);
      let outputZip = fs.createWriteStream(zipPath);
      let archive = archiver('zip', {
        zlib: { level: 9 }
      });

      archive.on('error', err => {
        console.log('[ERR][zipper] ', err);
        reject(err);
      });

      outputZip.on('close', () => {
        console.log(archive.pointer() + ' total bytes');
        console.log('[DEV][zipper] archiver has been finalized and the output file descriptor has closed.');

        setTimeout(() => {
          resolve(zipPath);
        }, 1000);
      });

      // good practice to catch warnings (ie stat failures and other non-blocking errors)
      archive.on('warning', err => {
        if (err.code === 'ENOENT') {
          // log warning
          console.log("[DEV] Archive Warning", err);
        } else {
          console.error("[DEV] Archive error", err);
        }
      });

      archive.directory(directory, false);

      archive.pipe(outputZip);
      archive.finalize();
    } else {
      const err = {
        errMessage: ` [ERR][zipper] path not found: ${directory}`,
      };
      reject(err);
    }
  });
};
