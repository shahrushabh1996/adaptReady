require('dotenv').config();

require('./database');

const express = require('express');

const app = express();

const auth = require('./auth');
const dishes = require('./dishes');

// Middleware - Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/v1/auth', auth);
app.use('/v1/dish', dishes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('Internal Server Error');
});

app.listen(process.env.PORT || 3000, () => console.log(`Server is running on port ${process.env.PORT || 3000}`));
