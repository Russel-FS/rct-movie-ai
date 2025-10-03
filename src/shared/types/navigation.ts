export type RootStackParamList = {
  MainTabs: undefined;
  GenreMovies: { generoId: number };
  SeleccionLugar: { peliculaId: string };
  SeleccionHorario: {
    peliculaId: string;
    cinemaId: number;
    cinemaName: string;
  };
  SeleccionButacas: {
    peliculaId: string;
    cinemaId: number;
    cinemaName: string;
    funcionId: number;
    fecha: string;
    hora: string;
    sala: string;
    formato: string;
    precio: number;
  };
  SeleccionComidas: {
    peliculaId: string;
    cinemaName: string;
    fecha: string;
    hora: string;
    sala: string;
    formato: string;
    precio: number;
    asientosSeleccionados: string[];
  };
  MetodoPago: {
    peliculaId: string;
    cinemaName: string;
    fecha: string;
    hora: string;
    sala: string;
    formato: string;
    asientosSeleccionados: string[];
    comidas?: {
      id: number;
      nombre: string;
      cantidad: number;
      precio: number;
    }[];
    subtotalEntradas: number;
    subtotalComidas: number;
    totalPagar: number;
  };
  ResumenPago: {
    peliculaId: string;
    cinemaName: string;
    fecha: string;
    hora: string;
    sala: string;
    formato: string;
    asientosSeleccionados: string[];
    comidas?: {
      id: number;
      nombre: string;
      cantidad: number;
      precio: number;
    }[];
    metodoPago: string;
    codigoOperacion: string;
    subtotalEntradas: number;
    subtotalComidas: number;
    totalPagado: number;
  };
};

export type MainTabParamList = {
  Inicio: undefined;
  Cartelera: undefined;
  MisEntradas: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
