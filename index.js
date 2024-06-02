const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const auth = require('./controllers/auth');
const protectedRoutes = require('./routes/protected');

dotenv.config();
const DB = process.env.MONGO_URL;


const app = express();

app.use(express.json());
app.use('/api/auth', auth);
app.use('/api', protectedRoutes); // Ajoute la route protégée sous le préfixe /api

// Connection to MongoDB 
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));