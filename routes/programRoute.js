const express = require('express');
const programController = require('../controllers/programController');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.route('/').post(roleMiddleware(["teacher", "admin"]),programController.createProgram);//    /Programs
router.route('/').get(programController.getAllPrograms);
router.route('/:slug').get(programController.getProgram);
router.route('/enroll').post(programController.enrollProgram);
router.route('/release').post(programController.releaseProgram);
router.route('/:slug').delete(programController.deleteProgram);
router.route('/:slug').put(programController.updateProgram);

module.exports = router;