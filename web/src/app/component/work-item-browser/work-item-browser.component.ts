import {Component} from "@angular/core";
import {dateToString, WorkItemService} from "../../service/work-item.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'work-item-browser',
  templateUrl: 'work-item-browser.component.html',
  styleUrls: ['work-item-browser.component.scss']
})
export class WorkItemBrowserComponent {

  constructor(
    public workItemService: WorkItemService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams
      .subscribe(params => {
        let week = params['week'];

        if (!week) {
          this.workItemService.loadWeek(new Date())
          return
        }

        let date = new Date(Date.parse(week))
        this.workItemService.loadWeek(date)
      })
  }

  prevWeek(): string {
    let current = new Date(this.workItemService.week)
    let prev = new Date(current.setDate(current.getDate() - 7))
    return dateToString(prev)
  }

  nextWeek(): string {
    let current = new Date(this.workItemService.week)
    let next = new Date(current.setDate(current.getDate() + 7))
    return dateToString(next)
  }

  currentWeek(): string {
    return dateToString(new Date())
  }

  iso(duration: number) {
    let hours = Math.floor(duration / 60)
    let minutes = duration % 60
    let parts = []
    if (hours > 0) {
      parts.push(hours + 'h')
    }
    if (minutes > 0) {
      parts.push(minutes + 'm')
    }
    return parts.join(' ')
  }

}
