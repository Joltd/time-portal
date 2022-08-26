import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {dateToString, iso, WorkItemService} from "../../service/work-item.service";
import {WorkItem} from "../../model/work-item.model";
import {ActivatedRoute, Router} from "@angular/router";
import {ShortMessageService} from "../../common/service/short-message.service";
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import {Location} from "@angular/common";

@Component({
  selector: 'work-item-editor',
  templateUrl: 'work-item-editor.component.html',
  styleUrls: ['work-item-editor.component.scss']
})
export class WorkItemEditorComponent implements OnInit {

  form: FormGroup = this.formBuilder.group({
    id: [null],
    task: [''],
    date: [''],
    duration: ['']
  });

  wide: boolean = false

  predefinedTasks: Predefined<string>[] = [
    {value: 'BACKEND-233', label: 'Meetings'},
    {value: 'BACKEND-207', label: 'On-boarding'}
  ]
  predefinedDates: Predefined<number>[] = [
    {value: 0, label: 'Mon'},
    {value: 1, label: 'Tue'},
    {value: 2, label: 'Wed'},
    {value: 3, label: 'Thu'},
    {value: 4, label: 'Fri'}
  ]
  predefinedDurations: Predefined<number>[] = [
    {value: 60, label: '1h'},
    {value: 2 * 60, label: '2h'},
    {value: 3 * 60, label: '3h'},
    {value: 4 * 60, label: '4h'},
    {value: 5 * 60, label: '5h'},
    {value: 6 * 60, label: '6h'},
    {value: 7 * 60, label: '7h'},
    {value: 8 * 60, label: '8h'},
  ]

  constructor(
    private formBuilder: FormBuilder,
    private workItemService: WorkItemService,
    private shortMessageService: ShortMessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private location: Location
  ) {}

  ngOnInit() {
    this.breakpointObserver.observe(['(min-width: 50em)'])
      .subscribe((state: BreakpointState) => {
        this.wide = state.matches
      })
    this.activatedRoute.params
      .subscribe(params => {

        let id = params['id'];
        if (id == 'new') {
          let workItem = new WorkItem()
          console.log(this.workItemService.week)
          workItem.date = dateToString(this.workItemService.week)
          this.fillForm(workItem)
          return
        }

        this.form.disable()
        this.workItemService.byId(id)
          .subscribe({
            next: (result) => this.fillForm(result),
            error: () => this.form.enable(),
            complete: () => this.form.enable()
          })
      })
  }

  close() {
    this.location.back()
  }

  save() {
    let workItem = new WorkItem()
    workItem.id = this.form.get('id')?.value
    workItem.task = this.form.get('task')?.value
    workItem.date = dateToString(this.form.get('date')?.value)
    workItem.duration = this.form.get('duration')?.value

    if (!workItem.task) {
      this.shortMessageService.show('Task is not specified')
      return
    }
    if (!workItem.date) {
      this.shortMessageService.show('Date is not specified')
      return
    }
    if (!workItem.duration || workItem.duration == 0) {
      this.shortMessageService.show('Duration is not specified')
      return
    }

    this.form.disable()
    this.workItemService.update(workItem)
      .subscribe({
        next: () => {
          this.shortMessageService.show('Done')
          this.router.navigate(['work-item'], {queryParams: {'week': workItem.date}}).then()
        },
        error: () => this.form.enable(),
        complete: () => this.form.enable()
      })
  }

  setTask(predefined: Predefined<string>) {
    this.form.get('task')?.setValue(predefined.value)
  }

  setDate(predefined: Predefined<number>) {
    let diff = new Date().setDate(this.workItemService.week.getDate() + predefined.value)
    this.form.get('date')?.setValue(new Date(diff))
  }

  setDuration(predefined: Predefined<number>) {
    this.form.get('duration')?.setValue(predefined.value)
  }

  isoDuration() {
    return iso(this.form.get('duration')?.value || 0)
  }

  private fillForm(workItem: WorkItem) {
    this.form.get('id')?.setValue(workItem.id)
    this.form.get('task')?.setValue(workItem.task)
    this.form.get('date')?.setValue(new Date(Date.parse(workItem.date)))
    this.form.get('duration')?.setValue(workItem.duration)
  }

}

class Predefined<T> {
  value!: T
  label!: string
}
