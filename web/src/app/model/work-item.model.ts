export class WorkItem {
  id!: string
  task!: string
  date!: string
  duration!: number
}

export class DayGroup {
  date!: string
  tasks: TaskGroup[] = []
}

export class TaskGroup {
  id!: string
  name!: string
  portal: number = 0
  tracker: number = 0
}
