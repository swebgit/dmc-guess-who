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
                    this.employees.forEach((employee, index, array) => {
                        this.createEmployeeFirstAndLastNames(employee);
                    });
                    return this.employees;
                })
                .catch(this.handleError);
        } else {
            return Promise.resolve(this.employees);
        }
    }

    private createEmployeeFirstAndLastNames(employee: Employee): void {
        employee.firstName = employee.name.split(" ")[0];
        employee.lastName = employee.name.split(" ")[1];
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

    //public jumbleNames(numberToJumble: number, numberOfGuessOptions: number, correctGuess: number, employee: Employee[]) {
    //    let jumbleIndicies: number[] = [];
    //    let AddToIndex: number;
    //    for (let _i = 0; _i < numberToJumble; _i++) {
    //        AddToIndex = 0; //This is...
    //        //chose the standard guesses to be jumbled with the jumble options. 
    //        //On the first iteration the options are all the guess options - 1 (subtract out the correct guess)
    //        //On subsequent iterations subtract out the already jumbled options ( - _i)
    //        jumbleIndicies[_i] = Math.floor(Math.random() * (numberOfGuessOptions - 1 - _i));    

    //        //Correlate the chosen jumble with the correct index option by...
    //        //...first adding to the index if you chose a value greater than the correct guess...
    //        if (jumbleIndicies[_i] >= correctGuess)
    //            { AddToIndex++; }
    //        //...second adding to the index if you hit an option already jumbled
    //        for (let _j = 0; _j < _i; _j++) {
    //            if (jumbleIndicies[_i] >= jumbleIndicies[_j])
    //            { AddToIndex++; }
    //        }
    //        jumbleIndicies[_i] += AddToIndex;
    //        if (Math.random() < 0.5)
    //            { employee[jumbleIndicies[_i]].nameToDisplay = employee[jumbleIndicies[_i]].firstName.concat(" ", employee[numberOfGuessOptions + _i].lastName) }
    //        else
    //        { employee[jumbleIndicies[_i]].nameToDisplay = employee[numberOfGuessOptions + _i].firstName.concat(" ", employee[jumbleIndicies[_i]].lastName)}
    //    }
        
    //}

    public jumbleNames(numberToJumble: number, numberOfGuessOptions: number, correctGuess: number, employee: Employee[]) {
        let disallowedJumbleIndicies: number[] = [];
        let disallowedBumpIndicies: number[] = [correctGuess];
        let jumbleIndex: number;
        let bumpIndex: number;
        for (let _i = 0; _i < numberToJumble; _i++) {
            jumbleIndex = this.randomIndexSelector(numberOfGuessOptions, disallowedJumbleIndicies);
            if (jumbleIndex == correctGuess) {
                //the correct answer cannot be selected again
                disallowedJumbleIndicies.push(jumbleIndex)
                //A bump is guarenteed to occur!
                bumpIndex = this.randomIndexSelector(numberOfGuessOptions, disallowedBumpIndicies);
                disallowedBumpIndicies.push(bumpIndex);
                disallowedJumbleIndicies.push(bumpIndex);
                //perform the jumble (on the bump position)
                if (Math.random() < 0.5)    //Choose first or last name to jumble
                { employee[bumpIndex].nameToDisplay = employee[jumbleIndex].firstName.concat(" ", employee[numberOfGuessOptions + _i].lastName) }
                else
                { employee[bumpIndex].nameToDisplay = employee[numberOfGuessOptions + _i].firstName.concat(" ", employee[jumbleIndex].lastName) }
            }
            else
            {
                disallowedBumpIndicies.push(jumbleIndex);
                disallowedJumbleIndicies.push(jumbleIndex);

                //do I do a bump? (move the correct name over to a new position?)
                if (Math.random() < 0.5) {
                    bumpIndex = this.randomIndexSelector(numberOfGuessOptions, disallowedBumpIndicies);
                    disallowedBumpIndicies.push(bumpIndex);
                    disallowedJumbleIndicies.push(bumpIndex);
                    employee[bumpIndex].nameToDisplay = employee[jumbleIndex].nameToDisplay;
                }

                //perform the jumble
                if (Math.random() < 0.5)    //Choose first or last name to jumble
                { employee[jumbleIndex].nameToDisplay = employee[jumbleIndex].firstName.concat(" ", employee[numberOfGuessOptions + _i].lastName) }
                else
                { employee[jumbleIndex].nameToDisplay = employee[numberOfGuessOptions + _i].firstName.concat(" ", employee[jumbleIndex].lastName) }
            }
        }
    }

	private randomIndexSelector(arrayLength: number, disallowedIndexChoices: number[]): number {
	    let numberOfChoices: number = arrayLength - disallowedIndexChoices.length
	    let originalSelectedIndex: number = Math.floor(Math.random() * numberOfChoices)
	    let selectedIndex: number = originalSelectedIndex;
	    for (let _i = 0; _i < disallowedIndexChoices.length; _i++) {
	        if (originalSelectedIndex >= disallowedIndexChoices[_i]) {
	            selectedIndex++;
	        }
	    }
	    return selectedIndex;
	}


}