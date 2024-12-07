require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const connectDB = require('./server/config/db');
const Products = require('./server/models/Products');
const Cart = require('./server/models/Cart');
const User = require('./server/models/User');


const app = express();
const port = 3000 || process.env.port;


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

app.get('/products', async (req, res) => {
    try{
        const products = await Products.find();
        return products;
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
})

app.get('/products/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const products = await Products.findOne({ _id: id });
        return products;
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
})

app.post('/products', async (req, res) => {
    try {
        const { title, price, category, description, image } = req.body;
        const newData = { title, price, category, description, image };
        const insertProducts = await Products.create(newData)

        if(insertProducts) {
            return res.status(201).send({ message: 'Data stored successfully' });
        }
        res.status(500).send({ message: 'Failed to store data' });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
})


// Login page
// app.get('/login', async (req, res) => {

// })







app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
})