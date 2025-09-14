import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const users = await UserModel.find(
      {},
      "username email isAcceptingMessages"
    );
    if (!users || users.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No users",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Users retrieved successfully",
        users,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("failed to retrieve users", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve users",
      },
      {
        status: 500,
      }
    );
  }
}
