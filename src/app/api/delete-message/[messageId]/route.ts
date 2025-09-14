import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/models/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { Types } from "mongoose";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  const { messageId } = await params;
  await dbConnect();

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
    const user = await UserModel.findById(session.user._id);
    if (!user) {
      return NextResponse.json(
        {
          success: false,

          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    const messageDoc = user.messages.id(messageId);
    if (!messageDoc) {
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
    messageDoc.deleteOne();
    await user.save();
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
