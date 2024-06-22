import { NextAuthOptions } from 'next-auth'; 
import CredentialsProvider  from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs'; 
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials", 
            name: "credentials", 
            credentials: {
                email: {label: "Email", type: "text"}, 
                password: {label: "Password", type: "Password"}
            }, 
            async authorize(credentials: any): Promise<any> {
                await dbConnect(); 
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier}, 
                            {username: credentials.identifier}
                        ]
                    })
                    // What happen when user is not received 
                    if(!user) {
                        throw new Error('No user found with this email'); 
                    }

                    // What if the user is not registered 
                    if (!user.isVerified) {
                        throw new Error('Please verify your account before login'); 
                    }

                    // check the password from credentials.password and match from the database for this 
                   const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password); 

                   // Check if the password is correct or not 
                   if (isPasswordCorrect) {
                        return user; // this returned user is parameter in jwt in callbacks 
                   } else {
                        throw new Error('Incorrect Password'); 
                   }
                } catch (err: any) {
                    throw new Error(err); 
                }
            }
        })
    ], 
    // Callbacks 
    callbacks: {
        async session({session, token}) {
            if(token) {
                session.user._id = token._id?.toString(); 
                session.user.isVerified = token.isVerified; 
                session.user.isAcceptingMessages = token.isAcceptingMessages; 
                session.user.username = token.username; 
            }
            return session; 
        }, 

        async jwt({token, user}) {
            if(user) {
                token._id = user._id?.toString(); 
                token.isVerified = user.isVerified; 
                token.isAcceptingMessages = user.isAcceptingMessages; 
                token.username = user.username; 
            }
            return token; 
        }

    }, 
    // Pages routing in nextjs 
    pages: {
        signIn: '/sign-in'
    }, 
    session: {
        strategy: "jwt" // Choosing the JSON web tokens strategy in this 
    }, 
    secret: process.env.NEXTAUTH_SECRET, 
}