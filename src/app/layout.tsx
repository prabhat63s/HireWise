import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HireWise | Smarter engineering hiring",
  description:
    "Next-gen hiring starts here. Smart CV screening and adaptive technical questions that react to candidates in real time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${display.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />

        <main className="flex-1">{children}</main>

        <footer className="border-t border-line/10">
          <div className="mx-auto flex w-full flex-wrap items-center justify-between gap-2 px-6 py-6 text-sm text-muted md:px-10">
            <span className="font-display text-base font-semibold text-ink">HireWise</span>
            <p>
              &copy; {new Date().getFullYear()}{" "}
              <a
                href="https://prabhat-singh-portfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors hover:text-ink"
              >
                Prabhat
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
