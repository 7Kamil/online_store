const Router = require("express");
const router = new Router();
const DeviceControlller = require("../controllers/deviceController");

router.post("/",DeviceControlller.create);
router.get("/", DeviceControlller.getAll);
router.get("/:id",DeviceControlller.getOne );
module.exports = router;
