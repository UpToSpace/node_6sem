const express = require('express');
const billDetailsController = require('../controllers/bill_details');
const router = express.Router();
const methodOverride = require('method-override')

router.use((req, resp, next) => {
    if (req.headers['x-http-method-override']) {
        req.method = req.headers['x-http-method-override'];
    }
    next();
});

router.route('/billDetails')
    .get(billDetailsController.getAll)
    .post(billDetailsController.addBillDetail)
    .put(billDetailsController.updateBillDetail)
    .delete(billDetailsController.deleteBillDetail)

router.get('/billDetails/:bill_id', billDetailsController.getBillDetail)

module.exports = router;
