import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Employee} from './employee';
import { EMPLOYEES } from './mock-employees';

@Injectable()
export class EmployeeService {
    private employees: Employee[]
    private employeesUrl: string = 'api/employees'; // URL to web API

    constructor(private http: Http) { }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    private refreshEmployees(): Promise<Employee[]> {
        if (this.employees === undefined) {
            //this.employees = EMPLOYEES;
            //return Promise.resolve(this.employees);
            return this.http
                .get(this.employeesUrl)
                .toPromise()
                .then(res => {
                    this.employees = res.json() as Employee[];
                    return this.employees;
                })
                .catch(this.handleError);
        } else {
            return Promise.resolve(this.employees);
        }
    }

    getEmployees(numberToGet: number): Promise<Employee[]> {
        return this.refreshEmployees().then(emps => {
            var returnArr: Employee[] = [];
            while (returnArr.length < numberToGet && returnArr.length < this.employees.length) {
                var nextEmployeeToAdd = this.employees[Math.floor(Math.random() * this.employees.length)];
                if (returnArr.every(function (value, index, array) { return value.name !== nextEmployeeToAdd.name })) {
                    returnArr.push(nextEmployeeToAdd);
                }
            }
            return returnArr;
        });
    }
}