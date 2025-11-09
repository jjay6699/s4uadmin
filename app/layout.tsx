import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { ToastContainer } from "@/components/common/Toast";
import { AdminProvider } from "@/contexts/AdminContext";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";

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
        <AdminProvider>
          <CartProvider>
            <ToastProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
              <ToastContainer />
            </ToastProvider>
          </CartProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
