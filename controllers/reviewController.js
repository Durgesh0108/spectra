const Review = require('./../models/reviewModel');
// const catchAsync = require('./s../utils/catchAsync');
// const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.getAllReviews = factory.getAll(Review);

// exports.getAllReviews = catchAsync(async (req, res, next) => {
// let filter = {};
// if (req.params.glassID) filter = { glass: req.params.glassID };

// const review = await Review.find(filter);

//     res.status(200).json({
//         status: 'success',
//         results: review.length,
//         data: {
//             review
//         }
//     });
// });

// exports.getReview = factory.getOne(Review, { path: 'user', 'glass' });
exports.getReview = factory.getOne(Review, 'user', 'glass');

// exports.getReview = catchAsync(async (req, res, next) => {
//     const review = await Review.findById(req.params.id).populate(
//         'user',
//         'glass'
//     );

//     if (!review) {
//         return next(new AppError(404, 'The Review with the ID Does not Exist'));
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             review
//         }
//     });
// });

exports.getGlassUserID = (req, res, next) => {
    if (!req.body.glass) req.body.glass = req.params.glassID;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

exports.createReview = factory.createOne(Review);
// exports.createReview = catchAsync(async (req, res, next) => {
//     const newReview = await Review.create(req.body);

//     res.status(201).json({
//         status: 'success',
//         data: {
//             newReview
//         }
//     });
// });

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
