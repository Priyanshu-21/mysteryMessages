import mongoose from 'mongoose'; 

type connectionObject = {
    isConnected?: number; 
}; 

const connection: connectionObject = {}

async function dbConnect(): Promise<void> {
    // If the database connection is already there 
    if (connection.isConnected) {
        console.log("Database connection already there"); 
        return; 
    }

    try {

        const db = await mongoose.connect(process.env.MONGODB_URI || '', {});

        // Try to console the whole db varible and check what are the new things we are getting 
        connection.isConnected = db.connections[0].readyState
        
        console.log("DB is connected successfully");
        

    } catch (error) {

        console.log("DB connection failed", error);
        

        process.exit(1)
    }
}

export default dbConnect; 