//My first api Code 
import dbConnect from "@/lib/dbConnect";
import UserModel from '@/model/User'; 
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail'; 
import { Elsie } from "next/font/google";

// Post request in typeScript with route as /api/sign-up  
async function POST(request: Request) {
    await dbConnect(); 

    try {
        const {username, email, password} = await request.json();
        // Need to implement the algorithm for the OTP logic 
        const existingUserVerifiedByUsername = await UserModel
        .findOne({
            username, 
            isVerified: true
        }); 
        
        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false, 
                    message: "Username is already taken"
                }, {status: 400}
            ); 
        }

        // Set the username for verified email 
        const existingUserByEmail = await UserModel.findOne({
            email
        }); 

       const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); 

        if (existingUserByEmail) {
            // When user is connecting for the first time 
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false, 
                    message: "User is already existed with this email "
                }, {status: 400}); 
            } else {
                const hashedPassword = await bcrypt.hash(password, 10); 
                existingUserByEmail.password = hashedPassword; 
                existingUserByEmail.verifyCode = verifyCode; 
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); 

                // Need to save the user 
               await existingUserByEmail.save();
            }
        } else {
            // Need to decrypt the password for this 
            const hashedPassword = bcrypt.hash(password, 10); 
            const expiryDate = new Date(); 
            expiryDate.setHours(expiryDate.getHours() + 1); // increase the expiry code value to 1 hrs 
            
            // How to add new User to the database 
            const newUser = new UserModel({
                username, 
                email, 
                password: hashedPassword, 
                verifyCode,  
                verifyCodeExpiry: expiryDate,  
                isVerified: false,  
                isAcceptingMessage: true,
                messages: [], 
            });

            await newUser.save();
        }

        // Send verification Email 
        const emailResponse = await sendVerificationEmail(
            email, 
            username, 
            verifyCode
        );
        
        if(!emailResponse.success) {
            return Response.json({
                success: false, 
                message: emailResponse.message
            }, {status: 500}); 
        }
        // How to register the user 
        return Response.json({
            success: true, 
            message: "User registered Successfully, Please verify your email "
        }, {status: 201});


    } catch (error) {
        console.error('Error registering user', error);
        return Response.json(
            {
                success: false, 
                message: "Error registering user", 
            }, 
            {
                status: 500
            }
        )
    }
}

