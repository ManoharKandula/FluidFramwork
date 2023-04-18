import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../Service/employee.service';


@Component({
  selector: 'app-crud-operations',
  templateUrl: './crud-operations.component.html',
  styleUrls: ['./crud-operations.component.css']
})
export class CrudOperationsComponent implements OnInit {
  empDataList:any
  sharedMap:any

  @Output() empDataEvent = new EventEmitter<any>();

  constructor(private empService: EmployeeService) { }

  insertForm = new FormGroup({
    name: new FormControl(null, Validators.required),
    department: new FormControl(null, Validators.required),
    salary: new FormControl(null, Validators.required)
  });

  ngOnInit(): void {
    // this.empService.currentEmpData.subscribe(message => this.empDataList = message)
    // this.empService.currentSharedMap.subscribe(message => this.sharedMap = message)
    //  console.log(this.empDataList);
  }

  insertEmployee(){
		console.log(this.insertForm.value);
		this.empService.insertEmployee(this.insertForm.value).subscribe((data) => {
			console.log(data);
      this.empDataEvent.emit(data);
			// this.empDataList.push(data);
			// this.sharedMap?.set("EmpTable", this.empDataList);
		});
		//this.empDataList.push(emp);
		console.log(this.empDataList);
		
	}
}
