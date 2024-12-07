const mongoose = require('mongoose');
const Products = require('./Products');
const User = require('./User');

const Schema = mongoose.Schema;

const CartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Products'
    }],
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // },
    // updatedAt: {
    //     type: Date,
    //     default: Date.now
    // }
}, {
    timestamps: true
})
const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;