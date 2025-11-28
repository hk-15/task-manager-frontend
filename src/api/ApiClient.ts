export type FormStatus = "READY" | "SUBMITTING" | "FINISHED" | "ERROR"

export interface TaskRequest {
  title: string;
  description?: string;
  status?: string;
  dueTime: Date;
}

export async function addTask(task: TaskRequest) {
  const response = await fetch(`http://localhost:5200/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data);
  }
  return data;
}
