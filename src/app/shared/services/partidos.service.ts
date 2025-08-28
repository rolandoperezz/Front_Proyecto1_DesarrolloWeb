import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SaveMatchRequest {
  homeName: string;
  awayName: string;
  homeScore: number;
  awayScore: number;
  homeFouls?: number;
  awayFouls?: number;
  quarterDurationSec?: number;
  quartersPlayed?: number;
  homeColorHex?: string;
  awayColorHex?: string;
  extraJson?: string;
}

export interface MatchResultDto {
  id: string;
  homeName: string;
  awayName: string;
  homeScore: number;
  awayScore: number;
  homeFouls: number;
  awayFouls: number;
  quarterDurationSec: number;
  quartersPlayed: number;
  homeColorHex?: string;
  awayColorHex?: string;
  endedAtUtc: string;
  extraJson?: string;
}

@Injectable({ providedIn: 'root' })
export class PartidosService {
  private base = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  saveMatch(payload: SaveMatchRequest): Observable<MatchResultDto> {
    return this.http.post<MatchResultDto>(`${this.base}/api/matches`, payload);
  }
}
