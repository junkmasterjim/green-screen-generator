import { cn } from "@/lib/utils";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

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
          <span className="text-xl font-bold tracking-tighter leading-[1.1]">
            Green Screen Generator
          </span>
          <p className="text-sm text-muted-foreground tracking-tight">
            Made with 🥩 by Noah Pittman
          </p>
        </div>
        {children}
      </body>
    </html>
  );
}
