import {Component} from "@angular/core";
import {dateToString, iso, WorkItemService} from "../../service/work-item.service";
import {ActivatedRoute} from "@angular/router";
import {Platform} from "@angular/cdk/platform";
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";

@Component({
  selector: 'work-item-browser',
  templateUrl: 'work-item-browser.component.html',
  styleUrls: ['work-item-browser.component.scss']
})
export class WorkItemBrowserComponent {

  wide: boolean = false

  constructor(
    public workItemService: WorkItemService,
    private activatedRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver.observe(['(min-width: 50em)'])
      .subscribe((state: BreakpointState) => {
        this.wide = state.matches
      })
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
    return iso(duration)
  }

}
