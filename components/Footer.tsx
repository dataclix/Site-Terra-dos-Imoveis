// components/Footer.tsx
import Image from "next/image";
import Link from "next/link";
import { FaEnvelope, FaPhone, FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0d0f10] text-white p-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo e marca */}
        <div className="flex flex-col items-start">
          <Image
            src="/images/terra-logo.webp" // Substitua pelo caminho correto do logo
            alt="Terra dos Imóveis"
            width={150}
            height={50}
          />
        </div>

        {/* Links de navegação */}
        <div>
          <h4 className="font-bold text-lg mb-4">Terra dos Imóveis</h4>
          <ul>
            <li className="mb-2">
              <Link href="/" legacyBehavior>
                <a>Home</a>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/imoveis" legacyBehavior>
                <a>Encontre seu imóvel</a>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/quemsomos" legacyBehavior>
                <a>Quem Somos</a>
              </Link>
            </li>
            <li>
              <Link href="/contato" legacyBehavior>
                <a>Contato</a>
              </Link>
            </li>
          </ul>
        </div>

        {/* Informações de Contato */}
        <div>
          <h4 className="font-bold text-lg mb-4">Contato</h4>
          <ul>
            <li className="mb-2 flex items-center">
              <FaEnvelope className="mr-2" />{" "}
              <a href="mailto:contato@terradosimoveis.com.br" aria-label="Enviar email">
                contato@terradosimoveis.com.br
              </a>
            </li>
            <li className="mb-2 flex items-center">
              <FaMapMarkerAlt className="mr-2" /> São João del Rei - MG
            </li>
            <li className="mb-2 flex items-center">
              <FaPhone className="mr-2" /> (32) 32 9128-2406
            </li>
            <li className="flex items-center">
              <FaWhatsapp className="mr-2" /> (32) 32 9128-2406
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
