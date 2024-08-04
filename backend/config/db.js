const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGO_URI || 'mongodb+srv://karansaini452002:E23xD8ImCjOlYKUx@cluster0.edm3kvx.mongodb.net/';
    if (!dbURI) {
      throw new Error('MONGO_URI environment variable is not set');
    }
    console.log(`Mongo URI: ${dbURI}`); // Log the URI for debugging
    const conn = await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.underline.bold);
    process.exit(1); // exit process with failure
  }
};

module.exports = connectDB;

