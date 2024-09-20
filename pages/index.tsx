import React, { useState, useEffect, Suspense, startTransition, lazy } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import { url, urlSite } from '@/components/globals/variavels';
import { ImovelResumo } from '@/components/Card';
import { NextSeo } from 'next-seo';

import { atom, useAtom } from 'jotai';
import Banner from '@/components/Banner';

const Footer = lazy(() => import('../components/Footer'));

const INITIAL_SKIP = 0;
const TAKE_COUNT = 20;

interface Imoveis {
  imoveis: ImovelResumo[];
  total: number;
}

export const modalidadeAtom = atom('VENDA');

const Home: React.FC = () => {
  const [imoveis, setImoveis] = useState<Imoveis>({ total: 0, imoveis: [] });
  const [skip, setSkip] = useState(INITIAL_SKIP);
  const [totalImoveis, setTotalImoveis] = useState(0);
  const [modalidade] = useAtom(modalidadeAtom); // Removeu setModalidade, pois não será usado

  useEffect(() => {
    const buscarImoveis = async () => {
      try {
        const response = await axios.post(
          `${url}website/imovel/filtrar/skip/${skip}/take/${TAKE_COUNT}`,
          {
            modalidade: [modalidade],
          }
        );
        startTransition(() => {
          setImoveis((prevImoveis) => ({
            total: response.data.total,
            imoveis: [...(prevImoveis.imoveis || []), ...response.data.imoveis],
          }));
        });
        setTotalImoveis(response.data.total);
      } catch (error) {
        console.error('Erro ao buscar imóveis:', error);
      } finally {
        setTimeout(() => {
          // setIsLoading(false);
        }, 400);
      }
    };

    if (skip !== 0) {
      buscarImoveis();
    }
  }, [skip]);

  useEffect(() => {
    const buscarImoveis = async () => {
      try {
        const response = await axios.post(
          `${url}website/imovel/filtrar/skip/${skip}/take/${TAKE_COUNT}`,
          {
            modalidade: [modalidade],
          }
        );
        startTransition(() => {
          setImoveis({ total: response.data.total, imoveis: response.data.imoveis });
          setTotalImoveis(response.data.total);
        });
      } catch (error) {
        console.error('Erro ao buscar imóveis:', error);
      } finally {
        setTimeout(() => {
          // setIsLoading(false);
        }, 2000);
      }
    };
    buscarImoveis();
  }, [modalidade]);

  const carregarMaisImoveis = () => {
    setSkip(skip + TAKE_COUNT);
  };

  return (
    <div className="bg-white min-h-[100vh]">
      <Navbar />
      <NextSeo
        title="Longatti Imóveis - São João Del Rei"
        description="Encontre o imóvel dos seus sonhos com a Longatti Imóveis. Oferecemos uma ampla seleção de propriedades para venda e aluguel."
        openGraph={{
          url: urlSite,
          title: 'Longatti Imóveis',
          description:
            'Encontre o imóvel dos seus sonhos com a Longatti Imóveis. Oferecemos uma ampla seleção de propriedades para venda e aluguel.',
          images: [
            {
              url: '/public/images/avatar.webp',
              width: 800,
              height: 600,
              alt: 'Imagem do imovel',
              type: 'image/webp',
            },
          ],
          site_name: 'Longatti Imóveis - São João Del Rei',
        }}
      />

      <div className="hidden lg:block">
        <Banner />
      </div>

      <div className="relative bottom-16"></div>

      <div className="mx-[2.5%] p-4 py-4 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-6">
          {imoveis.imoveis.map((imovel, index) => (
            <Card
              key={index}
              id={imovel.id}
              idInterno={imovel.idInterno}
              titulo={imovel.titulo}
              categoria={imovel.categoria}
              bairro={imovel.bairro}
              cidade={imovel.cidade}
              estado={imovel.estado}
              estadoSigla={imovel.estadoSigla}
              valor={imovel.valor}
              quartos={imovel.quartos}
              banheiros={imovel.banheiros}
              garagens={imovel.garagens}
              areaConstruida={imovel.areaConstruida}
              areaTerreno={imovel.areaTerreno}
              modalidade={imovel.modalidade}
              fotos={imovel.fotos}
              captador={imovel.captador}
              permuta={imovel.permuta}
              tipo={imovel.tipo}
              subtipo={imovel.subtipo}
              exibirDetalhesEnderecoSite={imovel.exibirDetalhesEnderecoSite}
              numero={imovel.numero}
              complemento={imovel.complemento}
              logradouro={imovel.logradouro}
            />
          ))}
        </div>

        {imoveis.imoveis.length < totalImoveis && (
          <div className="flex justify-center mt-8">
            <button onClick={carregarMaisImoveis} className="bg-azul text-white py-2 px-4 rounded-lg">
              Carregar mais imóveis
            </button>
          </div>
        )}

        <Suspense>
          <div className="pt-8"></div>
        </Suspense>
      </div>

      <Suspense>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Home;