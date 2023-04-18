import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-crud-operations',
  templateUrl: './crud-operations.component.html',
  styleUrls: ['./crud-operations.component.css']
})
export class CrudOperationsComponent implements OnInit {

  constructor() { }

  insertForm = new FormGroup({
    empId: new FormControl(null, Validators.required),
    name: new FormControl(null, Validators.required),
    department: new FormControl(null, Validators.required),
    salary: new FormControl(null, Validators.required)
  });

  ngOnInit(): void {
  }

}
