import { useState, useEffect, useMemo } from 'react';
import { SalaService } from '../services/sala.service';
import { Sala, Fila, Asiento } from '../types/sala';
import { Asiento as AsientoCinema, Fila as FilaCinema } from '../types/cinema';

interface UseButacasProps {
  funcionId: string;
  salaId: number;
  precioBase: number;
}

interface UseButacasReturn {
  filasData: FilaCinema[];
  asientosSeleccionados: string[];
  loading: boolean;
  error: string | null;
  toggleAsiento: (asientoId: string) => void;
  calcularTotal: () => number;
  getAsientoEstado: (asiento: AsientoCinema) => 'disponible' | 'seleccionado' | 'ocupado';
  setAsientosSeleccionados: (asientos: string[]) => void;
}

export function useButacas({ funcionId, salaId, precioBase }: UseButacasProps): UseButacasReturn {
  const [sala, setSala] = useState<Sala | null>(null);
  const [asientosOcupados, setAsientosOcupados] = useState<number[]>([]);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (funcionId && salaId && precioBase > 0) {
      loadButacas();
    } else {
      setLoading(false);
    }
  }, [funcionId, salaId, precioBase]);

  const loadButacas = async () => {
    try {
      setLoading(true);
      setError(null);

      if (funcionId && salaId > 0) {
        const result = await SalaService.getButacasParaFuncion(funcionId, salaId);
        setSala(result.sala);
        setAsientosOcupados(result.asientosOcupados);
      } else {
        setError('Datos insuficientes para cargar las butacas');
      }
    } catch (err) {
      console.error('Error al cargar butacas:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar butacas');
    } finally {
      setLoading(false);
    }
  };

  const filasData: FilaCinema[] = useMemo(() => {
    if (!sala?.filas || sala.filas.length === 0) {
      return [];
    }

    return sala.filas
      .filter((fila) => fila.activa)
      .sort((a, b) => a.numero_fila - b.numero_fila)
      .map(
        (fila: Fila): FilaCinema => ({
          letra: fila.letra,
          tipo: fila.tipo_fila as 'Normal' | 'VIP' | 'Premium',
          precio_multiplicador: fila.precio_multiplicador,
          asientos: (fila.asientos || [])
            .filter((asiento) => asiento.activo)
            .sort((a, b) => a.numero - b.numero)
            .map(
              (asiento: Asiento): AsientoCinema => ({
                id: `${fila.letra}${asiento.numero}`,
                numero: asiento.numero,
                ocupado: asientosOcupados.includes(asiento.id),
                precio: precioBase * fila.precio_multiplicador,
                tipo: asiento.tipo as 'Normal' | 'VIP' | 'Discapacitado' | 'Pareja',
              })
            ),
        })
      );
  }, [sala, asientosOcupados, precioBase]);

  // Crear mapa de asientos para búsqueda rápida
  const asientosMap = useMemo(() => {
    const map = new Map<string, AsientoCinema>();
    filasData.forEach((fila) => {
      fila.asientos.forEach((asiento) => {
        map.set(asiento.id, asiento);
      });
    });
    return map;
  }, [filasData]);

  const toggleAsiento = (asientoId: string) => {
    const asiento = asientosMap.get(asientoId);
    if (asiento?.ocupado) return;

    if (asientosSeleccionados.includes(asientoId)) {
      setAsientosSeleccionados((prev) => prev.filter((id) => id !== asientoId));
    } else {
      setAsientosSeleccionados((prev) => [...prev, asientoId]);
    }
  };

  const getAsientoEstado = (asiento: AsientoCinema): 'disponible' | 'seleccionado' | 'ocupado' => {
    if (asiento.ocupado) return 'ocupado';
    return asientosSeleccionados.includes(asiento.id) ? 'seleccionado' : 'disponible';
  };

  const calcularTotal = (): number => {
    let total = 0;
    for (const asientoId of asientosSeleccionados) {
      const asiento = asientosMap.get(asientoId);
      if (asiento) {
        total += asiento.precio;
      }
    }
    return total;
  };

  return {
    filasData,
    asientosSeleccionados,
    loading,
    error,
    toggleAsiento,
    calcularTotal,
    getAsientoEstado,
    setAsientosSeleccionados,
  };
}
