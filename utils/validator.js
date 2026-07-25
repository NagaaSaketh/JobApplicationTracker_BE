const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstname, lastname, email } = req.body;
  if (!firstname || !lastname) {
    throw new Error("Invalid name");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email address");
  }
};

module.exports = { validateSignUpData };
