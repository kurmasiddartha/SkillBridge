import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const name = process.env.ADMIN_NAME || "SkillBridge Admin";
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error("ADMIN_EMAIL and ADMIN_PASSWORD are required in .env");
      process.exit(1);
    }

    const existingAdmin = await User.findOne({ email }).select("+password");

    if (existingAdmin) {
      existingAdmin.name = name;
      existingAdmin.role = "ADMIN";
      existingAdmin.password = password;
      await existingAdmin.save();
      console.log(`Admin user updated: ${email}`);
      process.exit(0);
    }

    await User.create({
      name,
      email,
      password,
      role: "ADMIN"
    });

    console.log(`Admin user created: ${email}`);
    process.exit(0);
  } catch (error) {
    console.error("Admin seed failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
