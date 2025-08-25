import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemporizadorService {

    /** Duración del cuarto en segundos */
  private durationSec = 10 * 60; // default 10 min
  /** Tiempo restante en segundos */
  private remaining$ = new BehaviorSubject<number>(this.durationSec);
  /** Si está corriendo */
  private running$ = new BehaviorSubject<boolean>(false);

  private tickSub?: Subscription;
  private lastTick = 0;

  remainingTime$ = this.remaining$.asObservable();
  runningState$ = this.running$.asObservable();

  setDuration(seconds: number) {
    this.durationSec = Math.max(1, seconds);
    this.reset();
  }

  start() {
    if (this.running$.value) return;
    if (this.remaining$.value <= 0) this.reset();

    this.running$.next(true);
    this.lastTick = Date.now();

    this.tickSub = interval(200).subscribe(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - this.lastTick) / 1000);
      if (elapsed > 0) {
        this.lastTick = now;
        const next = this.remaining$.value - elapsed;
        this.remaining$.next(next > 0 ? next : 0);
        if (next <= 0) this.pause();
      }
    });
  }

  pause() {
    this.running$.next(false);
    this.tickSub?.unsubscribe();
    this.tickSub = undefined;
  }

  reset() {
    this.pause();
    this.remaining$.next(this.durationSec);
  }

  /** Forzar a 0 (fin de cuarto) */
  finish() {
    this.pause();
    this.remaining$.next(0);
  }

  get remainingSeconds() {
    return this.remaining$.value;
  }

  get isRunning() {
    return this.running$.value;
  }
}
