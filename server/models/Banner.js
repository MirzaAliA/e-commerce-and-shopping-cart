const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BannersSchema = new Schema({
    image: {
        type: String
    },
}, {
    timestamps: true
})

const Banners = mongoose.model('Banners', BannersSchema);

module.exports = Banners;