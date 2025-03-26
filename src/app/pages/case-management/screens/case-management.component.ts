import { Component, OnInit } from '@angular/core';
import { CaseManagementHttpService } from '../case-management-http.service';
import {
  DEFAULT_TABLE_PAGE,
  DEFAULT_TABLE_SIZE,
  KeyAction,
} from '@vks/app/shared/models';
import {
  ConfigHeaderCase,
  DefaultFilterDataCase,
  FilterConfigCase,
  ListCaseActionConfig,
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
import { actionConfig } from '@vks/app/shared/ui-common/table-common/table.common.config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'vks-case-management',
  templateUrl: './case-management.component.html',
  styleUrl: './case-management.component.scss',
})
export class CaseManagementComponent implements OnInit {
  currentCase: ICaseForm | null = null;
  readonly title = 'Danh sách vụ án';
  dialogheader = 'Thêm mới vụ án';
  readonly filterConfigCase = FilterConfigCase;
  readonly configHeaderCase = ConfigHeaderCase;
  page = DEFAULT_TABLE_PAGE;
  pageSize = DEFAULT_TABLE_SIZE;
  defaultFilterDataCase = DefaultFilterDataCase;
  listCase: ICaseResponse[] = [];
  totalRecord: number = 0;
  isVisibleModal = false;
  actionConfig = [...ListCaseActionConfig];
  caseForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    code: ['', [Validators.required]],
    departmentName: ['', [Validators.required]],
    actualTime: ['', [Validators.required]],
    statusName: ['', [Validators.required]],
    updateAt: ['', [Validators.required]],
  });
  constructor(
    private formBuilder: FormBuilder,
    private caseManagementHttpService: CaseManagementHttpService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.handleGetCaseManagement();
  }

  getActionConfigForItem(item: any): any[] {
    return this.actionConfig.map((action: any) => ({
      ...action,
      command: () => {
        if (action.key === KeyAction.UPDATE) {
          this.onEdit(item);
        } else if (action.key === KeyAction.REMOVE) {
          this.onDelete(item);
        }
      },
    }));
  }
  onEdit(item: any) {
    this.isVisibleModal = true;
    this.dialogheader = 'Cập nhật vụ án';
    this.currentCase = item;

    this.caseForm.setValue({
      name: item.name,
      code: item.code,
      departmentName: item.departmentName,
      actualTime: item.actualTime || new Date(),
      statusName: item.statusName,
      updateAt: item.updateAt || new Date(),
    });

    this.loadingService.showLoading(true);
    this.caseManagementHttpService.editCase(item, item._id);
  }
  onDelete(item: any) {
    this.loadingService.showLoading(true);
    this.caseManagementHttpService
      .deleteCase(item._id)
      .subscribe((response) => {
        this.loadingService.showLoading(false);
        console.log('Case deleted successfully:', response);
        this.handleGetCaseManagement();
      });
  }

  isDisableRemoveButton(itemActionConfig: actionConfig): boolean {
    return itemActionConfig.key === KeyAction.REMOVE;
  }

  onFilter(filter: any) {
    console.log('Filter values:', filter); 

    const filterData = {
      name: filter.name || '',
      statusName: filter.statusName || '',
      departmentName: filter.departmentName || '',
      actualTime: filter.actualTime || '',
      updateAt: filter.updateAt || '',
    };

    this.loadingService.showLoading(true);
    this.caseManagementHttpService
      .getListFilterCase(filterData)
      .pipe(
        delay(2000),
        finalize(() => this.loadingService.showLoading(false))
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
