const util = require("util");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const maxSize = 2 * 2048 * 2048;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = file.originalname;
    const fileName = `${uuidv4()}-${uniqueSuffix}.jpg`;
    req.newFName = fileName;
    cb(null, fileName);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;