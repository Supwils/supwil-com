import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderNav from "@/components/Header/HeaderNav";
import { ThemeProvider } from "@/components/ThemeProvider";
import MusicPlayerold from "@/components/MusicPlayer(old)";
import MusicPlayer from "@/components/Music/MusicPlayer";
import Footer from "@/components/Footer/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import FloatingAdminButton from "@/components/Auth/FloatingAdminButton";
import Chat from "@/components/Home/Chat";
import QueryProvider from "@/components/Providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Supwils",
  description: "Personal website of Huahao(Wilson) Shang - It's not only a developer showcase but more of a digital garden for my thoughts and ideas",
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              <HeaderNav />
              <main className="pt-20">
                {children}
              </main>
              <MusicPlayer />
              <Chat />
              <FloatingAdminButton />
              <Footer />
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
