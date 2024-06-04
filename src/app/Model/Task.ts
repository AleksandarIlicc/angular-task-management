export class Task {
  constructor(
    public title: string,
    public desc: string,
    public assignedTo: string,
    public createdAt: string,
    public priority: string,
    public status: string,
    public author: string,
    public id?: string
  ) {}
}
