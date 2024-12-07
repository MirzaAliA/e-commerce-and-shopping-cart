const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NameSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    }
})

mongoose.model('Name', NameSchema);

const GeolocationSchema = new Schema({
    lat: {
        type: String
    },
    long: {
        type: String
    }
})

mongoose.model('Geolocation', GeolocationSchema);

const AddressSchema = new Schema({
    city: {
        type: String
    },
    street: {
        type: String
    },
    number: {
        type: String
    },
    zipCode: {
        type: String
    },
    geolocation: {
        type: Schema.Types.ObjectId,
        ref: 'Geolocation'
    }
})

mongoose.model('Address', AddressSchema);

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    name: {
        type: Schema.Types.ObjectId,
        ref: 'Name'
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: 'Address'
    },
    phone: {
        type: String
    }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;