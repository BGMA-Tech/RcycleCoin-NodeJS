const express = require('express');
const router = express.Router();
const GetUploadWithConfig = require('../utils/image/imageUtils');
const InfoController = require('../controllers/infoController');

const upload = GetUploadWithConfig();

router.get('/:id', InfoController.infoGetOne);
router.post('/', upload.single('image'), InfoController.infoCreate);
router.patch('/:id', InfoController.infoUpdate);

module.exports = router;
