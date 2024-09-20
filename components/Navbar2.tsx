import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <nav className=" p-4 border-b border-white  bg-gradient-to-r from-[#f4505a] to-[#a84f9f] border-opacity-20 fixed top-0 z-10 w-full">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" legacyBehavior>
          <a>
            <Image
              src="/images/terra-branca.webp"
              alt="Terra dos Imóveis"
              width={150}
              height={50}
              className="cursor-pointer"
            />
          </a>
        </Link>

        {/* Menu Desktop */}
        <ul className="hidden lg:flex space-x-6 font-semibold text-white">
          {['Home', 'Encontre seu imóvel', 'Quem Somos', 'Contato'].map((text, index) => (
            <li key={index}>
              <Link href={text.toLowerCase().replace(/\s+/g, '')} legacyBehavior>
                <a className="hover:underline">{text}</a>
              </Link>
            </li>
          ))}
        </ul>

        {/* Botão do Menu Hambúrguer (Mobile) */}
        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={toggleDrawer}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Drawer (Menu Lateral) */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        } z-20`}>
        <div className="p-4">
          <button onClick={toggleDrawer} className="text-gray-600">
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <ul className="mt-6">
            {['Home', 'Encontre seu imóvel', 'Quem Somos', 'Contato'].map((text, index) => (
              <li key={index} className="mb-4">
                <Link href={text.toLowerCase().replace(/\s+/g, '')} legacyBehavior>
                  <a
                    onClick={toggleDrawer}
                    className="block py-2 px-4 text-gray-800 hover:bg-gray-100"
                  >
                    {text}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;