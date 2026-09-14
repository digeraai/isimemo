import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "isiMemo — Digital Invitations, Personalized for Every Guest",
  description:
    "Pick a template, add your guest list, and isiMemo generates a personalized digital invitation and RSVP link for every guest — one price, up to 500 guests.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f8f6f3] min-h-screen">{children}</body>
    </html>
  );
}
