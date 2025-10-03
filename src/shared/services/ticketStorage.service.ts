import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Ticket {
  id: string;
  codigoOperacion: string;
  qrValue: string;
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
  subtotalEntradas: number;
  subtotalComidas: number;
  totalPagado: number;
  fechaCompra: string;
}

const TICKETS_STORAGE_KEY = '@movie_tickets';

export class TicketStorageService {
  static async saveTicket(ticket: Ticket): Promise<void> {
    try {
      const existingTickets = await this.getTickets();
      const updatedTickets = [...existingTickets, ticket];
      await AsyncStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(updatedTickets));
    } catch (error) {
      console.error('Erro al guardar el ticket:', error);
      throw error;
    }
  }

  static async getTickets(): Promise<Ticket[]> {
    try {
      const ticketsJson = await AsyncStorage.getItem(TICKETS_STORAGE_KEY);
      return ticketsJson ? JSON.parse(ticketsJson) : [];
    } catch (error) {
      console.error('Error al obtener los tickets:', error);
      return [];
    }
  }

  static async getTicketById(id: string): Promise<Ticket | null> {
    try {
      const tickets = await this.getTickets();
      return tickets.find((ticket) => ticket.id === id) || null;
    } catch (error) {
      console.error('Error al obtener el ticket por id:', error);
      return null;
    }
  }

  static async deleteTicket(id: string): Promise<void> {
    try {
      const tickets = await this.getTickets();
      const updatedTickets = tickets.filter((ticket) => ticket.id !== id);
      await AsyncStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(updatedTickets));
    } catch (error) {
      console.error('Error al eliminar el ticket:', error);
      throw error;
    }
  }

  static async clearAllTickets(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TICKETS_STORAGE_KEY);
    } catch (error) {
      console.error('Error al eliminar todos los tickets:', error);
      throw error;
    }
  }

  static generateQRValue(ticket: Omit<Ticket, 'id' | 'qrValue' | 'fechaCompra'>): string {
    return `CINE_TICKET_${ticket.codigoOperacion}_${ticket.cinemaName}_${ticket.fecha}_${ticket.hora}_${ticket.asientosSeleccionados.join('-')}`;
  }

  static generateTicketId(): string {
    return `ticket_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
