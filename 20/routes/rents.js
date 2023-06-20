const express = require('express');
const rentsController = require('../controllers/rents');
const router = express.Router();
const methodOverride = require('method-override')

router.use((req, resp, next) => {
    if (req.headers['x-http-method-override']) {
        req.method = req.headers['x-http-method-override'];
    }
    next();
});

router.route('/rents')
    .get(rentsController.getAll)
    .post(rentsController.addRent)
    .put(rentsController.updateRent)
    .delete(rentsController.deleteRent)

router.get('/rents/:rent_id', rentsController.getRent)

module.exports = router;
