const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    /** User display name shown in the UI. */
    name: {
      type: String,
      required: true,
      trim: true,
    },
    /** Unique email address used for login. */
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    /** Bcrypt-hashed password, never returned in API responses. */
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    /** User role that controls route permissions. */
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    /** Last issued refresh token used to invalidate sessions on logout. */
    refreshToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

/**
 * Hashes password before saving if it changed.
 */
userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

/**
 * Compares a plain password with stored hash.
 */
userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
