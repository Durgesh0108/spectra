const mongoose = require('mongoose');
const Glass = require('./glassModel');

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            trim: true,
            required: [true, 'Review can Not be Empty']
        },
        rating: {
            type: Number,
            min: [1, 'Rating must be greater than 1'],
            max: [5, 'Rating must be less than 5']
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review Must belong to a User']
        },
        glass: {
            type: mongoose.Schema.ObjectId,
            ref: 'Glass',
            required: [true, 'Review Must belong to a Glass']
        }
    },
    {
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        }
    }
);

reviewSchema.index({ glass: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
    // this.populate({
    //     path: 'user',
    //     select: 'name'
    // }).populate({
    //     path: 'glass',
    //     select: 'name rating'
    // });
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});

reviewSchema.statics.calcAverageRatings = async function(glassId) {
    // console.log(glassId);
    const stats = await this.aggregate([
        {
            $match: { glass: glassId }
        },
        {
            $group: {
                _id: '$glass',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    console.log(stats);

    if (stats.length > 0) {
        await Glass.findByIdAndUpdate(glassId, {
            ratingsAverage: stats[0].avgRating,
            ratingsQuantity: stats[0].nRating
        });
    } else {
        await Glass.findByIdAndUpdate(glassId, {
            ratingsAverage: 4.5,
            ratingsQuantity: 0
        });
    }
};

reviewSchema.post('save', function() {
    // this points to current review
    this.constructor.calcAverageRatings(this.glass);
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.r = await this.findOne();
    console.log(`The value of This.r is : ${this.r}`);
    // console.log(`The value of glass.r is : ${this.r.glass}`);
    next();
});

reviewSchema.post(/^findOneAnd/, async function() {
    // await this.findOne(); does NOT work here, query has already executed
    await this.r.constructor.calcAverageRatings(this.r.glass);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
