import type { Metadata } from "next";
import { Providers } from "@/providers/Providers";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/shared/ui/ToastProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for managing your application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {/* <AuthProvider> */}
            {children}
            <ToastProvider />
          {/* </AuthProvider> */}
        </Providers>
      </body>
    </html>
  );
}
