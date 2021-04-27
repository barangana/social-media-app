const User = require("../../backend/models/User");
const { SECRET_KEY } = require("../../backend/config");
const { validateRegisterInput } = require("../../util/validators");
const { validateLoginInput } = require("../../util/validators");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // Finds the username
      const user = await User.findOne({ username });
      // Checks if the username exists, if it doesn't, validate errors.
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }
      // Compares the input password and the password from the user.
      const match = await bcrypt.compare(password, user.password);
      // Checks if it matches, if it doesn't, validate errors.
      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }

      const token = generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    // Register function, destructures the registerInput into username, email, password and confirm password.
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      // Finds if the username is in the database, if it is, gives an error validation to the user. If there's no user then creates a new user.
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is taken.", {
          errors: { username: "This username is taken." },
        });
      }

      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();
      const token = generateToken(res);
      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
