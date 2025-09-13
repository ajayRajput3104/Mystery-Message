"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { User } from "next-auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function MessageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const fetchUsers = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get("/api/get-users");
      if (response.data.users) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching users", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage);
    } finally {
      setIsFetching(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [users]);

  return (
    <>
      <div className="p-4">
        <Link href="/">
          <Button>Home</Button>
        </Link>
      </div>
      <div className="container mx-auto p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Message anyone , Anonymously</h1>
          <p className="text-muted-foreground">
            Browse users and connect without revealing your identity.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user, index) => (
            <Card
              key={index}
              className="flex flex-col justify-between bg-blue-950  text-white"
            >
              <CardHeader>
                <CardTitle>{user.username}</CardTitle>
                <CardDescription></CardDescription>
                <CardAction>
                  <Link href={`/u/${user.username}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-950"
                    >
                      Message Now
                    </Button>
                  </Link>
                </CardAction>
              </CardHeader>
              <CardContent>Email:{user.email}</CardContent>
              <CardFooter>
                {user.isAcceptingMessages ? (
                  <p className="text-sm text-muted-foreground">Available now</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {user.username} is not Accepting messages right now
                  </p>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

export default MessageUsers;
