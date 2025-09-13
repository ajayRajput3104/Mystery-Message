"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import AutoPlay from "embla-carousel-autoplay";

import messages from "../../message.json";
import { Mail } from "lucide-react";

export default function Home() {
  return (
    <>
      <main className="flex-grow flex flex-col justify-center items-center  px-4 md:px-24  bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Conversations
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Explore Mystery Message -Where your identity remains a secret
          </p>
        </section>
        <Carousel
          plugins={[AutoPlay({ delay: 2000 })]}
          className="w-full max-w-xs"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader>{message.title}</CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start md:space-x-4 space-y-2 md:space-y-0">
                      <Mail className="flex-shrink-0" />
                      <div>
                        <p>{message.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
      <footer className="flex justify-center">
        © 2025 Mystery Message. All Rights Reserved.
      </footer>
    </>
  );
}
