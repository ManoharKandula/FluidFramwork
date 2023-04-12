/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import {HttpClientModule } from "@angular/common/http";

@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule, HttpClientModule],
	providers: [],
	bootstrap: [AppComponent],
})

export class AppModule {}
