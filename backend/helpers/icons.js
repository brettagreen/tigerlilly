const fs = require('fs');
const jimp = require('jimp');

const multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.UPLOAD_PATH)
    },
    filename: function (req, file, cb) {
        cb(null, 'tempIcon_' + Date.now());
    }
});

const upload = multer({ storage: storage });

async function setFile(req, type, size) {

    let filename = (type==='user'?`${req.body.username}`:`${req.body.authorHandle}`) + `_${type}Icon.jpeg`;
    const OUTFILE = process.env.UPLOAD_PATH+'/'+filename;

    await jimp.read(req.file.path).then(
        (icon) => {
        console.log('reading file');

        icon
          .resize(size[0], size[1]) // resize
          .quality(60) // set JPEG quality
          .write(OUTFILE); // save

        //removing temp icon
        fs.rm(req.file.path, (err, resp) => {
            console.log("removing file");
            if (err) {
                console.log('failed to delete temp image');
            } else {
                console.log('getting to file removal step');
            }
        });
    }).catch((err) => {
        console.log(err);
        return undefined;
    });

    return filename;

}

module.exports = { upload, setFile }