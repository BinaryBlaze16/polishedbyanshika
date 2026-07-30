const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'PolishedByAnshika_SuperSecret_JWT_Key_2024', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
