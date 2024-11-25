const express = require("express")
const router = express.Router();
const RazerController= require("../controller/RazerController.js")

router.post("/razorPayment", RazerController.razerpaymentorder);
router.post("/verify", RazerController.verify);
module.exports = router;
