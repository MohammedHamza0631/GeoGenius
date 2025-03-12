import { Inter } from "next/font/google";
import { QuizProvider } from "@/lib/quiz-context";
import { ThemeProvider } from "@/components/theme-provider";
import { SecurityProvider } from "@/components/security-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Capital Cities Quiz",
  description: "Test your knowledge of world capital cities",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        
        <link
  rel="icon"
  href="/icon?<generated>"
  type="image/<generated>"
  sizes="<generated>"
        />
        <link
  rel="apple-touch-icon"
  href="/apple-icon?<generated>"
  type="image/<generated>"
  sizes="<generated>"
/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QuizProvider>
            <SecurityProvider>
              {children}
            </SecurityProvider>
          </QuizProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
