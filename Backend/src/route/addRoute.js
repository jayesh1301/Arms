const express =  require("express")
const adddata = require("../controller/addDataController.js")

const router = express.Router();

router.post("/adddata",adddata.addData)
router.get('/getAllData', adddata.getAllData);
router.post('/login',adddata.Login)
module.exports = router;