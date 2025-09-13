"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row items-center md:justify-between">
        {/* Logo */}
        <a href="#" className="text-xl font-bold mb-3 md:mb-0 md:order-1">
          Mystery Message
        </a>

        {session ? (
          <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto md:order-2 md:justify-end gap-3">
            {/* Welcome Text */}
            <span className="absolute left-1/2 transform -translate-x-1/2 text-center text-white font-medium">
              Welcome, {user?.username || user?.email}
            </span>

            {/* Dashboard Button */}
            <Link href="/dashboard" className="order-2 md:order-3">
              <Button
                className="w-full md:w-auto bg-slate-100 text-black"
                variant="outline"
              >
                Dashboard
              </Button>
            </Link>

            {/* Connect Now Button */}
            <Link href="/message-users" className="order-3 md:order-4">
              <Button
                className="w-full md:w-auto bg-slate-100 text-black"
                variant="outline"
              >
                Connect Now
              </Button>
            </Link>

            {/* Logout Button */}
            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto bg-red-500 text-white hover:bg-red-600 order-4 md:order-5"
              variant="outline"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link
            href="/sign-in"
            className="w-full md:w-auto mt-3 md:mt-0 md:order-2"
          >
            <Button
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
