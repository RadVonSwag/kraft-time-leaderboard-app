import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})

export class AppService {
  constructor(private httpClient: HttpClient) { }
  playtimeEndpoint = 'localhost:8080/playerstats/playtime';

  // static getPlaytime(): import("./player-stats-table/player-stats-table-datasource").PlayerStatsTableItem[] {
  //   return this.httpClient.get(this.playtimeEndpoint);
  // }


  
  
  // public static getPlaytime(this: any) {
  //   return this.httpClient.get(this.playtimeEndpoint);
  // }

}
