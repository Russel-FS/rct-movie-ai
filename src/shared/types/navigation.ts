export type RootStackParamList = {
  MainTabs: undefined;
  GenreMovies: { generoId: number };
  AdminDashboard: undefined;
  DebugReserva: undefined;
  SeleccionLugar: { peliculaId: string };
  SeleccionHorario: {
    peliculaId: string;
    cinemaId: number;
    cinemaName: string;
  };
  SeleccionButacas: {
    funcionId: string;
    peliculaId: string;
    cinemaId: number;
    cinemaName: string;
  };
  SeleccionComidas: {
    funcionId: string;
    salaId: number;
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
    funcionId: string;
    peliculaId: string;
    salaId: number;
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
    funcionId: string;
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
  Perfil: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
