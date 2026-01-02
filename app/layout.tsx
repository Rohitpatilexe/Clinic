import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Joint Care | Best Orthopedic Clinic in Hubli | Dr. Rakesh Patil",
  description: "Expert Knee Replacement and Arthritis treatment in Hubli by Dr. Rakesh Patil (MBBS, MS Ortho). Book an appointment for joint pain relief today.",
  keywords: ["Orthopedic doctor Hubli", "Knee Replacement Hubli", "Joint Care Clinic", "Dr Rakesh Patil", "Arthritis Specialist"],
  openGraph: {
    title: "Joint Care | Best Orthopedic Clinic in Hubli",
    description: "Expert Knee Replacement and Arthritis treatment in Hubli by Dr. Rakesh Patil.",
    type: "website",
    locale: "en_IN",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} font-sans bg-background text-foreground min-h-screen flex flex-col antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
