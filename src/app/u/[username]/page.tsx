"use client";

import { messageSchema } from "@/schemas/messageSchema";
import {
  AcceptMessagesResponse,
  ApiResponse,
  SuggestMessagesResponse,
} from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function SendMessage() {
  const params = useParams<{ username: string }>();

  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isSuggestingMessage, setIsSuggestingMessage] = useState(false);
  const [suggestedMessage, setSuggestedMessage] = useState<string[]>([]);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const { register, watch, setValue } = form;
  const message = watch("content");

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSendingMessage(true);
    try {
      console.log("message sending started");
      const response = await axios.get<AcceptMessagesResponse>(
        "/api/accept-messages"
      );
      console.log("message sending started");
      if (response.data.isAcceptingMessages) {
        console.log("message to be sent:", data.content);
        const res = await axios.post<ApiResponse>(`/api/send-message`, {
          username: params.username,
          content: data.content,
        });
        toast.success(res.data.message);
      } else {
        toast.error("User is not accepting messages");
      }
    } catch (error) {
      console.error("Error sending message", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.message ?? "something unexpected occured";
      toast.error(errorMessage);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleSuggestMessage = async () => {
    setIsSuggestingMessage(true);
    try {
      const response = await axios.get<SuggestMessagesResponse>(
        "/api/suggest-messages"
      );
      const msgStr = response.data.result;
      const messages = msgStr.split("||").map((message) => message.trim());
      setSuggestedMessage(messages);
    } catch (error) {
      console.log("Error fetching message(u/username)", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage ?? "Failed  to suggest message");
    } finally {
      setIsSuggestingMessage(false);
    }
  };
  useEffect(() => {
    handleSuggestMessage();
  }, []);

  return (
    <>
      <div className="p-4">
        <Link href="/">
          <Button>Home</Button>
        </Link>
      </div>
      <div className="flex flex-col items-center  min-h-screen py-10 space-y-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full max-w-xl"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2">
                    Send Anonymous Message to {params.username}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...register("content")}
                      type="text"
                      placeholder="type your message.."
                      onChange={(e) => setValue("content", e.target.value)}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 mt-1" />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isSendingMessage}
                className="px-6 py-2"
              >
                {isSendingMessage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please Wait
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </div>
          </form>
        </Form>
        <Separator />
        <div className="flex flex-col items-start space-y-2 w-full max-w-xl">
          <Button onClick={handleSuggestMessage} className="items-start">
            {isSuggestingMessage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </>
            ) : (
              "Suggest Message"
            )}
          </Button>
          <p>Click on any message below to select it</p>
        </div>
        <Card className="space-y-4 w-full max-w-xl">
          <CardHeader>
            <CardTitle className="font-bold">Messages</CardTitle>
            <CardDescription>Card Description</CardDescription>
            <CardAction>Card Action</CardAction>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {suggestedMessage &&
              suggestedMessage.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={(e) => setValue("content", message)}
                  className="w-full h-auto text-left break-words overflow-hidden whitespace-normal"
                >
                  {message}
                </Button>
              ))}
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default SendMessage;
