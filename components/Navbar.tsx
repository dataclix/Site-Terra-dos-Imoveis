// components/Navbar.tsx
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="w-full bg-gradient-to-r from-[#f4505a] to-[#a84f9f] p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" legacyBehavior>
          <a>
            <Image
              src="/images/terra-branca.webp" // Substitua pelo caminho correto do logo
              alt="Terra dos Imóveis"
              width={150}
              height={50}
              className="cursor-pointer"
            />
          </a>
        </Link>

        {/* Menu */}
        <ul className="flex space-x-6 text-white">
          <li>
            <Link href="/" legacyBehavior>
              <a className="hover:underline">Home</a>
            </Link>
          </li>
          <li>
            <Link href="/imoveis" legacyBehavior>
              <a className="hover:underline">Encontre seu imóvel</a>
            </Link>
          </li>
          <li>
            <Link href="/quemsomos" legacyBehavior>
              <a className="hover:underline">Quem Somos</a>
            </Link>
          </li>
          <li>
            <Link href="/contato" legacyBehavior>
              <a className="hover:underline">Contato</a>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
