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
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { User } from "next-auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function MessageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/get-users");
      if (response.data.users) {
        setUsers(response.data.users || []);
        setFilteredUsers(response.data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }
    const q = query.toLowerCase();
    setFilteredUsers(
      users.filter(
        (user) =>
          user.username?.toLowerCase().includes(q) ||
          user.email?.toLowerCase().includes(q)
      )
    );
  }, [users, query]);

  return (
    <>
      <div className="flex flex-row space-x-2 p-5">
        <Link href="/">
          <Button className="h-12 px-6">Home</Button>
        </Link>
        <input
          type="text"
          placeholder="Search by username or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 w-full px-5 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500"
        />
        <Link href="/dashboard">
          <Button className="h-12 px-6">Dashboard</Button>
        </Link>
      </div>

      <div className="container mx-auto p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Message anyone , Anonymously</h1>
          <p className="text-muted-foreground">
            Browse users and connect without revealing your identity.
          </p>
        </div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <p className="mb-2">Loading users...</p>
            <Loader2 className="h-16 w-16 animate-spin text-blue-500 border-blue-500" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user, index) => (
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
                    <p className="text-sm text-muted-foreground">
                      Available now
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {user.username} is not Accepting messages right now
                    </p>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No users found.</p>
        )}
      </div>
    </>
  );
}

export default MessageUsers;
