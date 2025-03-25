import { Component, OnInit } from '@angular/core';
import { CaseManagementHttpService } from '../case-management-http.service';
import { DEFAULT_TABLE_PAGE, DEFAULT_TABLE_SIZE } from '@vks/app/shared/models';
import {
  ConfigHeaderCase,
  DefaultFilterDataCase,
  FilterConfigCase,
} from '../models/constants';
import {
  CategoryService,
  LoadingService,
  UserInfoService,
} from '@vks/app/services';
import { delay, finalize, takeUntil } from 'rxjs';
import { ICaseResponse } from '@vks/app/https/case-management/interface.ts';
import { ICaseForm } from '../models/interfaces';
import { FormatDatePipe } from '@vks/app/shared/pipe';

@Component({
  selector: 'vks-case-management',
  templateUrl: './case-management.component.html',
  styleUrl: './case-management.component.scss',
})
export class CaseManagementComponent implements OnInit {
  readonly title = 'Danh sách vụ án';
  readonly filterConfigCase = FilterConfigCase;
  readonly configHeaderCase = ConfigHeaderCase;
  page = DEFAULT_TABLE_PAGE;
  pageSize = DEFAULT_TABLE_SIZE;
  defaultFilterDataCase = DefaultFilterDataCase;
  listCase: ICaseResponse[] = [];
  totalRecord: number = 0;
  isVisibleModal = false;
  constructor(
    private caseManagementHttpService: CaseManagementHttpService,
    private loadingService: LoadingService
  ) {}
  
  ngOnInit(): void {
    this.handleGetCaseManagement();
  }

  onFilter(filter: any) {
    console.log(filter);
  }

  onOpenModal() {
    this.isVisibleModal = true;
  }

  onCloseModal() {
    this.isVisibleModal = false;
  }

  onSubmit(formData: ICaseForm) {
    // //TODO: api add new Account
    // console.log('formData', formData)
    // void this.router.navigate([ERoute.ACCOUNT_MANAGEMENT + '/detail'], {
    //     queryParams: { accountId: 2 },
    // })
  }

  handleGetCaseManagement() {
    this.loadingService.showLoading(true);
    this.caseManagementHttpService
      .getListCaseManagement(
        this.defaultFilterDataCase,
        this.pageSize,
        this.page
      )
      .pipe(
        delay(2000),
        finalize(() => this.loadingService.showLoading(false))
        // takeUntil(this.destroyService),
      )
      .subscribe((listData) => {
        if (Array.isArray(listData)) {
          this.listCase = listData;
          this.totalRecord = listData.length;
        } else {
          console.error('Data structure is not as expected:', listData);
        }
      });
  }
}
