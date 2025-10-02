INSERT ALL
  INTO ACTIVIDAD (nombre, descripcion, fecha, hora, ubicacion, nivel, num_pers_inscritas, num_pers_totales, estado, precio, id_usuario_creador) VALUES (
    'DOMINGO ⚽ PARTIDO FÚTBOL F7 MIXTO⚽NEW PLAYERS WELCOME ⚽CAMPO RODRÍGUEZ SAHAGÚN ⚽',
    NULL,
    TO_DATE('2025-09-21', 'YYYY-MM-DD'),
    TO_TIMESTAMP('20:00:00', 'HH24:MI:SS'),
    NULL,
    'Iniciado',
    14,
    14,
    'Pendiente',
    0.00,
    1
  )
  INTO ACTIVIDAD VALUES (
    'Iniciación al running en el Retiro (martes y jueves)',
    'Cansad@ de correr sol@? Te gustaría entrenar con un grupo de gente sana como tú que quiere ponerse en forma al aire libre?...',
    TO_DATE('2025-09-23', 'YYYY-MM-DD'),
    TO_TIMESTAMP('20:00:00', 'HH24:MI:SS'),
    'Parque del Retiro, Madrid, es',
    'Principiante',
    1,
    25,
    'Completada',
    10.00,
    2
  )
  INTO ACTIVIDAD VALUES (
    '🏐🏐PACHANGA VOLLEYGRASS + 🍻PICNIC TIME!! -WINTER TIME',
    'Eres nuev@ en Madrid , o te gustaría ampliar tu círculo de amig@s?...',
    TO_DATE('2025-09-19', 'YYYY-MM-DD'),
    TO_TIMESTAMP('16:30:00', 'HH24:MI:SS'),
    'Polideportivo Municipal La Bombilla, Madrid, MD, es',
    'Intermedio',
    1,
    15,
    'Completada',
    12.00,
    3
  )
  INTO ACTIVIDAD VALUES (
    'PLAY SOCCER & MAKE FRIENDS (MONDAYS & THURSDAYS)',
    'Join our Monday Indoor Soccer 5-a-side event...',
    TO_DATE('2025-09-25', 'YYYY-MM-DD'),
    TO_TIMESTAMP('20:00:00', 'HH24:MI:SS'),
    'Polideportivo Virgen del Carmen Betero, Valencia, es',
    'Principiante',
    1,
    NULL,
    'En curso',
    0.00,
    30
  )
  INTO ACTIVIDAD VALUES (
    'Baloncesto en parque Miraflores',
    'Todos los lunes intentaremos quedar a las 20:00...',
    TO_DATE('2025-09-22', 'YYYY-MM-DD'),
    TO_TIMESTAMP('20:00:00', 'HH24:MI:SS'),
    NULL,
    'Principiante',
    1,
    NULL,
    'En curso',
    0.00,
    43
  )
  INTO ACTIVIDAD VALUES (
    'Acantilados de Barbate- Torre del Tajo-Playa de la Hierbabuena',
    'IMPORTANTE: confirmar asistencia mediante whatsapp al 655 52 40 21...',
    TO_DATE('2025-09-20', 'YYYY-MM-DD'),
    TO_TIMESTAMP('20:00:00', 'HH24:MI:SS'),
    'PARKING Estación Blas Infante, Seville, AN, es',
    'Principiante',
    1,
    NULL,
    'En curso',
    0.00,
    19
  )
  INTO ACTIVIDAD VALUES (
    'Walking Club: Paseos, encuentros',
    '🚨 Para participar en este evento y conocer la ubicación exacta...',
    TO_DATE('2025-09-21', 'YYYY-MM-DD'),
    TO_TIMESTAMP('20:00:00', 'HH24:MI:SS'),
    NULL,
    'Principiante',
    9,
    22,
    'En curso',
    0.00,
    34
  )
  INTO ACTIVIDAD VALUES (
    '⛰️ Santurtzi - Serantes 😍 Intermedio 9km 💪🏾💰15€',
    '⭐️⭐️⭐️⭐️⭐️',
    TO_DATE('2025-09-21', 'YYYY-MM-DD'),
    TO_TIMESTAMP('20:00:00', 'HH24:MI:SS'),
    'Bar La Capi Gourmet, Santurtzi, es',
    'Principiante',
    27,
    NULL,
    'En curso',
    15.00,
    22
  )
  INTO ACTIVIDAD VALUES (
    'Bilbo, Mungia – Elordui, Gaztelugatxe, Sollube, Morga – Gernika, Bilbo',
    'Climbs: Elordui (1.3km al 6.7%), Gaztelugatxe (3.6km al 7.7%)...',
    TO_DATE('2025-09-20', 'YYYY-MM-DD'),
    TO_TIMESTAMP('20:00:00', 'HH24:MI:SS'),
    NULL,
    'Principiante',
    3,
    10,
    'En curso',
    0.00,
    39
  )
SELECT * FROM DUAL;