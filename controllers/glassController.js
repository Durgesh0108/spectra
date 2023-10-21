const multer = require('multer');
const sharp = require('sharp');
const { uuid } = require('uuidv4');

// const APIFeatures = require('../utils/apiFeatures');
const Glass = require('../models/glassModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(
            new AppError('Not an image! Please upload only images.', 400),
            false
        );
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadGlassImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'imageHover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
]);

// upload.single('image') req.file
// upload.array('images', 5) req.files

exports.resizeGlassImages = catchAsync(async (req, res, next) => {
    if (!req.params.id) {
        // console.log(req.files);
        if (!req.files.imageCover || !req.files.imageHover || !req.files.images)
            return next();

        // 1) Cover image
        req.body.imageCover = `glass-${uuid()}-${Date.now()}-cover.jpeg`;
        req.body.imageHover = `glass-${uuid()}-${Date.now()}-hover.jpeg`;
        await sharp(req.files.imageCover[0].buffer)
            .resize(501, 201)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/glasses/${req.body.imageCover}`);

        await sharp(req.files.imageHover[0].buffer)
            .resize(502, 177)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/glasses/${req.body.imageHover}`);

        // 2) Images
        req.body.images = [];

        await Promise.all(
            req.files.images.map(async (file, i) => {
                const filename = `glass-${uuid()}-${Date.now()}-${i}.jpeg`;

                await sharp(file.buffer)
                    .resize(450, 450)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 })
                    .toFile(`public/img/glasses/${filename}`);

                req.body.images.push(filename);
            })
        );
    } else {
        // console.log(req.files);
        if (!req.files.imageCover || !req.files.imageHover || !req.files.images)
            return next();

        // 1) Cover image
        req.body.imageCover = `glass-${req.params.id}-${Date.now()}-cover.jpeg`;
        req.body.imageHover = `glass-${req.params.id}-${Date.now()}-hover.jpeg`;
        await sharp(req.files.imageCover[0].buffer)
            .resize(501, 201)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/glasses/${req.body.imageCover}`);

        await sharp(req.files.imageHover[0].buffer)
            .resize(502, 177)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/glasses/${req.body.imageHover}`);

        // 2) Images
        req.body.images = [];

        await Promise.all(
            req.files.images.map(async (file, i) => {
                const filename = `glass-${req.params.id}-${Date.now()}-${i +
                    1}.jpeg`;

                await sharp(file.buffer)
                    .resize(450, 450)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 })
                    .toFile(`public/img/glasses/${filename}`);

                req.body.images.push(filename);
            })
        );
    }

    next();
});

exports.aliasTopGlasses = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingsAverage';
    next();
};

exports.getAllProducts = factory.getAll(Glass);
// exports.getAllProducts = catchAsync(async (req, res, next) => {
//     const features = new APIFeatures(Glass.find(), req.query)
//         .filter()
//         .sort()
//         .limitFields()
//         .paginate();

//     const glass = await features.query;

//     res.status(200).json({
//         status: 'success',
//         results: glass.length,
//         data: {
//             glass
//         }
//     });
// });

//

exports.getProduct = factory.getOne(Glass, { path: 'reviews' });
// exports.getProduct = factory.getOne(Glass, 'reviews');

// exports.getProduct = catchAsync(async (req, res, next) => {
//     const glass = await Glass.findById(req.params.id).populate('reviews');

//     if (!glass) {
// return next(new AppError('No Glass found with the ID', 404));
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             glass
//         }
//     });
// });

exports.createProduct = factory.createOne(Glass);

// exports.createProduct = catchAsync(async (req, res) => {
//     const newGlass = await Glass.create(req.body);

//     res.status(201).json({
//         status: 'success',
//         data: {
//             glass: newGlass
//         }
//     });

// const newId = products[products.length - 1].id + 1;
// const newProduct = Object.assign({ id: newId }, req.body);

// products.push(newProduct);

// fs.writeFile(
//     `${__dirname}/dev-data/data/products.json`,
//     JSON.stringify(products),
//     err => {
//         res.status(201).json({
//             status: 'success',
//             data: {
//                 product: newProduct
//             }
//         });
//     }
// );

// });

exports.updateProduct = factory.updateOne(Glass);
// exports.updateProduct = catchAsync(async (req, res, next) => {
//     const glass = await Glass.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true
//     });

//     if (!glass) {
//         return next(new AppError('No Glass found with that ID', 404));
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             glass
//         }
//     });
// });

exports.deleteGlass = factory.deleteOne(Glass);
// exports.deleteProduct = catchAsync(async (req, res, next) => {
//     const glass = await Glass.findByIdAndDelete(req.params.id);

//     if (!glass) {
//         return next(new AppError('No Glass found with the ID', 404));
//     }

//     res.status(204).json({
//         status: 'success',
//         data: null
//     });
// });

exports.getGlassStats = catchAsync(async (req, res, next) => {
    const stats = await Glass.aggregate([
        {
            $match: { ratingAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: { $toUpper: '$price' },
                numGlasses: { $sum: 1 },
                numRatings: { $sum: '$ratingQuantity' },
                avgRating: { $avg: 'ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minprice: { $min: '$price' },
                maxprice: { $max: '$price' }
            }
        },
        {
            $sort: { avgPrice: 1 }
        }
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
});
