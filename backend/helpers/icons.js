/**
 * @module /backend/helpers/icons
 * @requires module:fs
 * @requires module:jimp
 * @requires module:multer
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * @description handles logic surrounding user and author avatars/icons 
 */

/**
 * file manipulation utility
 * @const
 */
const fs = require('fs');

/**
 * image manipulation/handling middleware
 * @const
 */
const jimp = require('jimp');

/**
 * file storage middleware
 * @const
 */
const multer  = require('multer');

/**
 * middleware file storage settings
 * @const
 */
const storage = multer.diskStorage({
    destination: function (req, file, cb) { 
        cb(null, process.env.UPLOAD_PATH) //where uploaded file is saved to
    },
    filename: function (req, file, cb) { 
        console.log('raw file', file);
        cb(null, 'tempIcon_' + Date.now()); //temp name of uploaded file
    }
});

/**
 * @function upload
 * @description returned to routes instance - e.g. users.js - to upload file to .env.upload_path
 */
const upload = multer({ storage: storage });

/**
 * @description once the tempIcon... file has been uploaded per the above:
 * rename, resize, and set quality on the temp file to meet website standards
 * @param {Object} req - http request object
 * @param {string} type - user or author (currently always user)
 * @param {number[]} size - desired dimensions of icon
 * @param {string} username - username to name file icon by
 * @returns {string} filename of newly named icon file. This is the value that will be registered to the database
 */
async function setFile(req, type, size, username) {

    /**
     * new filename value
     * @const
     * @type {string}
     */
    const filename = (`${username}`) + `_${type}Icon.jpeg`;

    /**
     * file's path on server
     * @const
     * @type {string}
     */
    const OUTFILE = process.env.UPLOAD_PATH+'/'+filename;

    await jimp.read(req.file.path).then(
        (icon) => {
            console.log('reading/resizing file');

            icon
            .resize(size[0], size[1]) // resize
            .quality(100) // set JPEG quality
            .write(OUTFILE); // save

            //removing temp icon
            fs.rm(req.file.path, (err, resp) => {
                console.log("removing temp file");
                if (err) {
                    console.log('failed to delete temp image');
                }
            });
        }).catch((err) => {
            console.log(err);
            return undefined;
    });

    return filename;
}

/**
 * @description renames file/avatar/icon on server when user changes their username
 * @param {string} oldUsername - previous username
 * @param {string} newUsername - new username
 * @param {string} type - user or author (currently always user)
 * @returns {string} renamed file
 */
async function renameFile(oldUsername, newUsername, type) {
    const oldFilename = (`${oldUsername}`) + `_${type}Icon.jpeg`;
    const oldPath = process.env.UPLOAD_PATH+'/'+oldFilename;
    
    const newFilename = (`${newUsername}`) + `_${type}Icon.jpeg`;
    const newPath = process.env.UPLOAD_PATH+'/'+newFilename;

    fs.rename(oldPath, newPath, (err, resp) => {
        console.log("renaming user icon file");
        if (err) {
            console.log('failed to rename user icon file');
        }
    });

    return newFilename;
}

module.exports = { upload, setFile, renameFile }