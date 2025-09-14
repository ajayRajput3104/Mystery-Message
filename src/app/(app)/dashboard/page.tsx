"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/models/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import {
  AcceptMessagesResponse,
  ApiResponse,
  GetMessagesResponse,
} from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, Lock, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function DashBoardComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    console.log("inside handleDeleteMessage:", messageId);
    console.log("before delete nessages", messages);
    setMessages(messages.filter((message) => message._id !== messageId));
    console.log("after delete messages:", messages);
  };
  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      isAcceptingMessages: true,
    },
  });

  const { register, watch, setValue } = form;
  const isAcceptingMessages = watch("isAcceptingMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response =
        await axios.get<AcceptMessagesResponse>(`/api/accept-messages`);
      setValue("isAcceptingMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          "Failed to fetch accept message status"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response =
          await axios.get<GetMessagesResponse>("/api/get-messages");

        setMessages(response.data.messages || []);
        if (refresh && response.data.messages.length !== 0) {
          toast.message(" Showing latest Messages");
        } else {
          toast.message(response.data.message);
        }
      } catch (error) {
        console.log("error fetcing message", error);
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data.message || "Failed to fetch messages"
        );
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("api/accept-messages", {
        isAcceptingMessages: !isAcceptingMessages,
      });
      setValue("isAcceptingMessages", !isAcceptingMessages);
      toast.message(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          "Failed to update accept message status"
      );
    }
  };

  const username = session?.user?.username ?? "";
  //TODO : do more research
  //could have done without useEffect but window does'nt exist during SSR
  // so it gave error so wrap it inside a client side check like a hook use-effect is perfect

  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    }
  }, []);

  const profileUrl = baseUrl ? `${baseUrl}/u/${username}` : "";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.message("URL copied to clipboard");
  };

  if (!session || !session.user) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
        {/* Icon */}
        <Lock className="w-16 h-16 text-gray-500" />

        {/* Message */}
        <h2 className="text-xl font-semibold text-gray-800">
          You’re not logged in
        </h2>
        <p className="text-gray-600">
          Please login to access your dashboard and connect with others.
        </p>

        {/* Login Button */}
        <a href="/sign-in">
          <button className="px-6 py-2 rounded-2xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow">
            Login
          </button>
        </a>
      </div>
    );
  }
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("isAcceptingMessages")}
          checked={isAcceptingMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {isAcceptingMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default DashBoardComponent;
