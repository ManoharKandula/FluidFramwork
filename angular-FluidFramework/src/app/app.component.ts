/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { Component, OnInit, OnDestroy } from "@angular/core";
import { SharedMap } from "fluid-framework";
import { TinyliciousClient } from "@fluidframework/tinylicious-client";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from "rxjs";



@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"],
})

export class AppComponent implements OnInit, OnDestroy {
	sharedMap: SharedMap | undefined;
	empData: any;
	container: any;
	getEmpUpdate: (() => void) | undefined;
	constructor(){

	}

	async ngOnInit() {
		//this.empData = this.getEmpData();
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

	// getEmpData(): Observable<any> {
    //     return this._httpc.get();
    // }
}
