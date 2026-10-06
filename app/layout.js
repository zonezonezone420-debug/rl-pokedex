import "./globals.css";
import MobxProvider from "./Mobx";

export const viewport = {
  themeColor: "#E4383B",
};

export const metadata = {
  title: "RL Pokedex",
  description: "Real Life Pokedex - snap it, dex it",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <MobxProvider>{children}</MobxProvider>
      </body>
    </html>
  );
}
