import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TemporizadorService } from '../../shared/services/temporizador.service';
import { MessageService } from 'primeng/api';
import { PartidosService, SaveMatchRequest } from '../../shared/services/partidos.service';

type TeamKey = 'home' | 'away';
@Component({
  selector: 'app-marcador',
  templateUrl: './marcador.component.html',
  styleUrls: ['./marcador.component.scss']
})
export class MarcadorComponent implements OnDestroy {
   // Estado principal
  teamName = { home: 'LOCAL', away: 'VISITANTE' };
  score    = { home: 0,       away: 0 };
  fouls    = { home: 0,       away: 0 };

  teamColor = {
  home: '#2563EB', // azul por defecto (local)
  away: '#EF4444'  // rojo por defecto (visitante)
};

  quarter = 1;
  maxQuarters = 4;

  // Config
  autoAdvance = true;
  quarterOptions = [
    { label: '10 min (FIBA)', value: 10 * 60 },
    { label: '12 min (NBA)',  value: 12 * 60 },
    { label: '8 min (Escolar)', value: 8 * 60 }
  ];
  selectedDuration = this.quarterOptions[0].value;

  // Tiempo
  remainingSec = this.selectedDuration;
  private subs: Subscription[] = [];

    // Flags de guardado final
  private savingFinal = false;
  private finalSaved = false;

  constructor(
    public timer: TemporizadorService,
    private toast: MessageService,
        private partidoServ: PartidosService     // ← servicio inyectado
  ) {
    this.timer.setDuration(this.selectedDuration);

    this.subs.push(
      this.timer.remainingTime$.subscribe(sec => {
        this.remainingSec = sec;
        if (sec === 0) {
          this.onQuarterFinished();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  //=== COLORES PARA EL EQUIPO DINAMICO ===//
  onColorChange() {
  // (Opcional) persistir
  localStorage.setItem('sb_colors', JSON.stringify(this.teamColor));
}
getTeamStyles(team: TeamKey) {
  const c = this.teamColor[team];
  return {
    // variable CSS para usar en SCSS
    '--team-color': c,
    // fallback directo por si el tema ignora variables
    'border-top': `6px solid ${c}`,
    'box-shadow': `0 10px 30px -12px ${c}AA`
  };
}
getContrast(hex: string) {
  const h = hex.replace('#','');
  const r = parseInt(h.substring(0,2),16);
  const g = parseInt(h.substring(2,4),16);
  const b = parseInt(h.substring(4,6),16);
  const yiq = (r*299 + g*587 + b*114) / 1000;
  return yiq >= 128 ? '#111111' : '#ffffff';
}
  // ====== PUNTOS ======
  addPoints(team: TeamKey, pts: number) {
    this.score[team] = Math.max(0, this.score[team] + pts);
  }
  undoPoint(team: TeamKey) {
    this.score[team] = Math.max(0, this.score[team] - 1);
  }

  // ====== FALTAS ======
  addFoul(team: TeamKey) {
    this.fouls[team] = Math.max(0, this.fouls[team] + 1);
  }
  undoFoul(team: TeamKey) {
    this.fouls[team] = Math.max(0, this.fouls[team] - 1);
  }
  resetTeamFouls() {
    this.fouls = { home: 0, away: 0 };
  }

  // ====== TIEMPO ======
  onChangeDuration() {
    this.timer.setDuration(this.selectedDuration);
  }
  startPause() {
    if (this.timer.isRunning) this.timer.pause();
    else this.timer.start();
  }
  resetTimer() {
    this.timer.reset();
  }

  // ====== CUARTOS ======
 nextQuarter(manual = true) {
  if (this.quarter < this.maxQuarters) {
    this.quarter++;
    this.timer.setDuration(this.selectedDuration);
    this.resetTeamFouls();
    if (manual) {
      this.toast.add({ severity: 'info', summary: 'Cuarto', detail: `Inicia Q${this.quarter}` });
    }
  } else {
    // ↓↓↓ Detener reloj y dejarlo en 00:00 al finalizar el partido
    if (typeof (this.timer as any).finish === 'function') {
      (this.timer as any).finish();      // pausa + remaining = 0 (si existe en tu servicio)
    } else {
      this.timer.pause();                 // fallback: pausar
      this.remainingSec = 0;             // forzar visualmente 00:00
    }

    this.toast.add({ severity: 'success', summary: 'Final', detail: 'Fin del partido' });
    this.beepBuzzer();
    this.saveFinalMatch();
  }
}


onQuarterFinished() {
  // Si terminó el último cuarto, finaliza el partido (detiene reloj + guarda)
  if (this.quarter === this.maxQuarters) {
    if (typeof (this.timer as any).finish === 'function') {
      (this.timer as any).finish();
    } else {
      this.timer.pause();
      this.remainingSec = 0;
    }

    this.toast.add({ severity: 'success', summary: 'Final', detail: 'Fin del partido' });
    this.beepBuzzer();
    this.saveFinalMatch();
    return; // evita beeps/delays extra
  }

  // Para Q1–Q3: flujo normal de fin de cuarto
  this.beepBuzzer();
  this.toast.add({ severity: 'warn', summary: 'Tiempo', detail: `Fin del Q${this.quarter}` });
  if (this.autoAdvance) {
    setTimeout(() => this.nextQuarter(false), 800);
  }
}


    private saveFinalMatch() {
    if (this.savingFinal || this.finalSaved) return; // evita dobles envíos
    this.savingFinal = true;

    const payload: SaveMatchRequest = {
      homeName: this.teamName.home,
      awayName: this.teamName.away,
      homeScore: this.score.home,
      awayScore: this.score.away,
      homeFouls: this.fouls.home,
      awayFouls: this.fouls.away,
      quarterDurationSec: this.selectedDuration,
      quartersPlayed: this.maxQuarters,
      homeColorHex: this.teamColor.home,
      awayColorHex: this.teamColor.away,
      // Si tienes stats por cuarto, empaquétalas:
      // extraJson: JSON.stringify({ q1: 20, q2: 18, q3: 22, q4: 18 })
    };

    this.partidoServ.saveMatch(payload).subscribe({
      next: () => {
        this.finalSaved = true;
        this.toast.add({ severity: 'success', summary: 'Guardado', detail: 'Partido guardado correctamente' });
      },
      error: (err) => {
        const msg = (err?.error && typeof err.error === 'string') ? err.error : 'No se pudo guardar el partido';
        this.toast.add({ severity: 'error', summary: 'Error', detail: msg });
        console.error('Error guardando partido', err);
      },
      complete: () => {
        this.savingFinal = false;
      }
    });
  }

  // ====== GENERAL ======
  fullReset() {
    this.score = { home: 0, away: 0 };
    this.fouls = { home: 0, away: 0 };
    this.quarter = 1;
    this.timer.setDuration(this.selectedDuration);
    this.toast.add({ severity: 'success', summary: 'Reiniciado', detail: 'Marcador y reloj reiniciados' });
    this.finalSaved = false; 
  }

  // Buzzer simple con WebAudio
  private beepBuzzer() {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'square';
      o.frequency.value = 440;
      o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 0.01);
      o.start();
      setTimeout(() => {
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
        setTimeout(() => { o.stop(); ctx.close(); }, 200);
      }, 900);
    } catch { /* silencioso si el navegador bloquea audio */ }
  }

  // Utilidad de formato mm:ss
  fmt(sec: number) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

async saveMatch(result: any) {
  const resp = await fetch('http://localhost:8080/api/matches', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result)
  });
  if (!resp.ok) throw new Error(await resp.text());
  return resp.json();
}
}
