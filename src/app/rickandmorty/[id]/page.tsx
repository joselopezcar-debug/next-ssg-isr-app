import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CharacterDetail, RickAndMortyResponse } from '@/types/rickandmorty';
import { Metadata } from 'next';

interface Params {
  id: string;
}

interface Props {
  params: Promise<Params>;
}

// 1. Obtener los datos con revalidación cada 10 días (864000 segundos) - ISR
async function getCharacter(id: string): Promise<CharacterDetail> {
  const res = await fetch(`https://rickandmortyapi.com{id}`, {
    next: { revalidate: 864000 } 
  });
  if (!res.ok) notFound();
  return res.json();
}

// 2. Generar parámetros estáticos para SSG en producción
export async function generateStaticParams() {
  const res = await fetch('https://rickandmortyapi.com');
  const data: RickAndMortyResponse = await res.json();
  
  return data.results.map((char) => ({
    id: char.id.toString(),
  }));
}

// 3. Generación de Metadata Dinámica
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const char = await getCharacter(id);
    return { title: `${char.name} - Info Multiuniverso` };
  } catch {
    return { title: 'Personaje no encontrado' };
  }
}

export default async function CharacterDetailPage({ params }: Props) {
  const { id } = await params;
  const char = await getCharacter(id);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/rickandmorty" className="text-lime-400 hover:text-lime-300 font-medium text-sm flex items-center gap-1">
          ← Volver al Portal
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        {/* Imagen del Personaje */}
        <div className="relative w-full md:w-80 aspect-square md:aspect-auto bg-slate-950">
          <Image
            src={char.image}
            alt={char.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Panel de Información Mapeada */}
        <div className="p-8 flex-1">
          <div className="mb-4">
            <h1 className="text-3xl font-black text-white mb-2">{char.name}</h1>
            <div className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${
                char.status.toLowerCase() === 'alive' ? 'bg-green-500' :
                char.status.toLowerCase() === 'dead' ? 'bg-red-500' : 'bg-gray-500'
              }`} />
              <span className="text-sm font-semibold capitalize text-slate-300">
                {char.status} — {char.species}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 border-t border-slate-800 pt-6 text-sm">
            <div>
              <p className="text-slate-500 font-bold uppercase text-xs">Género</p>
              <p className="text-white font-medium capitalize mt-0.5">{char.gender}</p>
            </div>

            <div>
              <p className="text-slate-500 font-bold uppercase text-xs">Tipo / Sub-especie</p>
              <p className="text-white font-medium mt-0.5">{char.type || 'Ninguno registrado'}</p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-slate-500 font-bold uppercase text-xs">Origen Espacial</p>
              <p className="text-white font-medium mt-0.5">{char.origin.name}</p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-slate-500 font-bold uppercase text-xs">Ubicación Actual</p>
              <p className="text-white font-medium mt-0.5">{char.location.name}</p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-slate-500 font-bold uppercase text-xs">Apariciones en Episodios</p>
              <p className="text-white font-medium mt-0.5">{char.episode.length} capítulos de la serie</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
