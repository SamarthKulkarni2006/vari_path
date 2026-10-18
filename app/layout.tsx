import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./tailwind.css";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { SiteBackground } from "@/components/layout/SiteBackground";
import { ToastContainer } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "VariPath — Clinical Genomics Missense Variant Pathogenicity Predictor",
  description:
    "Machine Learning-Based Pathogenicity Prediction for Missense Genetic Variants. VTU BCS586 Mini Project. Clinical risk dashboard, biochemical red flags, and explainability.",
  keywords: [
    "genomics",
    "pathogenicity",
    "missense variant",
    "TP53",
    "BRCA1",
    "bioinformatics",
    "machine learning",
    "VTU BCS586"
  ]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen flex flex-col antialiased selection:bg-sky-500/20 selection:text-sky-950`}
      >
        <SiteBackground />
        <Navbar />
        <main className="flex-1 max-w-[1100px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col">
          {children}
        </main>
        <ToastContainer />
      </body>
    </html>
  );
}
