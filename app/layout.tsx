import { cn } from "@/lib/utils";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Green Screen Generator",
  description: "Uses a Replicate API to generate green screens based on video.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-green-200")}>
        <div className="flex items-center justify-between p-6 py-2">
          <Link href={"/"} className="flex items-center gap-2">
            <div className="size-8">
              <Image
                src={"/logo.png"}
                alt="logo"
                width={512}
                height={512}
                className="object-cover rounded w-full h-full"
              />
            </div>

            <span className="text-xl font-semibold tracking-tighter leading-[1.1]">
              green
            </span>
          </Link>

          <p className="text-xs text-muted-foreground tracking-tight leading-[1.2]">
            Made with 🥩 by{" "}
            <Link target="_blank" href={"https://npitt.dev"}>
              Noah Pittman
            </Link>
          </p>
        </div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
