import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Employee } from "../Model/employee.model";
import { Department } from "../Model/department.model";

@Injectable({providedIn: "root"})
export class EmployeeService{
    
    constructor(private _httpc: HttpClient) {}

    getEmployees(){
        var data = this._httpc.get<Employee>("https://fluidframeworkdemo.azurewebsites.net/api/GetEmpDetails?");
        return data;
    }

    getDepartments(){
        var data = this._httpc.get<Department>("https://fluidframeworkdemo.azurewebsites.net/api/GetDepartments?");
        return data;
    }

    deleteEmployee(id: number){
        var delEmp = "https://fluidframeworkdemo.azurewebsites.net/api/DelEmployee?EmployeeId="+ id;

        var data = this._httpc.delete(delEmp);
        return data;
    }

    insertEmployee(emp: any){
        return this._httpc.post<Employee>("https://fluidframeworkdemo.azurewebsites.net/api/PostEmpDetails?", emp);
    }
}