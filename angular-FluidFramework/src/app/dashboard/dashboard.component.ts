import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import TinyliciousClient from '@fluidframework/tinylicious-client';
import { SharedMap } from 'fluid-framework';
import { EmployeeService } from '../Service/employee.service';
import { EmployeeEntity } from '../Model/empTable.model';
import { Employee } from '../Model/employee.model';
import { DeptName } from '../Model/deptName.enum';
import { log } from 'console';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  sharedMap: SharedMap | undefined;
  deptSharedMap: SharedMap | undefined;
	empDataList: any;
	container: any;
	departments: any;
	empForm: FormGroup;
  insertForm: FormGroup;
	getEmpUpdate: (() => void) | undefined;
  getDeptUpdate: (() => void) | undefined;

  constructor(private empService: EmployeeService, private _fb: FormBuilder) {
    this.getEmpData();
		this.empForm = new FormGroup({
			name: new FormControl(null, Validators.required),
			salary: new FormControl(null, Validators.required),
			department: new FormControl(null, Validators.required)
		});

    this.insertForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      department: new FormControl(null, Validators.required),
      salary: new FormControl(null, Validators.required)
    });
  }

  async ngOnInit() {
		this.getDepartments();
    var fluidData = await this.getFluidData();
		this.sharedMap = fluidData.empMap;
    this.deptSharedMap = fluidData.deptData;
		this.syncData();
	}

	async getFluidData(){
		const client = new TinyliciousClient();
		console.log(client);
		const containerSchema = {
			initialObjects: { empMap: SharedMap, deptData: SharedMap },
		};

		let result;
		const containerId = location.hash.substring(1);
		if (!containerId) {
			result = await client.createContainer(containerSchema);
			this.container = result.container;
			const id = await this.container.attach();
			console.log(id);
			location.hash = id;
		} else {
			result = await client.getContainer(containerId, containerSchema);
			this.container = result.container;
		}

		// TODO 3: Return the Fluid timestamp object.
		return this.container.initialObjects;
	}

	syncData() {
		// Only sync if the Fluid SharedMap object is defined.
		if (this.sharedMap) {
			this.sharedMap?.set("EmpTable", this.empDataList);
			
			this.getEmpUpdate = () => {
				this.empDataList = this.sharedMap?.get("EmpTable");
			}
			this.getEmpUpdate();

			// TODO 5: Register handlers.
			this.sharedMap!.on("valueChanged", this.getEmpUpdate);
		}
    if (this.deptSharedMap) {
			this.deptSharedMap?.set("DeptTable", this.departments);
			
			this.getDeptUpdate = () => {
				this.departments = this.deptSharedMap?.get("DeptTable");
			}
			this.getDeptUpdate();

			// TODO 5: Register handlers.
			this.deptSharedMap!.on("valueChanged", this.getDeptUpdate);
		}
	}

	async onButtonClick() {
		//this.sharedMap = this.container.initialObjects.empMap as SharedMap;
		//this.sharedMap = await this.getFluidData();
		this.sharedMap?.set("emp", "Jackson");
		console.log(this.empDataList);
	}

	ngOnDestroy(){
		//this.sharedMap!.off("valueChanged", this.getEmpUpdate);
	}

	getEmpData() {
		this.empService.getEmployees()
		.subscribe((data) => {
			console.log(data);
			this.empDataList = data;
		});
    }

	deleteEmp(emp: any) {
		for (let i = 0; i < this.empDataList.length; i++) {
			if (this.empDataList[i].id === emp.id) {
				this.empDataList.splice(i, 1);
				this.sharedMap?.set("EmpTable", this.empDataList);
        var index = this.departments.findIndex((item:any) => item.deptName == emp.deptName);
        this.departments[index].employeeCount--;
        this.deptSharedMap?.set("DeptTable", this.departments);
				this.empService.deleteEmployee(emp.id).subscribe();
				break;
			}
		}
	}

	getDeptName(deptId: number){
		if(this.departments != null && this.departments != undefined){
			var deptName = this.departments.filter((dept: any) => dept.deptId == deptId).DeptName;
			return deptName;
		}
	}

	getDepartments() {
		this.empService.getDepartments()
		.subscribe((data) => {
			console.log(data);
			this.departments = data;
      this.deptSharedMap?.set("DeptTable", this.departments);
		});
    }

    insertEmployee(){
      var newEmp = new EmployeeEntity();
      newEmp.deptId = this.insertForm.value.department;
      newEmp.name = this.insertForm.value.name;
      newEmp.salary = this.insertForm.value.salary
      this.empService.insertEmployee(newEmp).subscribe((data: any) => {
        
      var emp = new Employee();
      emp.id = Number(this.empDataList[this.empDataList.length - 1].id + 1);
      emp.salary = this.insertForm.value.salary;
      emp.name = this.insertForm.value.name;
      emp.deptName = DeptName[this.insertForm.value.department];
      this.empDataList.push(emp);
      this.sharedMap?.set("EmpTable", this.empDataList);
      var index = this.departments.findIndex((item:any) => item.deptName == emp.deptName);
      this.departments[index].employeeCount++;
      this.deptSharedMap?.set("DeptTable", this.departments);
    });
      //this.empDataList.push(emp);      
    }
}
