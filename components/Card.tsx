import React, { useState, useEffect } from 'react';
import {
    FaHeart,
    FaBed,
    FaBath,
    FaCar,
    FaRulerCombined,
    FaShareAlt,
    FaWhatsapp, // Re-adicionado FaWhatsapp 
    FaCopy,
    FaFacebook,
} from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import Link from 'next/link';
import Cookies from 'js-cookie';
import {
    FacebookShareButton,
    WhatsappShareButton,
} from 'react-share';

import { urlSite } from './globals/variavels';

export interface ImovelResumo {
    id: string;
    idInterno: number;
    titulo: string;
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
        id: string;
        nome: string;
        celular: string;
        foto: string | null;
        creci: string;
    };
    permuta: boolean;
    tipo: string;
    subtipo: string;
    exibirDetalhesEnderecoSite: boolean;
    numero: string;
    complemento: string;
    logradouro: string;
}

const Card: React.FC<ImovelResumo> = ({
    id,
    idInterno,

    captador,
    tipo,
    subtipo,

    categoria,
    bairro,
    cidade,

    estadoSigla,
    valor,
    quartos,
    banheiros,
    garagens,
    areaConstruida,

    modalidade,
    fotos,
}) => {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const favorites = Cookies.get('favorites');
        if (favorites) {
            const favoriteList: string[] = JSON.parse(favorites);
            setIsFavorite(favoriteList.includes(id));
        }
    }, [id]);

    const handleToggleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const favorites = Cookies.get('favorites');
        let favoriteList: string[] = favorites ? JSON.parse(favorites) : [];

        if (isFavorite) {
            favoriteList = favoriteList.filter((favoriteId) => favoriteId !== id);
        } else {
            favoriteList.push(id);
        }

        Cookies.set('favorites', JSON.stringify(favoriteList), { expires: 7 });
        setIsFavorite(!isFavorite);

        const event = new CustomEvent('updateFavoritesCount', {
            detail: favoriteList.length,
        });
        window.dispatchEvent(event);
    };

    function cleanPhoneNumber(phoneNumber: string) {
        const cleanedNumber = phoneNumber.replace(/[^\d]/g, '');
        return `55${cleanedNumber}`;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars 
    const handleWhatsapp = () => { // Comentário para desabilitar a regra nesta linha
        let numeroWhatsapp = '5532988898000';
        if (modalidade === 'ALUGUEL') {
            numeroWhatsapp = '5532988118000';
        }
        if (captador.celular && captador.celular !== '' && captador.creci && captador.creci !== '') {
            numeroWhatsapp = cleanPhoneNumber(captador.celular);
        }
        const mensagem = encodeURIComponent(
            `Olá! Tenho interesse no imóvel ${idInterno}!`
        );
        const shareUrl = `https://api.whatsapp.com/send?phone=${numeroWhatsapp}&text=${mensagem}`;
        window.open(shareUrl, '_blank');
    };

    const [showMenu, setShowMenu] = useState(false);
    const shareUrl = 'https://seusite.com'; //ajuste a url

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Link copiado para a área de transferência!');
            setShowMenu(false);
        });
    };
    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };
    const subtipoText = subtipo === 'Padrão' ? '' : ` - ${subtipo}`;
    const cidadeEstadoText = cidade ? `${cidade} - ${estadoSigla}` : estadoSigla;

    return (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden cursor-auto transform transition duration-300 hover:scale-105 relative">
            <div className="">
                <Link href={'/' + idInterno}>
                    <div className="relative z-5 px-[4%]" >

                        <Swiper id='custom' navigation pagination={{ clickable: true }} modules={[Navigation, Pagination]} className="w-full xl:h-80 h-[360px]  mb-4">
                            {fotos.length > 0 ? fotos.map((foto, index) => (
                                <SwiperSlide key={index}>
                                    <img width={600} height={320} src={foto} alt={`Foto ${index + 1} do imóvel`} className="w-full xl:block hidden xl:h-80 h-[320px] object-cover rounded-xl" />
                                    <img width={600} height={360} src={foto} alt={`Foto ${index + 1} do imóvel`} className="w-full xl:hidden block xl:h-80 h-[360px] object-cover rounded-xl" />
                                </SwiperSlide>
                            )) :
                                <SwiperSlide key={'0'}>
                                    <div className='flex justify-center items-center xl:h-80 h-[360px] '>
                                        <p>Sem Foto</p>
                                    </div>
                                </SwiperSlide>

                            }
                        </Swiper>

                        {/* Modalidade em cima da imagem */}
                        {categoria && (
                            <div className={`absolute z-20 top-2 left-4 px-3 py-1 rounded-full text-[10px] text-black bg-opacity-90 font-semibold bg-slate-100 `} >
                                {modalidade}
                            </div>
                        )}



                    </div>

                    {/* Informações do Imóvel */}
                    <div className="px-8 pb-4">
                        <div className='flex justify-between items-center mb-2'>
                            <p className='xl:text-lg text-md  text-[#52174c] font-bold '>{bairro}</p>


                            <div className="flex items-center space-x-2">
                                <span className="text-gray-600 text-md">COD {idInterno}</span>


                            </div>
                        </div>

                        {/* Ícones dos Detalhes do Imóvel */}
                        <div className="flex flex-wrap mt-4 text-gray-600 gap-x-8 xl:h-6 text-sm mb-4">
                            {quartos && quartos !== 0 && (
                                <span className="flex items-center">
                                    <FaBed className="mr-1 text-gray-500" size={20} />{' '}
                                    {quartos}
                                </span>
                            )}
                            {banheiros && banheiros !== 0 && (
                                <span className="flex items-center">
                                    <FaBath className="mr-1 text-gray-500" size={20} />{' '}
                                    {banheiros}
                                </span>
                            )}
                            {garagens && garagens !== 0 && (
                                <span className="flex items-center">
                                    <FaCar className="mr-1 text-gray-500" size={20} />{' '}
                                    {garagens}
                                </span>
                            )}
                            {areaConstruida && areaConstruida !== '0' && areaConstruida !== '' && (
                                <span className="flex items-center">
                                    <FaRulerCombined className="mr-1 text-gray-500" size={20} />{' '}
                                    {areaConstruida} m²
                                </span>
                            )}
                        </div>

                        {<p className="xl:text-md text-sm mb-2 font-bold">
                            <span className="">{tipo} {subtipoText}</span>
                        </p>}


                        <p className="text-md  text-gray-800">{cidadeEstadoText}</p>



                        {/* Valor do Imóvel e Botão "Veja Mais" */}
                        <div className="flex justify-between items-center ">
                            <p className="text-lg xl:text-xl font-bold text-[#52174c] ">
                                {valor.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                })},<span className='text-sm'>00</span>
                            </p>
                            <button onClick={toggleMenu} className="p-2 rounded-full text-[#52174c] ">
                                <FaShareAlt size={24} />
                                <p className='text-[10px] w-0 text-transparent'>Compartilhar</p>
                            </button>

                            {showMenu && (
                                <div className="absolute z-40 top-12 right-0 bg-white shadow-lg p-4 rounded-md mt-2">
                                    <h3 className="mb-2">Compartilhar em:</h3>
                                    <div className="flex flex-col space-y-2">
                                        <WhatsappShareButton url={urlSite + idInterno} onClick={() => setShowMenu(false)}>
                                            <button className="w-full p-2 hover:bg-gray-200 rounded-md text-green-600 flex items-center">
                                                <FaWhatsapp className="mr-2" />
                                                WhatsApp
                                            </button>
                                        </WhatsappShareButton>
                                        <FacebookShareButton url={urlSite + idInterno} onClick={() => setShowMenu(false)}>
                                            <button className="w-full p-2 hover:bg-gray-200 rounded-md text-blue-600 flex items-center">
                                                <FaFacebook className="mr-2" />
                                                Facebook
                                            </button>
                                        </FacebookShareButton>
                                        <button onClick={handleCopyLink} className="w-full p-2 hover:bg-gray-200 rounded-md text-gray-600 flex items-center">
                                            <FaCopy className="mr-2" />
                                            Copiar link
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button onClick={handleToggleFavorite} className={`p-2 rounded-full ${isFavorite ? 'text-[#f4505a]' : 'text-[#52174c] '}`}>
                                <FaHeart size={24} />
                                <p className='text-[10px] w-0 text-transparent'>Favorito</p>
                            </button>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Card;