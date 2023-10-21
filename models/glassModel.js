const mongoose = require('mongoose');
const slugs = require('slugify');

const glassSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A Glass Must have a Name'],
            trim: true,
            maxlength: [
                60,
                'A Glass name Must have less than or equal to 40 Characters'
            ],
            minlength: [
                5,
                'A Glass name Must have more than or equal to 10 Characters'
            ]
        },
        slug: String,
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
            set: val => Math.round(val * 10) / 10
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'A Glass Must have a Price']
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function(val) {
                    return val < this.price;
                },
                message: 'Discount price({VALUE}) should be below regular price'
            }
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A Glass Must have a Description']
        },
        description: {
            type: String,
            trim: true
        },
        imageHover: {
            type: String
            // required: [true, 'A Glass Must have a Hover Image']
        },
        imageCover: {
            type: String
            // required: [true, 'A Glass Must have a Cover Image']
        },
        images: [String]
        // reviews: [
        //     {
        //         type: mongoose.Schema.ObjectId,
        //         ref: 'Review'
        //     }
        // ]
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// glassSchema.virtual('')
// glassSchema.pre(/^find/, function(next) {
//     this.populate({
//         path: 'reviews',
//         select: '-__v'
//     });
//     next();
// });
glassSchema.index({ price: 1 });
glassSchema.index({ slug: 1 });

glassSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'glass',
    localField: '_id'
});

glassSchema.pre('save', function(next) {
    this.slug = slugs(this.name, { lower: true });
    next();
});

// glassSchema.pre('save', function(next) {
//     this.slug = slugify(this.name, { lower: true });
//     next();
// });

const Glass = mongoose.model('Glass', glassSchema);

module.exports = Glass;
