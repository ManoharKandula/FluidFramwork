/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { Component, OnInit, OnDestroy } from "@angular/core";
import { SharedMap } from "fluid-framework";
import { TinyliciousClient } from "@fluidframework/tinylicious-client";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from "rxjs";
import { EmployeeService } from "./Service/employee.service";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';



@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"],
})

export class AppComponent implements OnInit, OnDestroy {
	sharedMap: SharedMap | undefined;
	sharedEmpData: any;
	container: any;
	empDataList: any;
	departments: any;

	empForm: FormGroup;
	getEmpUpdate: (() => void) | undefined;
	constructor(private empService: EmployeeService, private _fb: FormBuilder, ){
		this.getEmpData();
		this.empForm = new FormGroup({
			name: new FormControl(null, Validators.required),
			salary: new FormControl(null, Validators.required),
			department: new FormControl(null, Validators.required),
			employeeId: new FormControl(null, Validators.required)
		})
	}

	async ngOnInit() {
		this.departments = this.getDepartments();
		this.sharedMap = await this.getFluidData();
		this.syncData();
		
	}

	async getFluidData(){
		const client = new TinyliciousClient();
		console.log(client);
		const containerSchema = {
			initialObjects: { empMap: SharedMap },
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
		return this.container.initialObjects.empMap as SharedMap;
	}

	syncData() {
		// Only sync if the Fluid SharedMap object is defined.
		if (this.sharedMap) {
			this.sharedMap?.set("EmpTable", this.empDataList);
			
			this.getEmpUpdate = () => {
				this.sharedEmpData = this.sharedMap?.get("EmpTable");
			}
			this.getEmpUpdate();

			// TODO 5: Register handlers.
			this.sharedMap!.on("valueChanged", this.getEmpUpdate);
		}
	}

	async onButtonClick() {
		//this.sharedMap = this.container.initialObjects.empMap as SharedMap;
		//this.sharedMap = await this.getFluidData();
		this.sharedMap?.set("emp", "Jackson");
		console.log(this.sharedEmpData);
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
		for (let i = 0; i < this.sharedEmpData.length; i++) {
			if (this.sharedEmpData[i].id === id) {
				this.sharedEmpData.splice(i, 1);
				this.sharedMap?.set("EmpTable", this.sharedEmpData);
				this.empService.deleteEmployee(id).subscribe();
				break;
			}
		}
	}

	insertEmployee(){
		console.log(this.empForm.value);
		this.empService.insertEmployee(this.empForm.value).subscribe((data) => {
			console.log(data);
			this.sharedEmpData.push(data);
			this.sharedMap?.set("EmpTable", this.sharedEmpData);
		});
		//this.sharedEmpData.push(emp);
		console.log(this.sharedEmpData);
		
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
