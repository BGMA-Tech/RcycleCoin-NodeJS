const multer = require('multer');

const getUploadWithConfig = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
      cb(
        null,
        new Date().toISOString() + file.originalname.split(' ').join('')
      );
    },
  });

  const fileFilter = (req, file, cb) => {
    const mimetypeFilter =
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png';

    if (mimetypeFilter) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter,
  });

  return upload;
};

module.exports = getUploadWithConfig;
