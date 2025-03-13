const express = require('express');
require('dotenv').config()
const path = require('path');
const { default: mongoose } = require('mongoose');
var cors = require('cors')
const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json(),cors({ origin: '*' }));
const uri = process.env.MONGODB_URL; 

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 30000, })
 const db=mongoose.connection;

db.once('open', () => console.log("Connected"))

app.get('/', (req, res) => {
  res.send('Hello, this is your Express app!, btw your server running on perfectly');
});

// app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const userRoute = require('./routes/UserRoute') 
app.use('/user', userRoute, cors())

const houseRoute = require('./routes/HouseRoute') 
app.use('/house', houseRoute, cors())

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
