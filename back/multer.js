const multer = require('multer');
const fs = require('fs');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        // const dirPictureProfil = `${process.env.BASE_SERVER}/pictures`;
        // if (!fs.existsSync(dirPictureProfil)) { fs.mkdirSync(dirPictureProfil) }
  
        const destination = `${process.env.BASE_SERVER}`;
        cb(null, destination);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); ;
    },
});
const maxSize = 50000000;
const upload = multer({ storage: storage, limits: { fileSize: maxSize } });

module.exports = upload;