import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CharacterDetail, RickAndMortyResponse } from '@/types/rickandmorty';
import { Metadata } from 'next';

// Definición correcta de los tipos tipados como Promesas
interface CharacterPageProps {
  params: Promise<{ id: string }>;
}

// 1. Obtener los datos con revalidación cada 10 días (ISR)
async function getCharacter(id: string): Promise<CharacterDetail | null> {
  try {
    const res = await fetch(`https://rickandmortyapi.com{id}`, {
      next: { revalidate: 864000 } 
    });
    
    // Si la red devuelve un HTML de bloqueo de Tecsup o un error, evitamos romper el build
    if (!res.ok || res.headers.get("content-type")?.includes("text/html")) {
      return null;
    }
    
    return await res.json();
  } catch (error) {
    console.warn("API inaccesible en este entorno de red local:", error);
    return null;
  }
}

// 2. Generar parámetros estáticos para SSG en producción
export async function generateStaticParams() {
  try {
    const res = await fetch('https://rickandmortyapi.com');
    if (!res.ok || res.headers.get("content-type")?.includes("text/html")) return [];
    
    const data: RickAndMortyResponse = await res.json();
    return data.results.map((char) => ({
      id: char.id.toString(),
    }));
  } catch {
    return []; // Retorno seguro contra firewalls
  }
}

// 3. Generación de Metadata Dinámica (Corregido con await params)
export async function generateMetadata({ params }: CharacterPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const char = await getCharacter(resolvedParams.id);
  if (!char) return { title: 'Portal Multiuniverso' };
  return { title: `${char.name} - Info` };
}

// 4. Componente de la Página (Corregido con await params y estilos de respaldo inline)
export default async function CharacterDetailPage({ params }: CharacterPageProps) {
  const resolvedParams = await params;
  const char = await getCharacter(resolvedParams.id);

  // SOLUCIÓN: Si la API no respondió o devolvió null, disparamos el Not Found de inmediato
  if (!char) {
    notFound();
  }

  // A partir de aquí, TypeScript sabe con 100% de certeza que 'char' NO es null
  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif', color: '#1e293b' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/rickandmorty" style={{ color: '#22c55e', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Volver al Portal
        </Link>
      </div>

      <div style={{ 
        background: '#fff', 
        border: '1px solid #e2e8f0', 
        borderRadius: '24px', 
        overflow: 'hidden', 
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
      }}>
        {/* Imagen del Personaje */}
        <div style={{ width: '300px', height: '300px', position: 'relative', backgroundColor: '#f1f5f9' }}>
          <Image
            src={char.image}
            alt={char.name}
            fill
            sizes="300px"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Panel de Información */}
        <div style={{ padding: '30px', flex: '1', minWidth: '280px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 10px 0', color: '#0f172a' }}>{char.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                height: '10px', 
                width: '10px', 
                borderRadius: '50%', 
                display: 'inline-block',
                backgroundColor: char.status.toLowerCase() === 'alive' ? '#22c55e' : char.status.toLowerCase() === 'dead' ? '#ef4444' : '#64748b'
              }} />
              <span style={{ fontSize: '14px', fontWeight: '600', textTransform: 'capitalize', color: '#475569' }}>
                {char.status} — {char.species}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', borderTop: '1px solid #e2e8f0', paddingTop: '20px', fontSize: '13px' }}>
            <div>
              <p style={{ color: '#94a3b8', margin: '0 0 4px 0', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '11px' }}>Género</p>
              <p style={{ color: '#0f172a', margin: 0, fontWeight: '500', textTransform: 'capitalize' }}>{char.gender}</p>
            </div>

            <div>
              <p style={{ color: '#94a3b8', margin: '0 0 4px 0', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '11px' }}>Sub-especie</p>
              <p style={{ color: '#0f172a', margin: 0, fontWeight: '500' }}>{char.type || 'Ninguno'}</p>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <p style={{ color: '#94a3b8', margin: '0 0 4px 0', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '11px' }}>Origen</p>
              <p style={{ color: '#0f172a', margin: 0, fontWeight: '500' }}>{char.origin.name}</p>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <p style={{ color: '#94a3b8', margin: '0 0 4px 0', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '11px' }}>Ubicación Actual</p>
              <p style={{ color: '#0f172a', margin: 0, fontWeight: '500' }}>{char.location.name}</p>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <p style={{ color: '#94a3b8', margin: '0 0 4px 0', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '11px' }}>Capítulos de la serie</p>
              <p style={{ color: '#0f172a', margin: 0, fontWeight: '500' }}>Aparece en {char.episode.length} episodios</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}