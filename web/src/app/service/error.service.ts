import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {ErrorLogEntry, Type} from "../model/error-log-entry";

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private errors: ErrorLogEntry[] = []

  constructor(private snackBar: MatSnackBar) {}

  errorLog(): ErrorLogEntry[] {
    return this.errors
  }

  register(type: Type, message: string) {
    let entry = new ErrorLogEntry()
    entry.type = type
    entry.message = message
    this.errors.push(entry)
    this.snackBar.open(message, 'X', {duration: 3000})
  }

  clear() {
    this.errors = []
  }

}
