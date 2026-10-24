'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-white">
      <h2 className="text-3xl font-bold mb-4">¡Ups! Algo salió mal</h2>
      <p className="text-purple-200 mb-6">{error.message || 'Error al cargar los datos.'}</p>
      <button
        onClick={() => reset()}
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
