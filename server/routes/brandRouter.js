const Router = require("express");
const router = new Router();
const categoryController = require("../controllers/brandController");


router.post("/", categoryController.create);//
router.get("/", categoryController.getAll);//

module.exports = router;
