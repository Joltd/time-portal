import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DayWork, WorkItem} from "../model/work-item.model";
import {ShortMessageService} from "../common/service/short-message.service";
import {TypeUtils} from "../common/service/type-utils";

@Injectable({
  providedIn: 'root'
})
export class WorkItemService {

  week!: Date
  data: DayWork[] = []
  loading: boolean = false

  constructor(
    private http: HttpClient,
    private shortMessageService: ShortMessageService
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
    this.http.get<DayWork[]>(`/work-item?week=${dateToString(this.week)}`, TypeUtils.of(DayWork))
      .subscribe({
        next: result => this.data = result,
        error: () => this.loading = false,
        complete: () => this.loading = false
      })
  }

  sync() {
    this.loading = true
    this.http.post<SyncResult>(`/work-item/sync?week=${dateToString(this.week)}`, null, TypeUtils.of(SyncResult))
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

          this.shortMessageService.show(messages.join(", "))
          this.loadWeek(this.week)
        },
        error: () => this.loading = false,
        complete: () => this.loading = false
      })
  }

  clearCache() {
    this.loading = true
    this.http.delete<void>(`/task-tracker?week=${dateToString(this.week)}`)
      .subscribe({
        error: () => this.loading = false,
        complete: () => this.loading = false
      })
  }

  byId(id: string): Observable<WorkItem> {
    return this.http.get<WorkItem>(`/work-item/${id}`, TypeUtils.of(WorkItem))
  }

  update(workItem: WorkItem): Observable<void> {
    return this.http.post<void>(`/work-item`, workItem)
  }

  delete(id: string) {
    this.http.delete<void>(`/work-item/${id}`)
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
