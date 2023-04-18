/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import {HttpClientModule } from "@angular/common/http";
import { EmployeeService } from "./Service/employee.service";
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CrudOperationsComponent } from './crud-operations/crud-operations.component';
import { AppRoutingModule } from "./app-routing.module";

@NgModule({
	declarations: [AppComponent, DashboardComponent, CrudOperationsComponent],
	imports: [BrowserModule, HttpClientModule, FormsModule, 
		ReactiveFormsModule, AppRoutingModule],
	providers: [],
	bootstrap: [AppComponent],
})

export class AppModule {}
