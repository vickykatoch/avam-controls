import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmployeeBuilder, Dept, DeptBuilder, Emp } from './model';

@Component({
  selector: 'avam-form-test',
  templateUrl: './form-test.component.html',
  styleUrls: ['./form-test.component.scss']
})
export class FormTestComponent implements OnInit {
  employeeGroup : FormGroup;
  depts : Dept[] = [];
  emp : Emp = EmployeeBuilder.build();
  isDisabled = true;
  selectedDept : Dept = this.depts[0];
  employees : Emp[];

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.depts = DeptBuilder.build();
    this.employeeGroup = this.fb.group({
      id : ['', [Validators.required, Validators.minLength(2)]],
      firstName : ['',[Validators.required]],
      lastName : ['',[Validators.required]],
      gender : ['', Validators.required],
      age : ['', Validators.required],
      dept : ['']
    });
    this.employeeGroup.patchValue(this.emp);
    // this.employeeGroup.controls['dept'].disable();
    // this.employeeGroup.controls['dept'].setValue(this.emp.dept);

  }

}
