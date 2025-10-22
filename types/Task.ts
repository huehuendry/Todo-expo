export type Task = {
  id: string;
  text: string;
  done: boolean;
  description?: string;

  dueAt?: string;
};
