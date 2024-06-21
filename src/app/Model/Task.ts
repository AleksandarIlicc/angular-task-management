export interface Task {
  id?: string;
  title: string;
  desc: string;
  assignedTo: string;
  createdAt: string;
  status: string;
  priority: string;
  author: string;
}

export interface ApiResponse {
  [key: string]: Task;
}
