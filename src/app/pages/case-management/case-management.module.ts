import { input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CaseManagementComponent } from './screens/case-management.component';
import { CaseManagementRoutingModule } from './case-management-routing.module';
import { CaseManagementHttpService } from './case-management-http.service';
import { CaseManagementStateService } from './case-management-state.service';
import { FilterCommonComponent } from '../../shared/ui-common/filter-common/filter-common.component';
import { TableCommonComponent } from '../../shared/ui-common/table-common/table-common.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormCaseComponent } from './screens/components/form-case/form-case.component';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';

@NgModule({
  declarations: [CaseManagementComponent, FormCaseComponent],
  imports: [
    CommonModule,
    CaseManagementRoutingModule,
    FilterCommonComponent,
    TableCommonComponent,
    ButtonModule,
    DialogModule,
    ToastModule,
    RippleModule,
    MenuModule,
    InputTextModule,
    ReactiveFormsModule,
    FileUploadModule,
    DropdownModule,
    PasswordModule,
    DropdownModule,
  ],
  providers: [CaseManagementHttpService, CaseManagementStateService],
})
export class CaseManagementModule {}
