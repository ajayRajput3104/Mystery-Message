import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  console.log("reached api/get-messages");
  const user: User = session?.user;
  console.log("user", user);
  if (!session || !session.user) {
    console.log("session not their or user not thier");
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
  console.log("session:", session);

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    console.log("user messages", user);
    if (!user) {
      console.log("user not found");
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (user.length === 0) {
      console.log("no messages for this user");
      return NextResponse.json(
        {
          success: true,
          message: "No messages yet",
          messages: [],
        },
        { status: 200 }
      );
    }
    console.log("user messages", user[0].messages);
    return NextResponse.json(
      {
        success: true,
        message: "All messages fetched successfully",
        messages: user[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Unexpected error occured", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching all messages",
      },
      {
        status: 500,
      }
    );
  }
}
