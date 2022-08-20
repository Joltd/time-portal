export class ErrorLogEntry {
  type!: Type
  message!: string
}

export type Type = 'ERROR' | 'WARNING'
