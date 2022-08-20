import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {dateToString, WorkItemService} from "../../service/work-item.service";
import {WorkItem} from "../../model/work-item.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";

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

  predefinedTasks: PredefinedTask[] = [
    {value: 'BACKEND-233', label: 'Meetings'},
    {value: 'BACKEND-207', label: 'On-boarding'}
  ]
  predefinedDurations: PredefinedDuration[] = [
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
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.params
      .subscribe(params => {

        let id = params['id'];
        if (id == 'new') {
          let workItem = new WorkItem()
          workItem.date = dateToString(this.workItemService.week)
          this.fillForm(workItem)
          return
        }

        this.form.disable()
        this.workItemService.byId(id)
          .subscribe({
            next: (result) => this.fillForm(result),
            complete: () => this.form.enable()
          })
      })
  }

  save() {
    this.form.disable()
    let workItem = this.fillModel()
    this.workItemService.update(workItem)
      .subscribe({
        next: () => {
          this.snackBar.open('Done', 'X', {duration: 3000})
          this.router.navigate(['work-item'], {queryParams: {'week': workItem.date}}).then()
        },
        complete: () => this.form.enable()
      })
  }

  setTask(predefined: PredefinedTask) {
    this.form.get('task')?.setValue(predefined.value)
  }

  setDuration(predefined: PredefinedDuration) {
    this.form.get('duration')?.setValue(predefined.value)
  }

  private fillForm(workItem: WorkItem) {
    this.form.get('id')?.setValue(workItem.id)
    this.form.get('task')?.setValue(workItem.task)
    this.form.get('date')?.setValue(new Date(Date.parse(workItem.date)))
    this.form.get('duration')?.setValue(workItem.duration)
  }

  private fillModel(): WorkItem {
    let workItem = new WorkItem()
    workItem.id = this.form.get('id')?.value
    workItem.task = this.form.get('task')?.value
    workItem.date = dateToString(this.form.get('date')?.value)
    workItem.duration = this.form.get('duration')?.value
    return workItem
  }

}

class PredefinedTask {
  value!: string
  label!: string
}

class PredefinedDuration {
  value!: number
  label!: string
}
