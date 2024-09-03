const { hash } = require('bcryptjs');

// Function to hash a password
async function hashPassword(password) {
  const hashedPassword = await hash(password, 12);
  console.log(`Hashed Password: ${hashedPassword}`);
}

// Replace 'your-password-here' with the password you want to hash
const passwordToHash = 'cindy123';

hashPassword(passwordToHash)
  .then(() => {
    console.log('Password hashed successfully.');
  })
  .catch(err => {
    console.error('Error hashing password:', err);
  });
