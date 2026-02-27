import express, { Application } from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDB from "./src/config/db";
import User from "./src/model/User.model";
import userRoutes from "./src/routes/user.routes";
import staffRoutes from "./src/routes/Employee.routes";
import freezerRoutes from "./src/routes/freezer.routes";
import windowAreaRoutes from "./src/routes/windowArea.routes";
import toiletRoutes from "./src/routes/toilet.routes";
import binRoutes from "./src/routes/bin.routes";
import setupRoutes from "./src/routes/setup.routes";
import notificationRoutes from "./src/routes/notification.routes";
import temperatureRoutes from "./src/routes/temperature.routes";
import toiletCleanRoutes from "./src/routes/toiletClean.routes";

dotenv.config();

const app: Application = express();

app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/freezers", freezerRoutes);
app.use("/api/window-areas", windowAreaRoutes);
app.use("/api/toilets", toiletRoutes);
app.use("/api/bins", binRoutes);
app.use("/api/setup", setupRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/temperature", temperatureRoutes);
app.use("/api/toilet-clean", toiletCleanRoutes);

/* --------------------------------
   🔥 Seed Super Manager (No OTP)
----------------------------------*/
const seedSuperUser = async (): Promise<void> => {
  try {
    const email = process.env.SUPER_ADMIN_EMAIL as string;
    const password = process.env.SUPER_ADMIN_PASSWORD as string;

    if (!email || !password) {
      console.log("⚠ SUPER_ADMIN_EMAIL or PASSWORD not set in .env");
      return;
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        name: "Super Manager",
        email,
        password: hashedPassword,
        role: "manager",
      });

      console.log("✅ Super manager created");
    } else {
      console.log("ℹ Super manager already exists");
    }
  } catch (error: any) {
    console.error("Seed error:", error.message);
  }
};

/* --------------------------------
   🚀 Start Server
----------------------------------*/
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    await seedSuperUser();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error: any) {
    console.error("Server start failed:", error.message);
    process.exit(1);
  }
};

startServer();