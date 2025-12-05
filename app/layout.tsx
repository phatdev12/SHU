import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import "./globals.css";

const schibsted_Grotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SHU - Clean Air Initiative",
  description: "A comprehensive platform for air-quality monitoring and assessment. Protecting our environment and preserving a greener planet is a responsibility we all share. We are committed to providing you with the most complete and reliable solution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${schibsted_Grotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
