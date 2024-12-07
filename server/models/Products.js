const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: {
        type: String
    },
    price: {
        type: String
    },
    category: {
        type: String
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
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

const Products = mongoose.model('Product', ProductSchema);

module.exports = Products;