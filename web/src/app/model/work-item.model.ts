export class WorkItem {
  id!: string
  task!: string
  date!: string
  duration!: number
}

export class DayWork {
  date!: string
  portal: number = 0
  tracker: number = 0
  tasks: TaskWork[] = []
}

export class TaskWork {
  id!: string
  name!: string
  portal: number = 0
  tracker: number = 0
}
