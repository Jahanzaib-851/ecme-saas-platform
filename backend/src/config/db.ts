import mongoose from 'mongoose';

/**
 * MongoDB Connection Function
 * Ye function .env se URI uthayega aur database se connect karega.
 */
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.error("❌ Error: MONGO_URI is not defined in .env file!");
      process.exit(1);
    }

    // Connection options modern Mongoose mein default hote hain
    const conn = await mongoose.connect(mongoURI);

    console.log(`-------------------------------------------`);
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`📂 Database: ${conn.connection.name}`);
    console.log(`-------------------------------------------`);

  } catch (error: any) {
    console.error(`❌ Database Connection Failed!`);
    console.error(`Error: ${error.message}`);

    // Agar connection fail ho jaye toh server ko band kar dena behtar hai
    process.exit(1);
  }
};

// Connection events (Monitoring ke liye)
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB Disconnected. Trying to reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error(`🔥 MongoDB Runtime Error: ${err}`);
});

export default connectDB;