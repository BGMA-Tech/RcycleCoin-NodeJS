const express = require('express');
const router = express.Router();
const GetUploadWithConfig = require('../utils/image/imageUtils');
const InfoController = require('../controllers/infoController');
const checkAuth = require('../middleware/checkAuth');

const upload = GetUploadWithConfig();

router.get('/:id', checkAuth, InfoController.infoGetOne);
router.post('/', checkAuth, upload.single('image'), InfoController.infoCreate);
router.put('/:id', checkAuth, InfoController.infoUpdate);

module.exports = router;
