import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CrudOperationsComponent } from './crud-operations/crud-operations.component';

const routes: Routes = [

{path: "insert", component: CrudOperationsComponent},
{path: "dashboard", component: DashboardComponent},
{path: "", redirectTo: 'dashboard', pathMatch: 'full'}

];




@NgModule({
imports: [RouterModule.forRoot(routes)],

exports: [RouterModule]

})

export class AppRoutingModule { }