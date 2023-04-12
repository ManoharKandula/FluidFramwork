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



@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"],
})

export class AppComponent implements OnInit, OnDestroy {
	sharedMap: SharedMap | undefined;
	empData: any;
	container: any;
	empDataList: any;
	getEmpUpdate: (() => void) | undefined;
	constructor(private empService: EmployeeService ){

	}

	async ngOnInit() {
		var info = this.getEmpData();
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
			this.sharedMap?.set("emp", "michael");
			
			this.getEmpUpdate = () => {
				this.empData = this.sharedMap?.get("emp");
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
		console.log(this.empData);
	}

	ngOnDestroy(){
		//this.sharedMap!.off("valueChanged", this.getEmpUpdate);
	}

	getEmpData() {
		this.empService.getEmployees()
		.subscribe((data) => {
			console.log(data);
			this.empDataList = data;
			// if(data != null)
			// {
			// 	this.empDataList = data;
			// }
		});
		return this.empDataList;
    }
}
