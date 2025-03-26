import { IFilterFormCase } from '@vks/app/https/case-management/interface.ts';
import { KeyAction } from '@vks/app/shared/models';
import { FilterFieldConfig } from '@vks/app/shared/ui-common/filter-common/filter-common.config';
import {
  actionConfig,
  ITableHeaderConfig,
} from '@vks/app/shared/ui-common/table-common/table.common.config';

export const constant = 'constant';

export const DefaultFilterDataCase: IFilterFormCase = {
  departmentName: '',
  textSearch: '',
  code: '',
  name: '',
  actualTime: '',
  updatedAt: '',
  statusName: '',
};

export const FilterConfigCase: FilterFieldConfig[] = [
  {
    type: 'text',
    label: 'Mã hoặc tên vụ án',
    name: 'name',
    placeholder: 'Nhập từ khoá tìm kiếm',
    col: 3,
  },
  {
    type: 'date',
    label: 'Từ ngày',
    name: 'actualTime',
    placeholder: 'Lọc từ ngày',
    col: 3,
  },
  {
    type: 'date',
    label: 'Đến ngày',
    name: 'updateAt',
    placeholder: 'Lọc đến ngày',
    col: 3,
  },
  {
    type: 'select',
    label: 'Phòng ban',
    name: 'departmentName',
    options: [],
    placeholder: 'Chọn phòng ban',
    col: 3,
  },

  {
    type: 'select',
    label: 'Trạng thái',
    name: 'statusName',
    options: [
      { value: 'ACTIVE', label: 'Hoạt động' },
      { value: 'INACTIVE', label: 'Không hoạt động' },
      { value: 'INITIAL', label: 'Khởi tạo' },
    ],
    placeholder: 'Chọn trạng thái',
    col: 3,
  },
];
export const ListCaseActionConfig: actionConfig[] = [
  { label: 'Cập nhật', icon: 'pi pi-file-edit', key: KeyAction.UPDATE },
  { label: 'Xoá', icon: 'pi pi-trash', key: KeyAction.REMOVE },
];
export const ConfigHeaderCase: ITableHeaderConfig[] = [
  { key: 'code', name: 'Mã vụ án' },
  { key: 'name', name: 'Tên vụ án' },
  { key: 'departmentName', name: 'Tên phòng ban' },
  { key: 'statusName', name: 'Trạng thái' },
  {
    key: 'actualTime',
    name: 'Ngày cập nhật mới nhất',
    pipe: 'date',
    pipeArg: ['DD-MM-YYYY'],
  },
  {
    key: 'updatedAt',
    name: 'Ngày lập thực tế',
    pipe: 'date',
    pipeArg: ['DD-MM-YYYY'],
  },
  {
    key: 'actions',
    name: 'Chức năng',
  },
];
