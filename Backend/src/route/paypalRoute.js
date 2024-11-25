const express = require("express")
const adddata = require("../controller/addDataController.js")
const paypalController = require("../controller/PaypalController.js")
const router = express.Router();

router.post("/paypalPayment",paypalController.paypalpaymentorder);
router.post("/sendOrderId", paypalController.orderId);
router.post("/adddata",adddata.addData)

module.exports = router;