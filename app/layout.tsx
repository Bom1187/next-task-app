import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  subsets: ["thai"],
  weight: ["100","200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Task App by Bombay SAU",
  description: "เว็ปแอปพลิเคชั่นบันทึกงานท่ต้องทำ",
  keywords: ["Task ", "App", "งาน", "แอปพลิเคชั่น"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${prompt.className}`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
