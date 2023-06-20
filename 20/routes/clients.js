const express = require('express');
const clientsController = require('../controllers/clients');
const router = express.Router();
const methodOverride = require('method-override')

router.use((req, resp, next) => {
    if (req.headers['x-http-method-override']) {
        req.method = req.headers['x-http-method-override'];
    }
    next();
});

router.route('/clients')
    .get(clientsController.getAll)
    .post(clientsController.addClient)
    .put(clientsController.updateClient)
    .delete(clientsController.deleteClient)

router.get('/clients/:passport_number', clientsController.getClient)

module.exports = router;