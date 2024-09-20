import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Card, { ImovelResumo } from './Card';

interface Dados {
    id: string;
}

export default function Similares({ id }: Dados) {
    const [imoveisSimilares, setImoveisSimilares] = useState<ImovelResumo[]>([]);

    useEffect(() => {
        async function puxarDados() {
            const apiClient = axios.create({
                baseURL: 'https://homeclixlongatti.dataclix.com.br:3331/',
            });
            const similaresResponse = await apiClient.get(
                `/website/imovel/similares/${id}`
            );
            setImoveisSimilares(similaresResponse.data);
        }

        puxarDados();
    }, []);

    return (
        <div className="mt-8">
            {/* Título Principal */}
            <h2 className="text-4xl font-bold text-gray-800 mb-2  text-center">
                Vem ver os imóveis similares nessa região
            </h2>
            {/* Subtítulo */}
            <p className="text-xl text-gray-600 mb-4  text-center">
                Imóveis do mesmo tipo no mesmo bairro!
            </p>
            <Swiper
                className="custom"
                modules={[Navigation, Autoplay]}
                navigation
                spaceBetween={8}
                slidesPerView={1}
                slidesPerGroup={1}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    640: {
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                        spaceBetween: 8,
                    },
                    768: {
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                        spaceBetween: 8,
                    },
                    1024: {
                        slidesPerView: 4,
                        slidesPerGroup: 3,
                        spaceBetween: 8,
                    },
                    1280: {
                        slidesPerView: 4,
                        slidesPerGroup: 3,
                        spaceBetween: 8,
                    },
                }}
            >
                {imoveisSimilares.map((imovelSimilar) => (
                    <SwiperSlide className="py-4 px-2 custom" key={imovelSimilar.id}>
                        <Card
                            id={imovelSimilar.id}
                            idInterno={imovelSimilar.idInterno}
                            titulo={imovelSimilar.titulo}
                            categoria={imovelSimilar.categoria}
                            bairro={imovelSimilar.bairro}
                            cidade={imovelSimilar.cidade}
                            estado={imovelSimilar.estado}
                            estadoSigla={imovelSimilar.estadoSigla}
                            valor={imovelSimilar.valor}
                            quartos={imovelSimilar.quartos}
                            banheiros={imovelSimilar.banheiros}
                            garagens={imovelSimilar.garagens}
                            areaConstruida={imovelSimilar.areaConstruida}
                            areaTerreno={imovelSimilar.areaTerreno}
                            modalidade={imovelSimilar.modalidade}
                            fotos={imovelSimilar.fotos}
                            captador={imovelSimilar.captador}
                            permuta={imovelSimilar.permuta}
                            tipo={imovelSimilar.tipo}
                            subtipo={imovelSimilar.subtipo}
                            exibirDetalhesEnderecoSite={
                                imovelSimilar.exibirDetalhesEnderecoSite
                            }
                            numero={imovelSimilar.numero}
                            complemento={imovelSimilar.complemento}
                            logradouro={imovelSimilar.logradouro}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
