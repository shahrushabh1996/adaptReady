const {
    create,
    edit,
    deleteDish,
    getDishes
} = require('./dishes.controller');
const { verifyAuthToken } = require('../middleware/auth.middleware');
const { dishValidatorSchema } = require('./dishes.validator');

const express = require('express');
const validator = require('express-joi-validation').createValidator({})

const router = express.Router();

router.get('/', verifyAuthToken, getDishes);
router.post('/', verifyAuthToken, validator.body(dishValidatorSchema), create);
router.put('/:id', verifyAuthToken, validator.body(dishValidatorSchema), edit);
router.delete('/:id', verifyAuthToken, deleteDish);

module.exports = router;
