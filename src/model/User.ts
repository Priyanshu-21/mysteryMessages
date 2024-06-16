import mongoose, {Schema, Document} from "mongoose"; 

// Creating interfaces of message 
export interface Message extends Document {
    content: string; 
    createdAt: Date;
};

// Creating Message Schema (Mongoose Schema) 
const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String, 
        required: true
    }, 
    createdAt: {
        type: Date, 
        required: true, 
        default: Date.now
    }

});

// Creating interface of User 
export interface User extends Document { 

    username: string
    email: string; 
    password: string; 
    verifyCode: string; 
    verifyCodeExpiry: Date; 
    isVerified: boolean; 
    isAcceptingMessage: boolean; 
    messages: Message[];

};

// Creating Schema for User Document 
const UserSchema = new Schema({
    username: {
        type: String, 
        required: [true, "Username is required"], 
        trim: true, 
        unique: true
    }, 
    email: { 
        type: String, 
        reuired: [true, "Eamil is required"], 
        unique: true, 
        match: [/.+\@.+\..+/, "Please enter a vaild email address"]
    }, 
    password: {
        type: String, 
        required: [true, "Password is required"]
    }, 
    verifyCode: {
        type: String, 
        required: [true, "Verification of code is reuired"]
    }, 
    verifyCodeExpiry: {
        type: Date, 
        required: [true, "Verify code expiry is required"]
    }, 
    isVerified: {
        type: Boolean, 
        default: false
    }, 
    isAcceptingMessage: {
        type: Boolean, 
        default: false
    }, 
    messages: [MessageSchema]

});

// Export the database in nextjs 
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel; 