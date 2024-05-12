const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const uri = 'mongodb+srv://sumit171204:sumit1712@cluster0.hmeqydy.mongodb.net/uitopia';
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

// Define Schema and Model for UI Elements
const Schema = mongoose.Schema;
const elementSchema = new Schema({
    name: String,
    html: String,
    css: String,
    category: String // Add category field
}, { collection: 'uitopia' }); // specifying collection name
const UIElement = mongoose.model('UIElement', elementSchema);

// API endpoints
app.get('/elements', (req, res) => {
    UIElement.find()
        .then(elements => res.json(elements))
        .catch(err => res.status(400).json('Error: ' + err));
});

app.get('/element/:id', (req, res) => {
    const id = req.params.id;

    UIElement.findById(id)
        .then(element => res.json(element))
        .catch(err => res.status(400).json('Error: ' + err));
});

app.post('/elements/add', (req, res) => {
    const { name, html, css, category } = req.body; // Include category in request body

    const newElement = new UIElement({ name, html, css, category }); // Include category when creating new element

    newElement.save()
        .then(() => res.json('UI element added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
