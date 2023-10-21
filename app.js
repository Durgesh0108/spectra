const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
// const ejsMate = require('ejs-mate');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const glassRouter = require('./routes/glassRoute');
const userRouter = require('./routes/userRoute');
const reviewRouter = require('./routes/reviewRoute');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoute');

const app = express();

app.set('view engine', 'pug');
// app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
// 1) GLOBAL MIDDLEWARES

// serving static file
app.use(express.static(path.join(__dirname, 'public')));

// Set Security HTTP header
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// if (process.env.NODE_ENV === 'production') {
//     app.use(morgan('prod'));
// }

// Limit Requests from IP
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, Please try again in an Hour'
});

app.use('/api', limiter);

// Body Parse, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// load data from cookies
app.use(cookieParser());

// Data Santization again NoSQL query injection
app.use(mongoSanitize());

// Data Santization again XSS attack
app.use(xss());

// prevent parameter pollution
app.use(
    hpp({
        whitelist: ['price', 'ratingsAverage', 'ratingsQuantity', 'rating'] // allowed fields for duplicate parameter(params)
    })
);

// app.get('/', (req, res) => {
//   res.send('Hello From Home Page');
// });

// app.get('/glass', (req, res) => {
//   res.send('Hello From glass Page');
// });

// app.use((req, res, next) => {
//   console.log("Hello from the middleware 👋");
//     next();
// });
app.use(compression());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    // console.log(req.cookies);
    next();
});

// 3) ROUTES
// app.get('/', (req, res) => {
//     // render is used to display the page we want to render
//     res.status(200).render('example', {
//         glass: 'Computer Glasses',
//         user: 'Durgesh Prajapati'
//     });
// });

// app.get('/', (req, res) => {
//     // render is used to display the page we want to render
//     res.status(200).render('base', {
//         glass: 'Computer Glasses',
//         user: 'Durgesh Prajapati'
//     });
// });

app.use('/', viewRouter);
app.use('/api/v1/glasses', glassRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
// app.listen(4000, () => {
//   console.log(`App running on port 3000...`);
// });
module.exports = app;
