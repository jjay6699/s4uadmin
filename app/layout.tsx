import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { ToastContainer } from "@/components/common/Toast";

export const metadata: Metadata = {
  title: "Steroids4u - Best EU Online Steroid Shop",
  description: "Buy steroids online from the best EU online steroid shop. Fast worldwide shipping, authentic products, and 24/7 customer support.",
  keywords: "steroids, anabolic steroids, buy steroids online, EU steroids",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-white text-dark-text" suppressHydrationWarning>
        <CartProvider>
          <ToastProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <ToastContainer />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
