const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');
// const glassController = require('./../controllers/glassController');
// const reviewController = require('./../controllers/reviewController');

const router = express.Router();

// router.use();

// router.get('/', viewController.homePage);
router.get(
    '/',
    bookingController.createBookingCheckout,
    authController.isLoggedIn,
    viewController.getOverview
);
router.get(
    '/glass/:slug',
    authController.isLoggedIn,
    authController.protect,
    viewController.getGlass
);
router.get('/login', authController.isLoggedIn, viewController.login);
router.get('/signup', authController.isLoggedIn, viewController.signup);
router.get('/order', authController.protect, viewController.order);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-glasses', authController.protect, viewController.getMyGlasses);
router.get(
    '/all-bookings',
    authController.protect,
    viewController.getAllBookings
);

router.get(
    '/addGlass',
    authController.protect,
    authController.restrictTo('admin'),
    viewController.addGlass
);
router.get(
    // '/addReview',
    '/glass/:slug/addReview',
    authController.protect,
    authController.restrictTo('user'),
    // viewController.getGlass,
    // reviewController.getGlassUserID,
    viewController.addReview
);
router.get('/example', viewController.examplePage);

router.post(
    '/submit-user-data',
    authController.protect,
    viewController.updateUserData
);

module.exports = router;
