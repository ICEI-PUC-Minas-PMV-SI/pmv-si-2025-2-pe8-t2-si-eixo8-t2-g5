const db = require('../config/db');
const dayjs = require('dayjs');
require('dayjs/locale/pt-br');
dayjs.locale('pt-br');

const getAvailableSlots = async (date, serviceId) => {
    
    const configResult = await db.query('SELECT hora_inicio, hora_fim FROM horarios_configuracao WHERE ativo = true');
    const configRows = configResult.rows;

    if (configRows.length === 0) {
        return []; 
    }
    

    const queryBusy = `
        SELECT 
            a.data_hora,
            s.duration_minutes 
        FROM 
            agendamentos a
        JOIN 
            services s ON a.servico::int = s.id
        WHERE 
            DATE(a.data_hora) = $1 AND 
            a.status IN ('Pendente', 'Confirmado');
    `;
    const busyResult = await db.query(queryBusy, [date]);
    

    const busySlots = busyResult.rows.map(row => ({
        start: dayjs(row.data_hora),
        end: dayjs(row.data_hora).add(row.duration_minutes || 60, 'minute')
    }));

  
    const durationResult = await db.query('SELECT duration_minutes FROM services WHERE id = $1', [serviceId]);
    const durationMinutes = durationResult.rows[0]?.duration_minutes || 60;
 
    const allSlots = [];
   
    let currentSlotTime = dayjs(date).hour(8).minute(0);
    const endOfDay = dayjs(date).hour(22).minute(0);
    
    while (currentSlotTime.isBefore(endOfDay)) {
        allSlots.push(currentSlotTime.format('HH:mm'));
        currentSlotTime = currentSlotTime.add(60, 'minute'); // Intervalo de 1 hora
    }
 

    const availableSlots = allSlots.filter(slotStart => {
        const slotStartTime = dayjs(`${date} ${slotStart}`);
        const slotEndTime = slotStartTime.add(durationMinutes, 'minute');

        
        const isWorkingTime = configRows.some(config => {
            const inicio = dayjs(`${date} ${config.hora_inicio}`); 
            const fim = dayjs(`${date} ${config.hora_fim}`);     
            
    
            return slotStartTime.isAfter(inicio.subtract(1, 'minute')) && slotEndTime.isBefore(fim.add(1, 'minute'));
        });

        if (!isWorkingTime) {
            return false;
        }

        
        const isBusy = busySlots.some(busyApp => {
            
            return (slotStartTime.isBefore(busyApp.end) && slotEndTime.isAfter(busyApp.start));
        });

        return !isBusy;
    });

    return availableSlots;
};

module.exports = {
    getAvailableSlots,
};