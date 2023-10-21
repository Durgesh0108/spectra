const express = require('express');
const authController = require('./../controllers/authController');
const glassController = require('./../controllers/glassController');
// const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./../routes/reviewRoute');

const router = express.Router();

// router
//     .route('/:glassID/review')
//     .post(
//         authController.protect,
//         authController.restrictTo('user'),
//         reviewController.createReview
//     );

router.use('/:glassID/review', reviewRouter);

router
    .route('/')
    .get(
        // authController.protect,
        glassController.getAllProducts
    )
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        glassController.uploadGlassImages,
        glassController.resizeGlassImages,
        glassController.createProduct
    );

router
    .route('/:id')
    .get(glassController.getProduct)
    .patch(
        authController.protect,
        authController.restrictTo('admin'),
        glassController.uploadGlassImages,
        glassController.resizeGlassImages,
        glassController.updateProduct
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        glassController.deleteGlass
    );

module.exports = router;
