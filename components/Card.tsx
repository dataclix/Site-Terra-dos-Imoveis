import React, { useState, useEffect } from 'react';
import {
    HiOutlineHome,
    HiOutlineTruck,
} from 'react-icons/hi';
import {

    FiCopy,
    FiFacebook,
    FiSend,
    FiShare, // Novo ícone para compartilhar
} from 'react-icons/fi';
import { BiBath } from 'react-icons/bi'; // Novo ícone para banheiro
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

import { RiRulerLine } from 'react-icons/ri';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

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

    const [showMenu, setShowMenu] = useState(false);
    const shareUrl = 'https://seusite.com'; // ajuste a URL

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
        <div className="bg-white shadow-sm rounded-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 relative">
            <Link href={'/' + idInterno}>
                <div className="relative z-5 px-4">
                    {/* Swiper de imagens */}
                    <Swiper navigation pagination={{ clickable: true }} modules={[Navigation, Pagination]} className="w-full h-60 mb-4">
                        {fotos.length > 0 ? (
                            fotos.map((foto, index) => (
                                <SwiperSlide key={index}>
                                    <img
                                        width={600}
                                        height={320}
                                        src={foto}
                                        alt={`Foto ${index + 1} do imóvel`}
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                </SwiperSlide>
                            ))
                        ) : (
                            <SwiperSlide key="0">
                                <div className="flex justify-center items-center h-full">
                                    <p>Sem Foto</p>
                                </div>
                            </SwiperSlide>
                        )}
                    </Swiper>

                    {/* Modalidade em cima da imagem */}
                    {categoria && (
                        <div className="absolute top-2 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 bg-opacity-90">
                            {modalidade}
                        </div>
                    )}
                </div>

                {/* Informações do imóvel */}
                <div className="px-6 pb-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-lg text-[#52174c] font-bold">{bairro}</p>
                        <span className="text-gray-500 text-sm">COD {idInterno}</span>
                    </div>

                    {/* Ícones dos Detalhes do Imóvel */}
                    <div className="flex flex-wrap text-gray-600 gap-x-6 gap-y-2 mb-4 text-lg">
                        {quartos && (
                            <span className="flex items-center">
                                <HiOutlineHome className="mr-1 text-gray-500" size={18} /> {quartos}
                            </span>
                        )}
                        {banheiros && (
                            <span className="flex items-center">
                                <BiBath className="mr-1 text-gray-500" size={18} /> {banheiros} {/* Novo ícone de banheiro */}
                            </span>
                        )}
                        {garagens && (
                            <span className="flex items-center">
                                <HiOutlineTruck className="mr-1 text-gray-500" size={18} /> {garagens}
                            </span>
                        )}
                        {areaConstruida && (
                            <span className="flex items-center">
                                <RiRulerLine className="mr-1 text-gray-500" size={18} /> {areaConstruida} m²
                            </span>
                        )}
                    </div>

                    {/* Informações do imóvel */}
                    <p className="text-sm font-bold">{tipo} {subtipoText}</p>
                    <p className="text-sm text-gray-500">{cidadeEstadoText}</p>

                    {/* Valor do Imóvel e Botões de ação */}
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-lg font-bold text-[#52174c]">
                            {valor.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                                minimumFractionDigits: 0,
                            })},00
                        </p>

                        <div className="flex items-center space-x-4">
                            <button onClick={toggleMenu} className="p-2 rounded-full text-[#52174c]">
                                <FiShare className="mr-1" size={20} /> {/* Novo ícone de compartilhar */}
                            </button>
                            <button onClick={handleToggleFavorite} className={`p-2 rounded-full ${isFavorite ? 'text-[#f4505a]' : 'text-[#52174c]'}`}>
                                {isFavorite ? <AiFillHeart size={20} /> : <AiOutlineHeart size={20} />}
                            </button>
                        </div>
                    </div>

                    {showMenu && (
                        <div className="absolute z-40 top-12 right-0 bg-white shadow-lg p-4 rounded-md mt-2">
                            <h3 className="mb-2 text-sm">Compartilhar em:</h3>
                            <div className="flex flex-col space-y-2">
                                <WhatsappShareButton url={urlSite + idInterno} onClick={() => setShowMenu(false)}>
                                    <button className="w-full p-2 hover:bg-gray-100 rounded-md text-green-600 flex items-center">
                                        <FiSend className="mr-2" /> WhatsApp
                                    </button>
                                </WhatsappShareButton>
                                <FacebookShareButton url={urlSite + idInterno} onClick={() => setShowMenu(false)}>
                                    <button className="w-full p-2 hover:bg-gray-100 rounded-md text-blue-600 flex items-center">
                                        <FiFacebook className="mr-2" /> Facebook
                                    </button>
                                </FacebookShareButton>
                                <button onClick={handleCopyLink} className="w-full p-2 hover:bg-gray-100 rounded-md text-gray-600 flex items-center">
                                    <FiCopy className="mr-2" /> Copiar link
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
};

export default Card;