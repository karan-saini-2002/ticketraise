const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./backend/models/userModel'); // Correct the path to point to backend/models

// Connect to MongoDB
mongoose.connect('mongodb+srv://karansaini452002:E23xD8ImCjOlYKUx@cluster0.edm3kvx.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected...');
  updatePasswords();
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

async function updatePasswords() {
  const users = await User.find();
  for (const user of users) {
    if (!user.password.startsWith('$2a$')) { // Check if the password is already hashed
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
      await user.save();
      console.log(`Updated password for user: ${user.email}`);
    }
  }
  console.log('Password update completed.');
}
