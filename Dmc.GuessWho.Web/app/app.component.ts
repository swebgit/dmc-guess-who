import { Component, OnInit } from '@angular/core';

import { Employee } from "./employee";
import { EmployeeService } from "./employee.service";

@Component({
    moduleId: module.id,
    selector: 'dmc-guess-who-app',
    templateUrl: 'app.component.html',
    providers: [EmployeeService]
})
export class AppComponent implements OnInit {
    guessState = GuessState;
    promptText: string;
    isLoading: boolean = false;
    currentState: GuessState;
    guessOptions: Employee[]; 
    correctEmployee: Employee;
    wrongGuessPrompts: string[] = ["Close..", "Wrong.", "How long have you worked here?", "Try again.",
        "Nope!", "Incorrect.", "Have you tried guessing the correct name?", "Looks like you're channeling your inner Ken!",
        "Guess again.", "That's not their name.", "Not that one.", "Almost.."];
    correctGuessPrompts: string[] = ["Correct!", ":)", "Way to go!", "Well you had a 1/4 chance..", "Impressive!", "Yup.", "That's right!", "Wow!"]

    constructor(private employeeService: EmployeeService) {
        this.promptText = "";
        this.guessOptions = [];
        this.correctEmployee = undefined;
        this.currentState = GuessState.NoGuess;
    }

    ngOnInit(): void {
        this.nextQuestion();
    }

    guess(guessedName: string): void {
        if (guessedName == this.correctEmployee.name) {
            this.currentState = GuessState.CorrectGuess;
            this.promptText = this.correctGuessPrompts[Math.floor(Math.random() * (this.correctGuessPrompts.length))];
        } else {
            this.currentState = GuessState.WrongGuess;
            this.promptText = this.wrongGuessPrompts[Math.floor(Math.random() * (this.wrongGuessPrompts.length))];;
        }
    }

    nextQuestion(): void {
        this.isLoading = true;
        this.promptText = "Who is this?";
        this.employeeService.getEmployees(4).then(employees => {
            this.guessOptions = employees
            this.correctEmployee = this.guessOptions[Math.floor(Math.random() * employees.length)];
            this.currentState = GuessState.NoGuess;
            this.isLoading = false;
        });

    }
}

enum GuessState {
    NoGuess = 1,
    WrongGuess = 2,
    CorrectGuess = 3
}
