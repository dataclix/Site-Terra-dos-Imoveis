// components/Banner.tsx
import React from "react";
import Image from "next/image";

const Banner: React.FC = () => {
  return (
    <section className="relative h-screen"> {/* Mudei a altura para h-screen */}
      {/* Imagem de fundo */}
      <Image
        src="/images/saojoao.webp" 
        alt="Cidade Histórica"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="absolute"
      />

      {/* Degradê sobreposto */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#f4505a] to-[#a84f9f] opacity-80"></div>

      {/* Conteúdo dentro do banner */}
      <div className="absolute inset-0 flex items-center justify-center text-white text-center">
        <div>
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-4">
            {/* Seu texto principal aqui */}
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl">
            {/* Seu texto secundário aqui */}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Banner;