/**
 * Aqui se importa todo y corre la Applicatiob
 */

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const tracksRoutes = require('./routes/tracks.routes')

// Incializaciones
const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));


// routes
app.use(tracksRoutes);


app.listen(3000);
console.log("server on port 3000");