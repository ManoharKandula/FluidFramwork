import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({providedIn: "root"})
export class EmployeeService{

    constructor(private _httpc: HttpClient) {}

    getEmployees(){
        var data = this._httpc.get('http://localhost:5080/api/Employee');
        return data;
    }
}