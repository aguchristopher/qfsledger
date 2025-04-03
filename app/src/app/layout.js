import { Inter, Lato } from "next/font/google";
import "./globals.css";

const inter = Lato({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: '400'
});

export const metadata = {
  title: "QFS Ledger - Advanced Crypto Portfolio Tracking",
  description: "Track your crypto assets with precision",
  keywords: ["crypto", "portfolio", "tracking", "cryptocurrency", "ledger"],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
