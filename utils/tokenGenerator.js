const crypto = require("crypto");

function generateToken(bytes) {
  // Generate a random 32-byte text
  const randomText = crypto.randomBytes(bytes);
  console.log(randomText);
  // Convert the random text to a hexadecimal string
  const token = randomText.toString("hex");
  console.log(token);
  return token;
}
module.exports = generateToken;
