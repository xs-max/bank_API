const express = require('express')
const {createUser, getAllUsers, getMe, getUser, updateUser, deleteUser, disableUser, activateUser, createAdmin} = require('../controllers/userController');
const {login, updatePassword} = require('../controllers/authController');
const { protect, restrictTo } = require("../middlewares/authMiddleware");


const router = express.Router();

router.post('/login', login);
router.post("/createadmin", createAdmin);

router.use(protect);

router.patch("/updateMyPassword", updatePassword);
router.get("/me", getMe, getUser);


router.use(restrictTo("admin"));

router.route('/')
    .post(createUser)
    .get(getAllUsers);

router.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

router.patch('/:id/disable', disableUser);
router.patch("/:id/activate", activateUser);


module.exports = router;