import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    //check if user with username already exist
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already taken",
        },
        {
          status: 400,
        }
      );
    }

    //check if user with this email exist
    const existingUserByEmail = await UserModel.findOne({ email });

    //create verify code and expiry in case user is not verified or new user
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpiry = new Date();
    verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);

    if (existingUserByEmail) {
      //user exist
      if (existingUserByEmail.isVerified) {
        //user is already verified
        return NextResponse.json(
          {
            success: false,
            message: "User already exist with this email",
          },
          {
            status: 400,
          }
        );
      }
      //if user is not verified-update credentials and save
      const hashedPassword = await bcrypt.hash(password, 10);

      existingUserByEmail.password = hashedPassword;
      existingUserByEmail.verifyCode = verifyCode;
      existingUserByEmail.verifyCodeExpiry = verifyCodeExpiry;

      await existingUserByEmail.save();
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });
      await newUser.save();
    }
    //send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    //if email not sent
    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }
    console.log("verification mail send", emailResponse);
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully.Please verify your email",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("Error registering user", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
