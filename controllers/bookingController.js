const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Glass = require('../models/glassModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1) Get the currently booked tour
    const glass = await Glass.findById(req.params.glassID);
    // console.log(glass);

    // 2) Create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?glass=${
            req.params.glassID
        }&user=${req.user.id}&price=${glass.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/glass/${glass.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.glassID,
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: 'inr',
                    unit_amount: glass.price * 100,
                    product_data: {
                        name: `${glass.name} Glass`,
                        description: glass.description
                    }
                },
                quantity: 1
            }
        ]
    });

    // 3) Create session as response
    res.status(200).json({
        status: 'success',
        session
    });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
    // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
    const { glass, user, price } = req.query;

    if (!glass && !user && !price) return next();
    await Booking.create({ glass, user, price });

    res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
