import type { Metadata } from "next";
import { Italiana, Nanum_Gothic } from "next/font/google";
import "./globals.css";

// "Marko" from the Figma file is not a free web font; Italiana is the closest free display face.
const display = Italiana({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const body = Nanum_Gothic({
  variable: "--font-body",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swiss Media Center — What lies beyond",
  description:
    "Every better life begins with a single decision. We help you make yours, and see it through.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <div aria-hidden className="grain" />
      </body>
    </html>
  );
}
