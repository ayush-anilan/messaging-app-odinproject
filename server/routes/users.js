const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.get("/profile-picture/:id", userController.getProfilePicture);
router.put("/update/:id", userController.updateById);
router.delete("/delete/:id", userController.deleteUserById);

module.exports = router;
