import { Inter } from "next/font/google";
import type { Metadata } from "next";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import { DialogsProvider } from "@/components/browser";
import { DialogsProvider as IconDialogsProvider } from "@/components/icon";

export const metadata: Metadata = {
  // Metadata
  title: "Portfolio | Andrea De Laurentis | Front-end Developer",
  description:
    'Ciao! Sono Andrea De Laurentis, conosciuto online come "Riko". Sono un front-end developer appassionato di programmazione web e design moderno. Vieni a scoprire le mie idee pazze e i progetti che ho realizzato.',
  icons: {
    icon: "https://riko-storage.sirv.com/favicon.png",
  },

  // Open Graph
  openGraph: {
    title: "Portfolio | Andrea De Laurentis | Front-end Developer",
    description:
      'Ciao! Sono Andrea De Laurentis, conosciuto online come "Riko". Sono un front-end developer appassionato di programmazione web e design moderno. Vieni a scoprire le mie idee pazze e i progetti che ho realizzato.',
    type: "website",
    url: "https://andreadelau-portfolio.vercel.app/",
    images: [
      {
        url: "https://dynamic-og-image-generator.vercel.app/api/generate?title=Portfolio+%7C+Andrea+De+Laurentis+%7C+Front-end+Developer&author=Andrea+%22Riko%22+De+Laurentis&websiteUrl=andreadelau-portfolio.vercel.app&avatar=https%3A%2F%2Fvercel.com%2Fapi%2Fwww%2Favatar%3Fu%3Driko-onvercel%26s%3D128&theme=nightOwl",
        width: 1200,
        height: 630,
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Andrea De Laurentis | Front-end Developer",
    description:
      'Ciao! Sono Andrea De Laurentis, conosciuto online come "Riko". Sono un front-end developer appassionato di programmazione web e design moderno. Vieni a scoprire le mie idee pazze e i progetti che ho realizzato.',
    images: [
      {
        url: "https://dynamic-og-image-generator.vercel.app/api/generate?title=Portfolio+%7C+Andrea+De+Laurentis+%7C+Front-end+Developer&author=Andrea+%22Riko%22+De+Laurentis&websiteUrl=andreadelau-portfolio.vercel.app&avatar=https%3A%2F%2Fvercel.com%2Fapi%2Fwww%2Favatar%3Fu%3Driko-onvercel%26s%3D128&theme=nightOwl",
        width: 1200,
        height: 630,
      },
    ],
  },

  // Keywords
  keywords: [
    "Andrea De Laurentis",
    "Andrea De Laurentis portfolio",
    "Riko De Laurentis",
    "Riko De Laurentis portfolio",
    "Riko",
    "Riko portfolio",
    "andrea de laurentis",
    "andrea de laurentis portfolio",
    "front-end developer",
    "front-end",
    "portfolio front-end",
    "programmazione web",
    "sviluppo frontend",
    "design moderno",
    "grafica web",
    "web developer",
    "developer",
    "developer portfolio",
  ],

  // Author
  authors: [
    {
      name: "Andrea De Laurentis",
      url: "https://andreadelau-portfolio.vercel.app/",
    },
  ],

  // Robots
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={inter.className} style={{ backgroundColor: "#000" }}>
        <DialogsProvider>
          <IconDialogsProvider>{children}</IconDialogsProvider>
        </DialogsProvider>
      </body>
    </html>
  );
}
