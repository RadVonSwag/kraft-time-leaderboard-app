import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { AppService } from '../app.service';
import { HttpClient } from '@angular/common/http'


// TODO: Replace this with your own data model type
export interface PlayerStatsTableItem {
  username: string;
  timePlayed: number;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: PlayerStatsTableItem[] = [
  {timePlayed: 1, username: 'Hydrogen'},
  {timePlayed: 2, username: 'Helium'},
  {timePlayed: 3, username: 'Lithium'},
  {timePlayed: 4, username: 'Beryllium'},
  {timePlayed: 5, username: 'Boron'},
  {timePlayed: 6, username: 'Carbon'},
  {timePlayed: 7, username: 'Nitrogen'},
  {timePlayed: 8, username: 'Oxygen'},
  {timePlayed: 9, username: 'Fluorine'},
  {timePlayed: 10, username: 'Neon'},
  {timePlayed: 11, username: 'Sodium'},
  {timePlayed: 12, username: 'Magnesium'},
  {timePlayed: 13, username: 'Aluminum'},
  {timePlayed: 14, username: 'Silicon'},
  {timePlayed: 15, username: 'Phosphorus'},
  {timePlayed: 16, username: 'Sulfur'},
  {timePlayed: 17, username: 'Chlorine'},
  {timePlayed: 18, username: 'Argon'},
  {timePlayed: 19, username: 'Potassium'},
  {timePlayed: 20, username: 'Calcium'},
];

let USER_CACHE: PlayerStatsTableItem[] = [];

/**
 * Data source for the PlayerStatsTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class PlayerStatsTableDataSource extends DataSource<PlayerStatsTableItem> {
  data: PlayerStatsTableItem[] = EXAMPLE_DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor(private httpClient: HttpClient) {
    super();
    
  }

  playtimeEndpoint = 'localhost:8080/playerstats/playtime';

  private fetchData() {
    return this.httpClient.get(this.playtimeEndpoint);
  }


  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<PlayerStatsTableItem[]> {
    console.log(this.fetchData());
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: PlayerStatsTableItem[]): PlayerStatsTableItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: PlayerStatsTableItem[]): PlayerStatsTableItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'username': return compare(a.username, b.username, isAsc);
        case 'timePlayed': return compare(+a.timePlayed, +b.timePlayed, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example timePlayed/username columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
