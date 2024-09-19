import "@/styles/globals.css";
import type { AppProps } from "next/app";

// Removidas as importações do Material Tailwind

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />; 
}