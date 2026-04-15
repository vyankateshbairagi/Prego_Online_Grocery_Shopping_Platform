import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected")
        );
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "greencart"

        });

        console.log("Database Connected Successfully");
    } catch (error) {
        console.log("Database Connection Failed");
        console.error(error.message);
    }
}


export default connectDB;