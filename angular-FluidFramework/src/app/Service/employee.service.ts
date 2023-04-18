import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Employee } from "../Model/employee.model";
import { Department } from "../Model/department.model";
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: "root"})
export class EmployeeService{
    private empdatasubject = new BehaviorSubject({});
    currentEmpData = this.empdatasubject.asObservable();

    empRow:any;

    // private sharedMapsubject = new BehaviorSubject({});
    // currentSharedMap = this.sharedMapsubject.asObservable();

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

    getEmpRow(emp: any){
        this.empRow = emp;
    }
    


  changeEmpData(message: string) {
    this.empdatasubject.next(message)
  }
//   changeSharedMap(message: string) {
//     this.sharedMapsubject.next(message)
//   }
}