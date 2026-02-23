import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiResult } from '../../models/api-result.model';
import { CreateEntryRequest, Entry } from '../../models/entry.model';

@Injectable({ providedIn: 'root' })
export class EntryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/entries';

  create(request: CreateEntryRequest): Observable<Entry> {
    return this.http
      .post<ApiResult<Entry>>(this.baseUrl, request)
      .pipe(map((result) => result.data!));
  }

  findAll(memberName?: string): Observable<Entry[]> {
    let params = new HttpParams();
    if (memberName) {
      params = params.set('memberName', memberName);
    }
    return this.http
      .get<ApiResult<Entry[]>>(this.baseUrl, { params })
      .pipe(map((result) => result.data ?? []));
  }
}
