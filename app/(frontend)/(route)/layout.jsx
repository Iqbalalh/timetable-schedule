import { Inter } from "next/font/google";
import '../(css)/globals.css';
import NextTopLoader from "nextjs-toploader";
const inter = Inter({ subsets: ["latin"] });
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata = {
  title: "Penjadwalan",
  description: "Penjadwalan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head><link rel="icon" href="/logo-unila.png" sizes="any" /></head>
      <body className={inter.className}>
        <SpeedInsights />
        <NextTopLoader showSpinner={false} />
        {children}
      </body>
    </html>
  );
}
