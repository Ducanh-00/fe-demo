import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IFilterFormCase, IListCaseResponse } from './interface.ts';
import { IPaginationParams } from '@vks/app/shared/models';
import { IBaseResponse } from '../base-response.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CaseManagementApiService {
  urlCase: string = 'http://localhost:3000/api/cases';
  constructor(private http: HttpClient) {}
  getListCase<T>(
    data: IFilterFormCase,
    params: IPaginationParams
  ): Observable<IBaseResponse<T>> {
    const httpParams = params
      ? new HttpParams({
          fromObject: {
            page: params.page.toString(),
            pageSize: params.pageSize.toString(),
          },
        })
      : new HttpParams();

    return this.http.get<IBaseResponse<T>>(this.urlCase, {
      params: httpParams,
    });
  }
  createCase(data: IFilterFormCase): Observable<any> {
    return this.http.post(this.urlCase, { data });
  }

  editCase(id: string, data: IFilterFormCase): Observable<any> {
    return this.http.put(`${this.urlCase}/${id}`, { data });
  }

  deleteCase(id: string): Observable<any> {
    return this.http.delete(`${this.urlCase}/${id}`);
  }

  getListFilterCase(
    filter: any,
    pageSize: number,
    page: number
  ): Observable<IBaseResponse<IListCaseResponse>> {
    let httpParams = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filter.name) httpParams = httpParams.set('name', filter.name);
    if (filter.statusName)
      httpParams = httpParams.set('statusName', filter.statusName);
    if (filter.departmentName)
      httpParams = httpParams.set('departmentName', filter.departmentName);
    if (filter.actualTime)
      httpParams = httpParams.set('actualTime', filter.actualTime);
    if (filter.updateAt)
      httpParams = httpParams.set('updateAt', filter.updateAt);

    return this.http.get<IBaseResponse<IListCaseResponse>>(this.urlCase, {
      params: httpParams,
    });
  }
}
