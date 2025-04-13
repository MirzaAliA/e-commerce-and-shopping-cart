require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const connectDB = require('./server/config/db');
const Products = require('./server/models/Products');
const Cart = require('./server/models/Cart');
const User = require('./server/models/User');
const authenticateUser = require('./server/middleware/authenticateUser');
const logoutUser = require('./server/middleware/logoutUser');
const bcrypt = require('bcryptjs');
const ObjectId = require("mongodb").ObjectId


const app = express();
const PORT = process.env.PORT || 3000 ;


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Koneksi ke database
connectDB();


//templating engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


//Halaman Utama
app.get('/', async (req, res) => {
    res.render('index', {
        title: 'Halaman Index'
    })
})

//Halaman Login
app.get('/login', async (req, res) => {
    res.render('login', {
        title: 'Halaman Login'
    })
})

app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email field is required" });
        } else if (!password) {
            return res.status(400).json({ message: "Password field is required" });
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const registerData = { email, password: hashedPassword };
        const register = await User.create(registerData)

        if (register) {
            return res.status(201).json({ message: 'Register successfull!' })
        }
        res.status(500).json({ message: 'Failed to register' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' })
    }
})

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        const payload = { _id: user.id, email, password }

        if (user) {
            if (email && await bcrypt.compare(password, user.password)) {
                const token = jwt.sign(payload, process.env.MY_SECRET, { expiresIn: '24h' });

                res.cookie('token', token, {
                    httpOnly: true
                })

                return res.status(201).json({ token, message: 'Login successfull' });
            } else {
                return res.send({ message: 'User not allowed' });
            }
        } else {
            return res.status(500).json({ message: 'User not found' })
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' })
    }
})

app.patch('api/auth/edit-account/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const {email, username, password, name: {firstName, lastName}, address: {city, street, number, zipCode, geolocation: {lat, long}}, phone} = req.body;
        const newData = {email, username, password, name: {firstName, lastName}, address: {city, street, number, zipCode, geolocation: {lat, long}}, phone};

        const updateUser = await User.updateOne({ _id: id }, newData, { upsert: true });

        if (updateUser.modifiedCount == 0) {
            res.status(500).send({ message: 'Failed to find User' });
        }

        res.json(`Found document(s) matched the filter, updated ${updateUser.modifiedCount} document(s)`);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' })
    }
})

app.get('/api/products', async (req, res) => {
    try {
        const products = await Products.find();
        res.json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
})

app.get('/api/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Products.findOne({ _id: id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
})

app.post('/api/products', async (req, res) => {
    try {
        const { title, price, category, description, image } = req.body;
        const newData = { title, price, category, description, image };
        const insertProducts = await Products.create(newData)

        if (insertProducts) {
            return res.status(201).send({ message: 'Data stored successfully' });
        }
        res.status(500).send({ message: 'Failed to store data' });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
})

app.put('/api/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { title, price, category, description, image } = req.body;
        const newData = { title, price, category, description, image };
        const newProduct = await Products.replaceOne({ _id: id }, newData)

        if (newProduct.modifiedCount == 0) {
            res.status(500).send({ message: 'Failed to find data' });
        }

        res.json(`Modified ${newProduct.modifiedCount} document(s)`)
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
})


// patch pending dulu
app.patch('/api/products/:id'), async (req, res) => {
    try {
        const id = req.params.id;
        // const { title, price, category, description, image } = req.body;
        const newData = req.body;
        const product = await Products.find({_id: `${id}`});

        console.log(product)

        for(let key in newData) {
            if(product.hasOwnProperty(key)) {
                product[key] = newData[key];
            }
        }

        // if (product.modifiedCount == 0) {
        //     res.status(500).send({ message: 'Failed to find data' });
        // }

        // res.json(`${product.matchedCount} document(s) matched the filter, updated ${product.modifiedCount} document(s)`)
        res.json({ message: 'Product berhasil diupdate', product });
    }
    catch (error) {

    }
}


// Login page
// app.get('/login', async (req, res) => {

// })







app.listen(PORT, () => {
    console.log(`App listening on port: ${PORT}`);
})