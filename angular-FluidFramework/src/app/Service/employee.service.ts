import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Employee } from "../Model/employee.model";

@Injectable({providedIn: "root"})
export class EmployeeService{

    constructor(private _httpc: HttpClient) {}

    getEmployees(){
        var data = this._httpc.get<Employee>("http://localhost:5080/api/Employee");
        console.log(data);
        return data;
    }
}