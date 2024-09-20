import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import {
  FaHeart,
  FaBed,
  FaBath,
  FaCar,
  FaRulerCombined,
  FaShareAlt,
  FaWhatsapp,
  FaCopy,
  FaFacebook,

} from 'react-icons/fa';
import { BsCheckCircleFill } from 'react-icons/bs';

import Footer from '@/components/Footer';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Download from 'yet-another-react-lightbox/plugins/download';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
const Similares = lazy(() => import('../components/Similares'));
import { GetServerSideProps } from 'next';
import Cookies from 'js-cookie';
import {
  FacebookShareButton,
  WhatsappShareButton,
} from 'react-share';
import 'swiper/css';
import 'swiper/css/navigation';

import { NextSeo } from 'next-seo';
import { url, urlSite } from '@/components/globals/variavels';
import Navbar2 from '@/components/Navbar2';

interface Imovel {
  id: string;
  idInterno: number;
  titulo: string;
  descricao: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  estadoSigla: string;
  valor: number;
  quartos: number;
  banheiros: number;
  garagens: number;
  areaConstruida: string;
  areaTerreno: string;
  modalidade: string;
  fotos: string[];
  captador: {
    nome: string;
    foto: string | null;
    celular: string;
    creci: string;
  };
  atributos: { atributo: { id: string; nome: string } }[];
  permuta: boolean;
  tipo: {
    id: number;
    nome: string;
  };
  subtipo: {
    id: number;
    nome: string;
  };
  exibirDetalhesEnderecoSite: boolean;
  numero: string;
  complemento: string;
  logradouro: string;
}

interface ImovelProps {
  imovel: Imovel;
}

