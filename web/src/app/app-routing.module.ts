import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WorkItemBrowserComponent} from "./component/work-item-browser/work-item-browser.component";
import {WorkItemEditorComponent} from "./component/work-item-editor/work-item-editor.component";

const routes: Routes = [
  { path: 'work-item', component: WorkItemBrowserComponent },
  { path: 'work-item/:id', component: WorkItemEditorComponent },
  { path: '', redirectTo: '/work-item', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
