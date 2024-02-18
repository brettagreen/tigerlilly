const fs = require('fs');
const jimp = require('jimp');
const multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.UPLOAD_PATH)
    },
    filename: function (req, file, cb) {
        console.log('FILE', file);
        cb(null, 'tempIcon_' + Date.now());
    }
});

const upload = multer({ storage: storage });

async function setFile(req, type, size, username) {

    const filename = (`${username}`) + `_${type}Icon.jpeg`;
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