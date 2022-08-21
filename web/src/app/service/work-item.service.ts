import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DayWork, WorkItem} from "../model/work-item.model";
import {environment} from "../../environments/environment";
import {TypeUtils} from "./type-utils";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class WorkItemService {

  week!: Date
  data: DayWork[] = []
  loading: boolean = false

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.setWeek(new Date())
  }

  private setWeek(date: Date) {
    let day = date.getDay();
    let diff = date.getDate() - day + (day == 0 ? -6 : 1)
    this.week = new Date(date.setDate(diff))
  }

  loadWeek(date: Date) {
    this.loading = true
    this.setWeek(date)
    this.http.get<DayWork[]>(`${environment.api}/api/work-item?week=${dateToString(this.week)}`, TypeUtils.of(DayWork))
      .subscribe({
        next: result => this.data = result,
        error: () => this.loading = false,
        complete: () => this.loading = false
      })
  }

  sync() {
    this.loading = true
    this.http.post<SyncResult>(`${environment.api}/api/work-item/sync?week=${dateToString(this.week)}`, null, TypeUtils.of(SyncResult))
      .subscribe({
        next: result => {
          let messages = []
          if (result.done > 0) {
            messages.push(`Done [${result.done}]`)
          }
          if (result.skipped > 0) {
            messages.push(`Skipped [${result.skipped}]`)
          }
          if (messages.length == 0) {
            messages.push("Nothing to sync")
          }

          this.snackBar.open(messages.join(", "), 'X', {duration: 3000})
          this.loadWeek(this.week)
        },
        error: () => this.loading = false,
        complete: () => this.loading = false
      })
  }

  clearCache() {
    this.loading = true
    this.http.delete<void>(`${environment.api}/api/task-tracker?week=${dateToString(this.week)}`)
      .subscribe({
        error: () => this.loading = false,
        complete: () => this.loading = false
      })
  }

  byId(id: string): Observable<WorkItem> {
    return this.http.get<WorkItem>(`${environment.api}/api/work-item/${id}`, TypeUtils.of(WorkItem))
  }

  update(workItem: WorkItem): Observable<void> {
    return this.http.post<void>(`${environment.api}/api/work-item`, workItem)
  }

  delete(id: string) {
    this.http.delete<void>(`${environment.api}/api/work-item/${id}`)
      .subscribe(() => this.loadWeek(this.week))
  }

}

export const dateToString = function(date: Date) {
  let year = date.getFullYear()
  let month = formatTwoDigit(date.getMonth() + 1)
  let day = formatTwoDigit(date.getDate())
  return `${year}-${month}-${day}`
}

const formatTwoDigit = function (value: number) {
  return value.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})
}

class SyncResult {
  done!: number
  skipped!: number
}
