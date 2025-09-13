import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();
  console.log("got message:", content, "for user:", username);
  try {
    console.log("finding user");
    console.log("Username to search:", username, typeof username);
    const user = await UserModel.findOne({ username });
    if (!user) {
      console.log("user not found");
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
    console.log("user found,constructing message");

    const newMessage = {
      content,
      createdAt: new Date(),
    };
    console.log("message ready:", newMessage);
    console.log("pushing message");
    user.messages.push(newMessage as Message);
    console.log("message pushed");
    console.log("savinf message");
    await user.save();
    console.log("message saved");
    console.log("message delivered");
    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to send message", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error sending message",
      },
      {
        status: 500,
      }
    );
  }
}
