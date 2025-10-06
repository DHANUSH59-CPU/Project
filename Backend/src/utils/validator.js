const validator = require("validator");

const validate = (data) => {
  const { emailId, password } = data;

  if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Invalid Email");
  }

  if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Weak Password");
  }
};

module.exports = validate;
