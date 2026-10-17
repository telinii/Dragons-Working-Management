import { WorkEvent, WorkEventType } from './work-event.entity';

export type ResumoDia = {
  data: string; // YYYY-MM-DD no fuso do usuário
  entrada: string | null; // ISO UTC
  saida: string | null;
  pausas: number; // minutos de pausa
  minutos: number; // minutos trabalhados (descontando pausas)
  aberto: boolean; // jornada sem saída registrada
};

export type ResumoMes = {
  dias: ResumoDia[];
  totalMinutos: number;
};

const MIN = 60_000;

/** Data (YYYY-MM-DD) de um instante UTC, no fuso informado. */
function dataNoFuso(iso: string | Date, timezone: string): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(iso));
  } catch {
    return new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(iso));
  }
}

export function calcularResumo(
  eventos: WorkEvent[],
  timezone: string,
): ResumoMes {
  const ordenados = [...eventos].sort(
    (a, b) => new Date(a.timestampUtc).getTime() - new Date(b.timestampUtc).getTime(),
  );

  const porDia = new Map<string, ResumoDia>();

  for (const ev of ordenados) {
    const data = dataNoFuso(ev.timestampUtc, ev.timezone ?? timezone);
    let dia = porDia.get(data);
    if (!dia) {
      dia = {
        data,
        entrada: null,
        saida: null,
        pausas: 0,
        minutos: 0,
        aberto: false,
      };
      porDia.set(data, dia);
    }

    switch (ev.type as WorkEventType) {
      case 'CLOCK_IN':
        if (!dia.entrada) dia.entrada = ev.timestampUtc.toISOString();
        break;
      case 'CLOCK_OUT': {
        if (!dia.entrada) break; // ignora saída sem entrada
        const inicio = new Date(dia.entrada).getTime();
        const fim = new Date(ev.timestampUtc).getTime();
        if (fim > inicio) dia.minutos += Math.round((fim - inicio) / MIN);
        dia.saida = ev.timestampUtc.toISOString();
        dia.aberto = false;
        break;
      }
      case 'BREAK_START':
        // pausa aberta: contabilizada quando encerrar
        dia.aberto = dia.aberto; // jornada continua aberta
        break;
      case 'BREAK_END':
        // duração da pausa: busca o BREAK_START anterior do mesmo dia
        {
          const idx = ordenados.findIndex(
            (e) => e.id === ev.id && e.type === 'BREAK_END',
          );
          let inicioPausa: string | null = null;
          for (let i = idx - 1; i >= 0; i--) {
            const ant = ordenados[i];
            if (dataNoFuso(ant.timestampUtc, ant.timezone ?? timezone) !== data)
              break;
            if (ant.type === 'BREAK_START') {
              inicioPausa = ant.timestampUtc.toISOString();
              break;
            }
          }
          if (inicioPausa) {
            const dur = new Date(ev.timestampUtc).getTime() - new Date(inicioPausa).getTime();
            if (dur > 0) dia.pausas += Math.round(dur / MIN);
          }
        }
        break;
    }
  }

  // desconta pausas dos minutos trabalhados
  const dias = [...porDia.values()]
    .map((d) => ({ ...d, minutos: Math.max(0, d.minutos - d.pausas) }))
    .sort((a, b) => a.data.localeCompare(b.data));

  return {
    dias,
    totalMinutos: dias.reduce((acc, d) => acc + d.minutos, 0),
  };
}