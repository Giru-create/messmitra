import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MessMitra — AI Hostel Mess Analyzer",
  description: "Anonymous hostel mess feedback in English and Hinglish with AI issue clustering, critical alerts, and before-and-after impact tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
