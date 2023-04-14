import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Employee } from "../Model/employee.model";

@Injectable({providedIn: "root"})
export class EmployeeService{
    
    constructor(private _httpc: HttpClient) {}

    getEmployees(){
        var data = this._httpc.get<Employee>("http://localhost:5080/api/Employee");
        return data;
    }

    deleteEmployee(id: number){
        var delEmp = "http://localhost:5080/api/Employee"+ "/" + id;

        var data = this._httpc.delete(delEmp);
        return data;
    }

    insertEmployee(emp: any){
        return this._httpc.post<Employee>("http://localhost:5080/api/Employee", emp);
    }
}