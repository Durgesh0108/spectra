const express = require('express');
// const multer = require('multer');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

// Setting path to upload user image in public folder.
// const upload = multer({ dest: 'public/img/users' });

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all route after this Middle Ware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.route('/me').get(userController.getMe, userController.getUser);
router.route('/deleteMe').delete(userController.deleteMe);

// Uplaod.single is used to update single parameter of option eg: photo(name present in user model)
router
    .route('/updateMe')
    .patch(
        userController.uploadUserPhoto,
        userController.resizeUserPhoto,
        userController.updateMe
    );

// All the Routes After this Middleware are restrict to Aamin and also protect(Authorized)
router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllusers);
// .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
