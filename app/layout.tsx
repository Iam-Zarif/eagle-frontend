import "./globals.css";
import ReduxProviders from "@/providers/ReduxProviders";
import Navbar from "@/shared/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eagle 3D Streaming",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen  bg-linear-to-br from-gray-950 to-gray-900">
        <ReduxProviders>
          <Navbar/>
           {children}
           </ReduxProviders>
      </body>
    </html>
  );
}
