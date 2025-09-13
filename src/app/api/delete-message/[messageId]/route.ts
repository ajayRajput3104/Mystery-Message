import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  const { messageId } = await params;
  await dbConnect();
  console.log("params:", params);
  console.log("messageId:", messageId);

  const session = await getServerSession(authOptions);

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

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: new mongoose.Types.ObjectId(session.user.id) },
      { $pull: { messages: { _id: new mongoose.Types.ObjectId(messageId) } } }
    );
    if (updatedResult.modifiedCount == 0) {
      return NextResponse.json(
        {
          success: false,
          message: "message not found or already deleted",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "message deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error deleting message", error);
    return NextResponse.json(
      {
        success: true,
        message: "failed to delete message",
      },
      {
        status: 500,
      }
    );
  }
}
