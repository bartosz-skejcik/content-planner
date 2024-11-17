export enum SubtaskStatus {
  Pending = "Pending",
  InProgress = "In Progress",
  Completed = "Completed",
}

export interface Subtask {
  id: string;
  videoId: string;
  title: string;
  status: SubtaskStatus;
  createdAt: Date;
  updatedAt?: Date;
}
