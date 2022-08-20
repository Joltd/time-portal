import { Component } from '@angular/core';
import {WorkItemService} from "./service/work-item.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public workItemService: WorkItemService) {}

}
