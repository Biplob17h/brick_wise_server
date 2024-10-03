import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log(`mongodb connected`.magenta.bold);
  } catch (error) {
    console.log("Error connecting mongodb".red.bold);
  }
};

export default connectDb;
