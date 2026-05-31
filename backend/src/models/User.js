import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
    select: false
  },
  branch: {
    type: String,
    trim: true
  },
  year: {
    type: Number
  },
  skillsKnown: {
    type: [String],
    default: []
  },
  skillsWanted: {
    type: [String],
    default: []
  },
  skillPoints: {
    type: Number,
    default: 100
  },
  role: {
    type: String,
    enum: ["STUDENT", "ADMIN"],
    default: "STUDENT"
  },
  isMentor: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
