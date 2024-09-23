import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0); 

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const updateFavoritesCount = () => {
    const favoriteIds = Cookies.get('favorites');
    setFavoritesCount(favoriteIds ? JSON.parse(favoriteIds).length : 0);
  };

  useEffect(() => {
    updateFavoritesCount(); 

    window.addEventListener('updateFavoritesCount', updateFavoritesCount);

    return () => {
      window.removeEventListener('updateFavoritesCount', updateFavoritesCount);
    };
  }, []);

  return (
    <nav className=" p-4 border-b border-white border-opacity-20 fixed top-0 z-10 w-full">
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
        <div className="flex items-center gap-4 md:hidden"> 
          <Link href="/favoritos" scroll={true}> 
            <div className="relative mr-4 mt-2">
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {favoritesCount}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </div>
          </Link>
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

        {/* Botão de Favoritos (Desktop) */}
        <div className="hidden md:flex items-center"> 
          <Link href="/carrinho" scroll={true}> 
            <div className="ml-4  relative">
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {favoritesCount}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </div>
          </Link>
        </div>

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