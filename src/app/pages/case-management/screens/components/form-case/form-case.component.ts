import { CaseManagementHttpService } from './../../../case-management-http.service';
import {
  Component,
  EventEmitter,
  Output,
  Input,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { IDropdownItem, REGEX_PHONE_NUMBER } from '@vks/app/shared/models';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { ICaseForm } from '../../../models/interfaces';
import { LoadingService } from '@vks/app/services';
import { delay, finalize } from 'rxjs';

@Component({
  selector: 'vks-form-case',
  templateUrl: './form-case.component.html',
  styleUrl: './form-case.component.scss',
})
export class FormCaseComponent {
  @Input()
  caseData!: ICaseForm;
  @Input()
  errors: Record<keyof ICaseForm, string[]> = {
    name: [],
    code: [],
    departmentName: [],
    actualTime: [],
    statusName: [],
    updateAt: [],
  };

  @Input()
  caseDetail: Partial<ICaseForm> = {
    name: '',
    code: '',
    departmentName: '',
    actualTime: '',
    statusName: '',
    updateAt: '',
  };
  @Output()
  unActiveForm = new EventEmitter();

  @Output() forward = new EventEmitter<ICaseForm>();

  @ViewChild('avatarInput') avatarInput: FileUpload | null = null;

  submitted = false;
  imageForUpload: (File & { objectURL: string }) | null = null;

  listDepartments: IDropdownItem[] = [
    { label: 'Phòng ban 1', value: '1' },
    { label: 'Phòng ban 2', value: '2' },
  ];
  listStatus: IDropdownItem[] = [
    { label: 'Sơ thẩm ', value: '1' },
    { label: 'Phúc thẩm', value: '2' },
  ];
  listRoles: IDropdownItem[] = [
    { label: 'Chức vụ 1', value: '1' },
    { label: 'Chức vụ 2', value: '2' },
  ];
  listUnits: IDropdownItem[] = [
    { label: 'Đơn vị 1', value: '1' },
    { label: 'Đơn vị 2', value: '2' },
  ];

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
    private loadingService: LoadingService,
    private CaseManagementHttpService: CaseManagementHttpService
  ) {}

  ngOnInit(): void {
    if (this.caseData) {
      this.caseForm.setValue({
        name: this.caseData.name,
        code: this.caseData.code,
        departmentName: this.caseData.departmentName,
        actualTime: this.caseData.actualTime,
        statusName: this.caseData.statusName,
        updateAt: this.caseData.updateAt,
      });
    }
  }

  onSubmit() {
    this.loadingService.showLoading(true);
    this.caseForm.get('actualTime')?.setValue(new Date().toISOString());
    console.log(this.caseForm.value);

    if (this.caseForm.valid) {
      this.CaseManagementHttpService.createNewCase(this.caseForm.value)
        .pipe(
          delay(2000),
          finalize(() => this.loadingService.showLoading(false))
        )
        .subscribe((response) => {
          this.loadingService.showLoading(false);
          console.log('Case created successfully:', response);
          this.submitted = false;
          this.caseForm.reset();
          this.forward.emit(response);
        });
      this.submitted = false;
      this.forward.emit(this.caseForm.value);
    } else {
      this.submitted = true;
      this.caseForm.markAllAsTouched();
    }
  }

  onCloseModal() {
    this.unActiveForm.emit();
    this.resetForm();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.caseForm.get(fieldName);
    return (field?.errors?.required &&
      field.touched &&
      this.submitted) as boolean;
  }

  resetForm() {
    this.submitted = false;
    this.caseForm.reset({
      name: '',
      code: '',
      departmentName: '',
      actualTime: '',
      statusName: '',
      updateAt: '',
    });

    this.imageForUpload = null;
    if (this.avatarInput) {
      this.avatarInput.clearInputElement();
      this.avatarInput.clearIEInput();
      this.avatarInput.clear();
    }

    Object.keys(this.caseForm.controls).forEach((key) => {
      const control = this.caseForm.get(key) as FormControl;
      control.markAsPristine();
      control.markAsUntouched();
      control.updateValueAndValidity();
    });
  }
}
