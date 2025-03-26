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
import { IAccountForm } from '@vks/app/pages/account-management/models';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { ICaseForm } from '../../../models/interfaces';

@Component({
  selector: 'vks-form-case',
  templateUrl: './form-case.component.html',
  styleUrl: './form-case.component.scss',
})
export class FormCaseComponent {
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
  ListLeader: IDropdownItem[] = [
    { label: 'Nguyen Van E', value: '1' },
    { label: 'Nguyen Van F', value: '2' },
  ];
  listDepartments: IDropdownItem[] = [
    { label: 'Phòng ban 1', value: '1' },
    { label: 'Phòng ban 2', value: '2' },
  ];
  listProsecutor: IDropdownItem[] = [
    { label: 'Nguyen Van A', value: '1' },
    { label: 'Nguyen Van B', value: '2' },
  ];
  listStatus: IDropdownItem[] = [
    { label: 'Processing', value: '1' },
    { label: 'Done', value: '2' },
  ];
  listAccused: IDropdownItem[] = [
    { label: 'Nguyen Van C', value: '1' },
    { label: 'Nguyen Van D', value: '2' },
  ];

  caseForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    code: ['', [Validators.required]],
    departmentName: ['', [Validators.required]],
    actualTime: ['', [Validators.required]],
    statusName: ['', [Validators.required]],
    updateAt: ['', [Validators.required]],
  });

  constructor(private formBuilder: FormBuilder) {}

  onSelectAvatar(event: FileSelectEvent) {
    const files = event.files;
    if (Array.from(files).length) {
      const file = files[0];
      const objectURL = URL.createObjectURL(new Blob([file]));
      this.imageForUpload = {
        ...file,
        objectURL,
      };
      this.caseForm.controls['avatar'].setValue('objectURL');
    }

    if (this.avatarInput?.files.length) {
      this.avatarInput.clearInputElement();
      this.avatarInput.clearIEInput();
      this.avatarInput.clear();
    }
  }

  onRemoveAvatar() {
    this.imageForUpload = null;
    this.caseForm.controls['avatar'].setValue('');
    console.log('avatarInput', this.avatarInput);
    if (this.avatarInput?.files) {
      this.avatarInput.clearInputElement();
      this.avatarInput.clearIEInput();
      this.avatarInput.clear();
    }
  }

  onSubmit() {
    console.log('this.caseForm.valid', this.caseForm.valid);
    if (this.caseForm.valid) {
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
  isStatusInvalid(fieldName: string): boolean {
    const field = this.caseForm.get(fieldName);
    return (field?.errors?.required &&
      field.touched &&
      this.submitted) as boolean;
  }

  resetForm() {
    this.submitted = false;
    this.caseForm.reset({
      username: '',
      avatar: '',
      fullName: '',
      roleId: null,
      departmentId: null,
      organizationId: null,
      phoneNumber: '',
      password: { value: '', disabled: true },
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
