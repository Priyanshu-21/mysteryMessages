import { resend } from '@/lib/resend'; 

import verificationEmail from '../../emails/verficationEmail';

import { ApiResponse } from '@/types/apiResponse';

export async function sendVerificationEmail(
    email:string, 
    username: string, 
    verifyCode: string
): Promise<ApiResponse> {

    try {

        // to and from email setup 
        await resend.emails.send({
            from: 'onboarding@resend.dev', 
            to: email, 
            subject: 'Mystery message | verification code',
            react: verificationEmail({username, otp: verifyCode}), 
        })
        return {success: true, message: "Verification email send successfully"};
        
    } catch (emailError) {

        console.error("Error while sending verification Email",emailError);

        return {success: false, message: "Failed to send the verification Email"}; 
         
    }
    
}