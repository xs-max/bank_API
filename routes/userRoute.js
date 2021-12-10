const express = require('express')
const {createUser, getAllUsers, getMe, getUser, updateUser, deleteUser, disableUser, activateUser} = require('../controllers/userController');
const {protect, restrictTo, login, updatePassword} = require('../controllers/authController');


const router = express.Router();

router.post('/login', login);

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