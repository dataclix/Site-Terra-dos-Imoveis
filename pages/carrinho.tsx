import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  FaBath,
  FaBed,
  FaCar,
  FaRulerCombined,
  FaTimes,
  FaWhatsapp,
  FaShareAlt,
  FaCopy,
  FaFacebook,
} from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import Cookies from 'js-cookie';
import { FacebookShareButton, WhatsappShareButton } from 'react-share';
import Navbar2 from '@/components/Navbar2';

interface ImovelResumo {
  id: string;
  idInterno: number;
  titulo: string;
  tipo: { id: string; nome: string };
  subtipo: { id: string; nome: string };
  categoria: { nome: string; cor: string };
  bairro: string;
  cidade: string;
  estado: string;
  estadoSigla: string;
  valor: number;
  quartos: number | null;
  banheiros: number | null;
  garagens: number | null;
  areaConstruida: string | null;
  areaTerreno: string | null;
  modalidade: string;
  fotos: string[];
  captador: {
    foto: string | null;
    nome: string;
    celular: string;
    creci: string;
  };
}

const Carrinho: React.FC = () => {
  const [imoveisFavoritos, setImoveisFavoritos] = useState<ImovelResumo[]>([]);
  const [showMenuStates, setShowMenuStates] = useState<{ [imovelId: string]: boolean }>({});

  const buscarDadosDosImoveis = async () => {
    try {
      const favoriteIds = getFavoriteIdsFromCookies();
      console.log('Buscando dados para os IDs:', favoriteIds);

      const favoritosComDados = await Promise.all(
        favoriteIds.map(async (id) => {
          const response = await axios.get<ImovelResumo>(
            `https://homeclixlongatti.dataclix.com.br:3331/website/imovel/resumo/${id}`
          );
          console.log('Resposta da API para ID', id, ':', response.data);
          return response.data;
        })
      );

      setImoveisFavoritos(favoritosComDados);
    } catch (error) {
      console.error('Erro ao buscar dados dos imóveis:', error);
    }
  };

  const handleToggleFavorite = (imovelId: string) => {
    const favorites = Cookies.get('favorites');
    let favoriteList: string[] = favorites ? JSON.parse(favorites) : [];

    if (favoriteList.includes(imovelId)) {
      favoriteList = favoriteList.filter((favoriteId) => favoriteId !== imovelId);
    } else {
      favoriteList.push(imovelId);
    }

    Cookies.set('favorites', JSON.stringify(favoriteList), { expires: 7 });

    setImoveisFavoritos((prevFavorites) =>
      prevFavorites.filter((imovel) => imovel.id !== imovelId)
    );

    const event = new CustomEvent('updateFavoritesCount', {
      detail: favoriteList.length,
    });
    window.dispatchEvent(event);
  };

  const enviarFavoritosParaWhatsapp = () => {
    const idsFavoritos = imoveisFavoritos.map((imovel) => imovel.idInterno).join(', ');
    const mensagem = `Olá! Tenho interesse nos imóveis: ${idsFavoritos}`;
    const numeroWhatsapp = '5532988898000';
    const url = `https://api.whatsapp.com/send?phone=${numeroWhatsapp}&text=${encodeURIComponent(
      mensagem
    )}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    const favoriteIds = getFavoriteIdsFromCookies();
    console.log('IDs favoritos:', favoriteIds);
    buscarDadosDosImoveis();
  }, [Cookies.get('favorites')]);

  const getFavoriteIdsFromCookies = (): string[] => {
    const favorites = Cookies.get('favorites');
    return favorites ? JSON.parse(favorites) : [];
  };

  function cleanPhoneNumber(phoneNumber: string) {
    const cleanedNumber = phoneNumber.replace(/[^\d]/g, '');
    return `55${cleanedNumber}`;
  }

  function getFirstAndLastName(fullName: string) {
    const names = fullName.trim().split(' ');
    const firstName = names[0];
    const lastName = names[names.length - 1];
    return `${firstName} ${lastName}`;
  }

  const handleToggleMenu = (imovelId: string) => {
    setShowMenuStates((prevState) => ({
      ...prevState,
      [imovelId]: !prevState[imovelId],
    }));
  };

  const handleCopyLink = (shareUrl: string) => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Link copiado para a área de transferência!');
    });
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar2 />
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8 mt-12">
          Meus Imóveis Favoritos
        </h1>
        {imoveisFavoritos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-6">
              {imoveisFavoritos.map((imovel) => (
                <div
                  key={imovel.idInterno}
                  className="bg-[#E4E9EB] shadow-md rounded-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 sm:h-[720px] md:h-[720px] lg:h-[720px] xl:h-[720px] 2xl:h-[720px] 3xl:h-[c] relative"
                >
                  <div className="relative">
                    <div
                      className="p-4 flex justify-between items-start"
                      style={{ marginLeft: '2%', marginRight: '2%' }}
                    >
                      <div className="flex items-center">
                        {imovel.captador.creci && imovel.captador.creci !== '' ? (
                          <>
                            <div
                              className="circular-image mr-2"
                              style={{
                                backgroundImage: `url(${imovel.captador.foto || '/images/avatar.webp'
                                  })`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'top',
                              }}
                            />
                            <span className="ml-2 text-sm text-gray-800">
                              {getFirstAndLastName(imovel.captador.nome) || 'Longatti'}
                            </span>
                          </>
                        ) : (
                          <>
                            <div
                              className="circular-image mr-2"
                              style={{
                                backgroundImage: `url(/images/junior.webp)`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'top',
                              }}
                            />
                            <span className="ml-2 text-sm text-gray-800">
                              Junior Longatti
                            </span>
                          </>
                        )}
                      </div>

                      <button onClick={() => {
                        let numeroWhatsapp = '5532988898000';
                        if (imovel.modalidade === 'ALUGUEL') {
                          numeroWhatsapp = '5532988118000'
                        }
                        if (imovel.captador.celular && imovel.captador.celular !== '' && imovel.captador.creci && imovel.captador.creci !== '') {
                          numeroWhatsapp = cleanPhoneNumber(imovel.captador.celular);
                        }
                        const mensagem = encodeURIComponent(
                          `Olá! Tenho interesse no imóvel ${imovel.idInterno}!`
                        );
                        const shareUrl = `https://api.whatsapp.com/send?phone=${numeroWhatsapp}&text=${mensagem}`;
                        window.open(shareUrl, '_blank');
                      }}
                        className="p-2 rounded-full text-gray-600">
                        <FaWhatsapp size={24} />
                      </button>
                      <button onClick={() => handleToggleMenu(imovel.id)} className="p-2 rounded-full text-gray-600">
                        <FaShareAlt size={24} />
                        <p className='text-[10px] w-0 text-transparent'>Compartilhar</p>
                      </button>
                      {showMenuStates[imovel.id] && (
                        <div className="absolute top-10 right-0 bg-white shadow-lg p-4 rounded-md mt-2 z-10">
                          <h3 className="mb-2">Compartilhar em:</h3>
                          <div className="flex flex-col space-y-2">
                            <WhatsappShareButton url={`https://homeclix.com.br/${imovel.idInterno}`} title={imovel.titulo} onClick={() => handleToggleMenu(imovel.id)}>
                              <button className="w-full p-2 hover:bg-gray-200 rounded-md text-green-600 flex items-center">
                                <FaWhatsapp className="mr-2" />
                                WhatsApp
                              </button>
                            </WhatsappShareButton>
                            <FacebookShareButton url={`https://homeclix.com.br/${imovel.idInterno}`} onClick={() => handleToggleMenu(imovel.id)}>
                              <button className="w-full p-2 hover:bg-gray-200 rounded-md text-blue-600 flex items-center">
                                <FaFacebook className="mr-2" />
                                Facebook
                              </button>
                            </FacebookShareButton>
                            <button onClick={() => handleCopyLink(`https://homeclix.com.br/${imovel.idInterno}`)} className="w-full p-2 hover:bg-gray-200 rounded-md text-gray-600 flex items-center">
                              <FaCopy className="mr-2" />
                              Copiar link
                            </button>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => handleToggleFavorite(imovel.id)}
                        className="p-2 rounded-full text-gray-600"
                      >
                        <FaTimes size={20} />
                      </button>
                    </div>
                    <div
                      className="relative z-5"
                      style={{ marginLeft: '4%', marginRight: '4%' }}
                    >
                      <Link href={`/${imovel.idInterno}`} legacyBehavior>
                        <a className="block">
                          <Swiper
                            navigation
                            pagination={{ clickable: true }}
                            modules={[Navigation, Pagination]}
                            className="w-full h-96 mb-4"
                          >
                            {imovel.fotos.map((foto, index) => (
                              <SwiperSlide key={index}>
                                <img
                                  src={foto}
                                  alt={`Foto ${index + 1} do imóvel`}
                                  className="w-full h-96 object-cover rounded-xl"
                                  loading="lazy"
                                />
                              </SwiperSlide>
                            ))}
                          </Swiper>
                          {imovel.categoria && (
                            <div className={`absolute z-20 top-2 left-1 px-4 py-1 rounded-full text-sm text-white bg-opacity-90 font-semibold font-barlow`} style={{ backgroundColor: imovel.categoria.cor }}>
                              {imovel.categoria.nome}
                            </div>
                          )}
                        </a>
                      </Link>
                    </div>
                    <div
                      className="px-4 pb-4"
                      style={{ marginLeft: '4%', marginRight: '4%' }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h2 className="text-sm font-semibold text-gray-800">
                          {imovel.modalidade}
                        </h2>

                        <span className="text-gray-600 text-md">
                          COD {imovel.idInterno}
                        </span>
                      </div>
                      {imovel.subtipo.nome === 'Padrão' ? (
                        <p className="text-xl mb-1 font-bold">
                          <span className="text-gray-600">{imovel.tipo.nome}</span>
                        </p>
                      ) : (
                        <p className="text-xl mb-1 font-bold">
                          <span className="text-gray-600">{`${imovel.tipo.nome}, ${imovel.subtipo.nome}`}</span>
                        </p>
                      )}

                      <p className="text-xl mb-1 font-bold">
                        <span className="text-yellow-500">{imovel.bairro}</span>
                      </p>
                      <p className="text-md mb-4 text-gray-800">
                        {imovel.cidade}, {imovel.estadoSigla}
                      </p>
                      <div className="flex flex-wrap justify-between text-gray-600 gap-2 text-sm mb-4">
                        {imovel.quartos && (
                          <span className="flex items-center">
                            <FaBed className="mr-1 text-gray-500" size={20} />{' '}
                            {imovel.quartos}
                          </span>
                        )}
                        {imovel.banheiros && (
                          <span className="flex items-center">
                            <FaBath className="mr-1 text-gray-500" size={20} />{' '}
                            {imovel.banheiros}
                          </span>
                        )}
                        {imovel.garagens && (
                          <span className="flex items-center">
                            <FaCar className="mr-1 text-gray-500" size={20} />{' '}
                            {imovel.garagens}
                          </span>
                        )}
                        {imovel.areaConstruida && (
                          <span className="flex items-center">
                            <FaRulerCombined
                              className="mr-1 text-gray-500"
                              size={20}
                            />{' '}
                            {imovel.areaConstruida} m²
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-6">
                        <p className="text-lg font-bold text-[#0A293B]">
                          {imovel.valor.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </p>
                        <Link href={`/${imovel.idInterno}`} legacyBehavior>
                          <button className="px-4 py-2 rounded-full bg-[#0A293B] text-white font-bold hover:scale-105">
                            Veja Mais
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <button
                onClick={enviarFavoritosParaWhatsapp}
                className="px-6 py-3 rounded-full bg-dourado text-azul font-bold hover:scale-105"
              >
                <FaWhatsapp className="mr-2 inline-block" /> Enviar Favoritos

              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600">
            Você ainda não possui imóveis favoritados.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Carrinho;
