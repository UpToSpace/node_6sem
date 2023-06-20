const express = require('express');
const apartmentsController = require('../controllers/apartments');
const router = express.Router();
const methodOverride = require('method-override')

router.use((req, resp, next) => {
    if (req.headers['x-http-method-override']) {
        req.method = req.headers['x-http-method-override'];
    }
    next();
});

router.route('/apartments')
    .get(apartmentsController.getAll)
    .post(apartmentsController.addApartment)
    .put(apartmentsController.updateApartment)
    .delete(apartmentsController.deleteApartment)

router.get('/apartments/:apartment_id', apartmentsController.getApartment)

module.exports = router;