const Imovel: React.FC<ImovelProps> = ({ imovel }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const favorites = Cookies.get('favorites');
    if (imovel && favorites) {
      const favoriteList: string[] = JSON.parse(favorites);
      setIsFavorite(favoriteList.includes(imovel.id));
    }
  }, [imovel?.id]);

  const handleToggleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const favorites = Cookies.get('favorites');
    let favoriteList: string[] = favorites ? JSON.parse(favorites) : [];

    if (isFavorite) {
      favoriteList = favoriteList.filter(
        (favoriteId) => favoriteId !== imovel.id
      );
    } else {
      favoriteList.push(imovel.id);
    }

    Cookies.set('favorites', JSON.stringify(favoriteList), { expires: 7 });
    setIsFavorite(!isFavorite);

    const event = new CustomEvent('updateFavoritesCount', {
      detail: favoriteList.length,
    });
    window.dispatchEvent(event);
  };

  const formatarPreco = (preco: number) =>
    preco !== 0
      ? preco.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
      : 'Consulte-nos';

  const openLightbox = (index: number) => {
    setCurrentSlideIndex(index);
    setLightboxOpen(true);
  };

  const cleanPhoneNumber = (phoneNumber: string) => {
    const cleanedNumber = phoneNumber.replace(/[^\d]/g, '');
    return cleanedNumber.length === 11 ? cleanedNumber : `55${cleanedNumber}`;
  };

  const handleWhatsapp = async () => {
    await axios.post(`${url}website/email-interesse/${imovel.idInterno}`);
    const numeroWhatsapp = imovel.captador.celular
      ? cleanPhoneNumber(imovel.captador.celular)
      : '5532988898000';
    const mensagem = encodeURIComponent(
      `Olá! Tenho interesse no imóvel: ${urlSite + imovel.idInterno} `
    );
    const shareUrl = `https://api.whatsapp.com/send?phone=${numeroWhatsapp}&text=${mensagem}&app_absent=0`;
    window.open(shareUrl, '_blank');
  };



  const handleCopyLink = () => {
    navigator.clipboard.writeText(urlSite + imovel.idInterno).then(() => {
      alert('Link copiado para a área de transferência!');
      setShowMenu(false);
    });
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div>
      {imovel && (
        <NextSeo
          title='Longatti Imóveis'
          description="Lorem ipsum dolor sit amet, consectetur"
          openGraph={{
            url: urlSite + imovel.idInterno,
            title: `${imovel.subtipo.nome === 'Padrão' ? imovel.tipo.nome : imovel.subtipo.nome} em ${imovel.bairro}, ${imovel.cidade} - ${imovel.estadoSigla}`,
            description: `${imovel.quartos ? `${imovel.quartos} quartos \n` : ''}${imovel.banheiros ? `${imovel.banheiros} banheiros \n` : ''}${imovel.garagens ? `${imovel.garagens} garagens \n` : ''}${imovel.areaConstruida ? `${imovel.areaConstruida}m² Área Construida \n` : ''}`,
            images: [
              {
                url: imovel.fotos[0],
                width: 800,
                height: 600,
                alt: 'Imagem do imovel',
                type: 'image/webp',
              },
            ],
            site_name: 'Terra Dos Imoveis',
          }}
        />
      )}

      <Navbar2 />
      <div className="grid grid-cols-4 gap-2 mt-36">
        {imovel.fotos.slice(0, 4).map((foto, index) => (
          <div key={index} className="relative w-full h-auto"> {/* Aumentei a altura das fotos */}
            <img
              src={foto}
              alt={`Foto ${index + 1} do imóvel`}
              onClick={() => openLightbox(index)}
              className="object-cover w-full h-full cursor-pointer"
            />
          </div>
        ))}

      </div>
      <div className="sm:mx-[5%] xl:mx-[10%] 3xl:mx-[17%] px-4 ">
        {imovel ? (
          <>
            <div className="bg-white rounded-lg overflow-hidden mb-4">
              {/* Grid com fotos lado a lado, tamanho ajustado */}

              <div className="flex flex-col md:flex-row items-center justify-between mb-4 mt-10">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-2xl font-semibold text-gray-800">
                    {imovel
                      ? `${imovel.subtipo.nome === 'Padrão' ? imovel.tipo.nome : imovel.subtipo.nome} em ${imovel.bairro}, ${imovel.cidade} - ${imovel.estadoSigla}`
                      : 'Imóvel não encontrado'}
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleMenu}
                    className="p-2 flex items-center gap-x-2 rounded-md bg-gray-200 hover:bg-gray-300"
                  >
                    <FaShareAlt />
                    <p>Compartilhar</p>
                  </button>

                  <button
                    onClick={handleToggleFavorite}
                    className={`p-2 flex items-center gap-x-2  rounded-md ${isFavorite ? 'bg-[#52174c] text-white' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                  >
                    <FaHeart />
                    <p>Favoritos</p>
                  </button>
                </div>
                {showMenu && (
                  <div className="absolute xl:right-[18%] 3xl:right-[23.5%] bg-white shadow-lg p-4 rounded-md mt-28 xl:mt-60 z-50">
                    <h3 className="mb-2">Compartilhar em:</h3>
                    <div className="flex flex-col space-y-2">
                      <WhatsappShareButton
                        url={urlSite + imovel.idInterno}
                        onClick={() => setShowMenu(false)}
                      >
                        <button className="w-full p-2 hover:bg-gray-200 rounded-md text-green-600 flex items-center">
                          <FaWhatsapp className="mr-2" />
                          WhatsApp
                        </button>
                      </WhatsappShareButton>
                      <FacebookShareButton
                        url={urlSite + imovel.idInterno}
                        onClick={() => setShowMenu(false)}
                      >
                        <button className="w-full p-2 hover:bg-gray-200 rounded-md text-blue-600 flex items-center">
                          <FaFacebook className="mr-2" />
                          Facebook
                        </button>
                      </FacebookShareButton>
                      <button
                        onClick={handleCopyLink}
                        className="w-full p-2 hover:bg-gray-200 rounded-md text-gray-600 flex items-center"
                      >
                        <FaCopy className="mr-2" />
                        Copiar link
                      </button>
                    </div>
                  </div>
                )}
              </div>



            </div>

            <div className="grid grid-cols-1  gap-6">
              <div className=" h-auto">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">
                      Informações
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-6 text-lg">
                    {imovel.quartos && (
                      <div className="flex items-center">
                        <FaBed className="mr-2 text-gray-600" />
                        <span>{imovel.quartos} quartos</span>
                      </div>
                    )}
                    {imovel.banheiros && (
                      <div className="flex items-center">
                        <FaBath className="mr-2 text-gray-600" />
                        <span>{imovel.banheiros} banheiros</span>
                      </div>
                    )}
                    {imovel.garagens && (
                      <div className="flex items-center">
                        <FaCar className="mr-2 text-gray-600" />
                        <span>{imovel.garagens} vagas de garagem</span>
                      </div>
                    )}
                    {imovel.areaConstruida && (
                      <div className="flex items-center">
                        <FaRulerCombined className="mr-2 text-gray-600" />
                        <span>{imovel.areaConstruida} m² construído</span>
                      </div>
                    )}
                    {imovel.areaTerreno && (
                      <div className="flex items-center">
                        <FaRulerCombined className="mr-2 text-gray-600" />
                        <span>{imovel.areaTerreno} m² terreno</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg py-6">
                    <p className="md:text-3xl text-2xl font-bold">
                      Descrição
                    </p>
                    <article
                      className="mt-4 prose-p:text-justify md:prose-h1:text-2xl prose-h1:text-2xl md:prose-h2:text-2xl prose-h2:text-xl md:prose-h3:text-xl prose-h3:text-lg prose-ol:px-8 prose-ol:pt-3 prose-ol:list-decimal prose-ul:px-8 prose-ul:pt-3 prose-ul:list-disc prose-a:underline"
                      dangerouslySetInnerHTML={{
                        __html: imovel.descricao || '',
                      }}
                    />
                  </div>

                  {imovel.atributos.length > 0 && (
                    <>
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Detalhes Extras
                      </h2>
                      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-lg">
                        {imovel.atributos.map((item, index) => (
                          <li key={index} className="flex items-center text-gray-600">
                            <BsCheckCircleFill className="mr-2 text-[#52174c]" />
                            <span>{item.atributo.nome}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>


              <div className="md:col-span-1 md:sticky md:top-20 sm:h-80">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="font-semibold text-gray-700 items-center flex justify-between">
                    <span className='text-lg'>{imovel ? `${imovel.tipo.nome} ` : ''}</span>
                    <span className='text-md'>Cód: {imovel.idInterno}</span>
                  </div>
                  <p className='font-semibold mt-1 text-md'>{imovel.modalidade}</p>
                  {imovel && imovel.exibirDetalhesEnderecoSite && (
                    <p className="text-lg text-gray-600">
                      {imovel.logradouro ? <>{imovel.logradouro}</> : ''}
                      {imovel.numero ? <>, {imovel.numero}</> : ''}
                      {imovel.complemento ? <>, {imovel.complemento}</> : ''}
                    </p>
                  )}
                  <p className="text-2xl text-[#52174c] font-bold" style={{ textShadow: '1px 2px 3px rgba(0, 0, 0, 0.15)' }}>
                    {imovel ? `${imovel.bairro}` : ''}
                  </p>
                  <p className="text-xl font-medium text-gray-700 mb-2">
                    {imovel ? ` ${imovel.cidade} - ${imovel.estadoSigla}` : ''}
                  </p>

                  <p className="text-2xl font-bold text-[#52174c] mb-4">
                    {formatarPreco(imovel.valor)}
                  </p>
                  <div className="mb-4">
                    <div className="flex items-center">
                      <div
                        className="circular-image mr-3"
                        style={{
                          backgroundImage: `url(${imovel.captador.creci && imovel.captador.creci !== '' ? (imovel.captador.foto || '/images/longatti.webp') : '/images/junior.webp'})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'top',
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                        }}
                      ></div>
                     
                    </div>
                  </div>
                  <button
                    onClick={handleWhatsapp}
                    className="bg-[#52174c] hover:bg-[#3d1340] text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300 w-full text-md uppercase"
                  >
                    Tenho Interesse
                  </button>
                </div>
              </div>
            </div>

            <Suspense>
              <div className='sm:-mx-[5%] xl:-mx-[10%] 3xl:-mx-[17%]'>
                <Similares id={imovel.id} />
              </div>
            </Suspense>

            {lightboxOpen === true && (
              <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={imovel.fotos.map((foto, index) => ({
                  src: foto,
                  title: `${index + 1}/${imovel.fotos.length}`,
                }))}
                index={currentSlideIndex}
                plugins={[
                  Captions,
                  Fullscreen,
                  Slideshow,
                  Thumbnails,
                  Zoom,
                  Download,
                ]}
              />
            )}
          </>
        ) : (
          <p>Carregando dados do imóvel...</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  try {
    const apiClient = axios.create({
      baseURL: 'https://homeclixlongatti.dataclix.com.br:3331/',
    });

    const detalhesResponse = await apiClient.get(
      `/website/imovel/detalhes/${id}`
    );

    return {
      props: {
        imovel: detalhesResponse.data,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        imovel: null,
      },
    };
  }
};

export default Imovel;
