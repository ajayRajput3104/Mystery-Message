import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["delivered@resend.dev", email],
      subject: "Mystery Message | Verification Code",
      react: VerificationEmail({ username: username, otp: verifyCode }),
    });

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.log("Error sending Verification email", error);
    return {
      success: false,
      message: "Failed to send Verification email",
    };
  }
}
