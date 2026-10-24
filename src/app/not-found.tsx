import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-white p-4">
      <h2 className="text-4xl font-bold mb-2 text-yellow-400">404 - Pokémon no encontrado</h2>
      <p className="text-purple-200 mb-6 text-center max-w-md">
        El espécimen que estás buscando no se encuentra registrado en nuestra base de datos.
      </p>
      <Link 
        href="/pokemon" 
        className="bg-white text-purple-900 font-bold py-3 px-6 rounded-lg hover:bg-purple-100 transition shadow-lg"
      >
        ← Volver al Pokédex
      </Link>
    </div>
  );
}