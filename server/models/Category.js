const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorysSchema = new Schema({
    description: {
        type: String
    },
    image: {
        type: String
    },
}, {
    timestamps: true
})

const Categorys = mongoose.model('Categorys', CategorysSchema);

module.exports = Categorys;
