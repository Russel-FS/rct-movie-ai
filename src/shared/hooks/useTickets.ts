import { useState, useEffect } from 'react';
import { TicketStorageService, Ticket } from '../services/ticketStorage.service';

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const userTickets = await TicketStorageService.getTickets();
      setTickets(userTickets);
    } catch (err) {
      setError('Error al cargar las entradas');
      console.error('Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveTicket = async (ticketData: Omit<Ticket, 'id' | 'qrValue' | 'fechaCompra'>) => {
    try {
      const ticket: Ticket = {
        ...ticketData,
        id: TicketStorageService.generateTicketId(),
        qrValue: TicketStorageService.generateQRValue(ticketData),
        fechaCompra: new Date().toISOString(),
      };

      await TicketStorageService.saveTicket(ticket);
      await loadTickets();
      return ticket;
    } catch (err) {
      setError('Error al guardar la entrada');
      console.error('Error saving ticket:', err);
      throw err;
    }
  };

  const deleteTicket = async (id: string) => {
    try {
      await TicketStorageService.deleteTicket(id);
      await loadTickets();
    } catch (err) {
      setError('Error al eliminar la entrada');
      console.error('Error deleting ticket:', err);
      throw err;
    }
  };

  const getTicketById = async (id: string): Promise<Ticket | null> => {
    try {
      return await TicketStorageService.getTicketById(id);
    } catch (err) {
      console.error('Error getting ticket by id:', err);
      return null;
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  return {
    tickets,
    loading,
    error,
    saveTicket,
    deleteTicket,
    getTicketById,
    refreshTickets: loadTickets,
  };
};
