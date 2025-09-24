// Tipos simples para el sistema de cine

export interface Asiento {
  id: string;
  numero: number;
  ocupado: boolean;
  precio: number;
}

export interface Fila {
  letra: string;
  asientos: Asiento[];
}

export interface Sala {
  id: string;
  nombre: string;
  filas: Fila[];
}

export interface Funcion {
  id: string;
  peliculaId: string;
  salaId: string;
  fecha: string;
  hora: string;
  sala: Sala;
}
