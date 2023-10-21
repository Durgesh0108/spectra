const Glass = require('./../models/glassModel');
const User = require('./../models/userModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
    // 1. Get Glass Data form
    const glasses = await Glass.find();
    // 2. Build Template
    // 3. Render that Template using glass data from 1.
    res.status(200).render('overview', {
        title: 'All Glasses',
        glasses
    });
});

exports.getGlass = catchAsync(async (req, res, next) => {
    const glass = await Glass.findOne({
        slug: req.params.slug
    }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });
    // console.log(`The Value of glass/slug:${glass}`);

    if (!glass) {
        return next(new AppError('There is no Glass with that name.', 404));
    }

    // 2) Build template
    // 3) Render template using data from 1)
    res.status(200).render('glassDetailPage', {
        title: `${glass.name} glass`,
        glass
    });

    // const glass = await Glass.findOne({ slug: req.params.slug }).populate({
    //     path: 'reviews',
    //     fields: 'review rating user'
    // });

    // console.log(`The Value of glass/slug:${glass}`);
    // res.status(200).render('glassDetailPage', {
    //     title: `${glass} Glass`,
    //     glass
    // });
});

exports.login = (req, res) => {
    res.status(200).render('login', {
        title: 'Login'
    });
};

exports.signup = (req, res) => {
    res.status(200).render('signup', {
        title: 'Sign Up'
    });
};

exports.order = (req, res) => {
    res.status(200).render('order', {
        title: 'Order Page'
    });
};

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your account'
    });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email
        },
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).render('account', {
        title: 'Your account',
        user: updatedUser
    });
});

exports.examplePage = (req, res) => {
    res.status(200).render('example', {
        title: 'Example'
    });
};

exports.addGlass = (req, res) => {
    res.status(200).render('addGlass', {
        title: 'Add Glass'
    });
};

exports.addReview = catchAsync(async (req, res) => {
    const glass = await Glass.findOne({
        slug: req.params.slug
    });
    console.log(`Glass:${glass}.`);
    res.status(200).render('review', {
        title: 'Add Review'
    });
});

exports.getMyGlasses = catchAsync(async (req, res, next) => {
    const bookings = await Booking.find({ user: req.user.id });

    const glassIDs = bookings.map(el => el.glass);
    const glasses = await Glass.find({ _id: { $in: glassIDs } });

    res.status(200).render('overview', {
        title: 'My Glasses',
        glasses
    });
});

exports.getAllBookings = catchAsync(async (req, res, next) => {
    const bookings = await Booking.find();
    const glassIDs = bookings.map(el => el.glass);
    const glasses = await Glass.find({ _id: { $in: glassIDs } });

    res.status(200).render('overview', {
        title: 'My Glasses',
        glasses
    });
});
