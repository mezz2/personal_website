import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books",
  description: "Whatever I'm reading, have read, or keep meaning to get to.",
};

export default function BooksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
