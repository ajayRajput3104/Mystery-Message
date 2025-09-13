import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  const user: User = session?.user;

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = user._id;

  const { isAcceptingMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: isAcceptingMessages },
      { new: true }
    );
    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update user accept-message status",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "User accept-message status updated successfully",
        updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to update user accept-message status", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user accept-message status",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  console.log("arrived at fetch message status");
  const session = await getServerSession(authOptions);
  console.log("session acquired", session);
  const user: User = session?.user;
  console.log("user aquired acquired", user);

  if (!session || !session.user) {
    console.log("session  or user absent");
    return NextResponse.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }
  console.log("session and user present");
  const userId = user._id;
  console.log("userId acquired", userId);
  try {
    console.log("real user finding");
    const currUser = await UserModel.findById(userId);
    console.log("real user found", currUser);
    if (!currUser) {
      console.log("real user not  found");
      return NextResponse.json(
        {
          successs: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    console.log("real user found", currUser);
    return NextResponse.json(
      {
        successs: true,
        message: "User accept-message status retrieved successfully",
        isAcceptingMessages: currUser.isAcceptingMessages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to get user accept-message status", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error getting user accept-message status",
      },
      {
        status: 500,
      }
    );
  }
}
