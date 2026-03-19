const mongoose = require('mongoose');
const app = require('./src/app');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vehicle-records';
const PORT = process.env.PORT || 3000;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
