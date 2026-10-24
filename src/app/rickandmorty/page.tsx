'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CharacterListItem, RickAndMortyResponse } from '@/types/rickandmorty';

export default function RickAndMortyList() {
  const [characters, setCharacters] = useState<CharacterListItem[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<CharacterListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Inicialización limpia de estados para filtros reactivos (CSR)
  const [nameFilter, setNameFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<string>('');

  // Descarga inicial usando la URL base estática suministrada
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('https://rickandmortyapi.com/api/character', {
          cache: 'force-cache' // Forzar caché inicial (Comportamiento híbrido SSG)
        });
        const data: RickAndMortyResponse = await res.json();
        setCharacters(data.results);
        setFilteredCharacters(data.results);
      } catch (error) {
        console.error("Error cargando el portal:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Lógica de filtrado en tiempo real en el cliente (CSR) protegida contra campos vacíos
  useEffect(() => {
    const filtered = characters.filter((char) => {
      const matchName = char.name.toLowerCase().includes(nameFilter.toLowerCase());
      const matchStatus = statusFilter === '' || char.status.toLowerCase() === statusFilter.toLowerCase();
      
      // Control contra strings vacíos o nulos en propiedades de especie y subtipo
      const charType = char.type || '';
      const charSpecies = char.species || '';
      const matchType = typeFilter === '' || 
        charType.toLowerCase().includes(typeFilter.toLowerCase()) || 
        charSpecies.toLowerCase().includes(typeFilter.toLowerCase());
        
      const matchGender = genderFilter === '' || char.gender.toLowerCase() === genderFilter.toLowerCase();
      
      return matchName && matchStatus && matchType && matchGender;
    });
    setFilteredCharacters(filtered);
  }, [nameFilter, statusFilter, typeFilter, genderFilter, characters]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontFamily: 'sans-serif' }}>
        <p style={{ fontSize: '18px', color: '#64748b' }}>Abriendo portal dimensional...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif', color: '#1e293b' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', margin: '0 0 10px 0', color: '#0f172a' }}>Portal del Multiuniverso</h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>Búsqueda avanzada de personajes en tiempo real (CSR)</p>
      </header>

      {/* Contenedor de Filtros con Estructura Grid de Respaldo */}
      <div style={{ 
        background: '#f8fafc', 
        border: '1px solid #e2e8f0', 
        padding: '24px', 
        borderRadius: '16px', 
        marginBottom: '35px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nombre</label>
          <input
            type="text"
            placeholder="Ej. Rick, Morty..."
            style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estado</label>
          <select
            style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff', outline: 'none' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="alive">Vivo</option>
            <option value="dead">Muerto</option>
            <option value="unknown">Desconocido</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tipo / Especie</label>
          <input
            type="text"
            placeholder="Ej. Human, Alien..."
            style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Género</label>
          <select
            style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff', outline: 'none' }}
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="female">Femenino</option>
            <option value="male">Masculino</option>
            <option value="genderless">Sin Género</option>
            <option value="unknown">Desconocido</option>
          </select>
        </div>
      </div>

      {/* Grid Dinámico de Personajes */}
      {filteredCharacters.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#94a3b8', fontSize: '16px', fontWeight: '500' }}>
          No se encontraron personajes que coincidan con los criterios de búsqueda.
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
          gap: '25px' 
        }}>
          {filteredCharacters.map((char) => (
            <Link key={char.id} href={`/rickandmorty/${char.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ 
                background: '#fff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '16px', 
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
              }}>
                <div style={{ width: '100%', height: '240px', backgroundColor: '#f1f5f9', position: 'relative' }}>
                  <Image
                    src={char.image}
                    alt={char.name}
                    fill
                    sizes="(max-w-1200px) 25vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '20px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 10px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#0f172a' }}>
                    {char.name}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      height: '10px', 
                      width: '10px', 
                      borderRadius: '50%', 
                      display: 'inline-block',
                      backgroundColor: char.status.toLowerCase() === 'alive' ? '#22c55e' : char.status.toLowerCase() === 'dead' ? '#ef4444' : '#64748b'
                    }} />
                    <span style={{ fontSize: '13px', color: '#475569', fontWeight: '500', textTransform: 'capitalize' }}>
                      {char.status} — {char.species}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
