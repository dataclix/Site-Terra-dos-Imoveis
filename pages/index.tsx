// pages/index.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Conteúdo principal */}
      <main className="flex-grow flex items-center justify-center">
        <h1 className="text-4xl font-bold">Olá, Terra dos Imóveis!</h1>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
