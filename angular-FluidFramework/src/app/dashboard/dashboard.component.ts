import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import TinyliciousClient from '@fluidframework/tinylicious-client';
import { SharedMap } from 'fluid-framework';
import { EmployeeService } from '../Service/employee.service';

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
	getEmpUpdate: (() => void) | undefined;
  getDeptUpdate: (() => void) | undefined;

  // @Input() childMessage: string;
  // @Input() childMessage: string;

  // @Output() empDataEvent = new EventEmitter<any>();
  // @Output() sharedmapEvent = new EventEmitter<any>();

  constructor(private empService: EmployeeService, private _fb: FormBuilder) {
    this.empDataList = this.getEmpData();
    //this.empDataEvent.emit(this.empDataList);
		this.empForm = new FormGroup({
			name: new FormControl(null, Validators.required),
			salary: new FormControl(null, Validators.required),
			department: new FormControl(null, Validators.required)
		})
  }

  async ngOnInit() {
		this.getDepartments();
    var fluidData = await this.getFluidData();
		this.sharedMap = fluidData.empMap;
    this.deptSharedMap = fluidData.deptData;
    this.empService.currentEmpData.subscribe(message => this.empDataList.push(message));
    this.sharedMap?.set("EmpTable", this.empDataList);
    //this.sharedmapEvent.emit(this.sharedMap);
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

	deleteEmp(id: number) {
		for (let i = 0; i < this.empDataList.length; i++) {
			if (this.empDataList[i].id === id) {
				this.empDataList.splice(i, 1);
				this.sharedMap?.set("EmpTable", this.empDataList);
				this.empService.deleteEmployee(id).subscribe();
        this.getDepartments();
        this.deptSharedMap?.set("DeptTable", this.departments);
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
		});
    }

}
