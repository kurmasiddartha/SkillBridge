import mongoose from "mongoose";
import dns from "dns";

const connectDB = async () => {
  const originalServers = dns.getServers();
  try {
    // Temporarily use custom DNS resolvers to reliably resolve MongoDB Atlas SRV records
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
    
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  } finally {
    // Restore system's default DNS servers to avoid breaking other outbound API calls
    try {
      if (originalServers && originalServers.length > 0) {
        dns.setServers(originalServers);
      }
    } catch (restoreError) {
      console.warn("Could not restore original DNS servers:", restoreError.message);
    }
  }
};

export default connectDB;
