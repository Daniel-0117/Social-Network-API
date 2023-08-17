const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(routes);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/social-network-api';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
  

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});


