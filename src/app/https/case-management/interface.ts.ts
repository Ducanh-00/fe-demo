export interface IFilterFormCase {
  textSearch: string;
  code: string;
  name: string;
  actualTime: string;
  updatedAt: string;
  statusName: string;
  departmentName: string;
}

export interface IParamsPagination {
  pageSize: number;
  page: number;
}

export interface ICaseResponse {
  id: 0;
  code: string;
  name: string;
  departmentName: string;
  statusName: string;
  actualTime: string;
  updatedAt: string;
}
export interface IListCaseResponse {
  content: ICaseResponse[];
  totalRecords: number;
}
