const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const getUploadWithConfig = require('../utils/image/imageUtils');

const checkAuth = require('../middleware/checkAuth');
const upload = getUploadWithConfig();

router.get('/:id', checkAuth, UserController.getUserById);
router.post('/register', upload.single('image'), UserController.userRegister);
router.post('/login', UserController.userLogin);
router.post('/getVerifyId', UserController.verifyIDNumber);

module.exports = router;
