export interface CharacterListItem {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  image: string;
  url: string;
  created: string;
}

export interface RickAndMortyResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    previous: string | null;
  };
  results: CharacterListItem[];
}

export interface CharacterDetail {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}
