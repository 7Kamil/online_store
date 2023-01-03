const Router = require("express");
const router = new Router();

router.use("/user", require("./userRouter"));
router.use("/type", require("./typeRouter"));
router.use("/brand", require("./brandRouter"));
router.use("/device", require("./deviceRouter"));

module.exports = router;
