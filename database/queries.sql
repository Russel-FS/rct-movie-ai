-- Obtener funciones por película, cine y fecha
SELECT f.id, f.fecha_hora, f.formato, f.subtitulada, f.doblada, f.precio_base, f.precio_vip, s.nombre AS sala
FROM funciones f
JOIN salas s ON f.sala_id = s.id
WHERE f.pelicula_id = :pelicula_id
  AND f.sala_id = :sala_id
  AND DATE(f.fecha_hora) = :fecha
  AND f.activa = true
ORDER BY f.fecha_hora;

-- Asientos disponibles para una función
SELECT a.id, f.letra, a.numero, a.tipo
FROM asientos a
JOIN filas f ON a.fila_id = f.id
WHERE f.sala_id = :sala_id
  AND a.id NOT IN (
    SELECT e.asiento_id
    FROM entradas e
    JOIN reservas r ON e.reserva_id = r.id
    WHERE r.funcion_id = :funcion_id AND r.estado IN ('pendiente', 'confirmada')
  )
ORDER BY f.numero_fila, a.numero;










ORDER BY r.fecha_reserva DESC;WHERE r.usuario_id = :usuario_idJOIN salas s ON f.sala_id = s.idJOIN peliculas p ON f.pelicula_id = p.idJOIN funciones f ON r.funcion_id = f.idFROM reservas rSELECT r.id, r.codigo_reserva, r.estado, r.total, r.fecha_reserva, f.fecha_hora, p.titulo AS pelicula, s.nombre AS sala-- Historial de reservas por usuario






  AND fecha_fin >= NOW();  AND fecha_inicio <= NOW()  AND activa = trueWHERE codigo = :codigoFROM promocionesSELECT *-- Validar código de promoción