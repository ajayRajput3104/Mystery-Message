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
        <div className="flex-shrink-0">
          <Link href="/" className="text-xl font-bold mb-3 md:mb-0 md:order-1">
            Mystery Message
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto md:order-2 md:justify-end gap-3 flex-1 mt-2">
          {/* Welcome Text */}
          {session && (
            <span className="flex-1 text-center text-white font-medium truncate">
              Welcome, {user?.username || user?.email}
            </span>
          )}
          <Link href="/" className="order-2 md:order-3">
            <Button
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Home
            </Button>
          </Link>
          {/* Dashboard Button */}
          <Link href="/dashboard" className="order-3 md:order-4">
            <Button
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Dashboard
            </Button>
          </Link>

          {/* Connect Now Button */}
          <Link href="/message-users" className="order-4 md:order-5">
            <Button
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Connect Now
            </Button>
          </Link>
          {session ? (
            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto bg-red-500 text-white hover:bg-red-600 order-5 md:order-6"
              variant="outline"
            >
              Logout
            </Button>
          ) : (
            <Link
              href="/sign-in"
              className="w-full md:w-auto mt-3 md:mt-0 order-5 md:order-6"
            >
              <Button
                className="w-full md:w-auto bg-slate-100 text-black"
                variant="outline"
              >
                Login
              </Button>
            </Link>
          )}

          {/* Logout Button */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
