import { useState, type JSX } from "react";
import {
  type FormStatus,
  type Task,
  addTask,
  emptyTask,
} from "../../api/ApiClient";
import { useForm } from "react-hook-form";
import { TaskDetails } from "../TaskDetails/TaskDetails";

export function AddTask(): JSX.Element {
  const [formStatus, setFormStatus] = useState<FormStatus>("READY");
  const [createdTask, setCreatedTask] = useState<Task>(emptyTask);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      status: "Not started",
      dueTime: "",
    },
  });

  async function submitForm(data: {
    title: string;
    description?: string;
    status: string;
    dueTime: string;
  }) {
    try {
      const taskData = {
        title: data.title,
        description: data.description ?? "",
        status: data.status,
        dueTime: new Date(data.dueTime),
      };
      setFormStatus("SUBMITTING");
      const task = await addTask(taskData);
      setCreatedTask(task);
      setFormStatus("FINISHED");
      reset();
    } catch (error) {
      console.error(error);
      setFormStatus("ERROR");
    }
  }

  return (
    <section>
      <form onSubmit={handleSubmit(submitForm)}>
        <label htmlFor="title">
          Title *
          <input
            id="title"
            type="text"
            {...register("title", {
              required: true,
              pattern: {
                value: /^.{1,100}/,
                message: "Title must be between 1 and 100 characters long.",
              },
            })}
          />
        </label>
        {errors.title && (
          <span className="form-error">{errors.title.message}</span>
        )}
        <label htmlFor="description">
          Description (optional)
          <textarea id="description" {...register("description")} />
        </label>
        <label htmlFor="dueTime">
          Due date and time *
          <input
            id="dueTime"
            type="datetime-local"
            {...register("dueTime", {
              required: true,
            })}
          />
        </label>
        {errors.title && (
          <span className="form-error">{errors.title.message}</span>
        )}
        <button disabled={formStatus === "SUBMITTING"} type="submit">
          Add task
        </button>
        {formStatus === "ERROR" && (
          <p>Something went wrong. Please try again.</p>
        )}
        {formStatus === "FINISHED" && (
          <p>Success, task has been created. Please see details below.</p>
        )}
      </form>
      {createdTask.id !== 0 && (
        <section>
          <button
            onClick={() => {
              setCreatedTask(emptyTask);
              setFormStatus("READY");
            }}
          >
            Dismiss
          </button>
          <TaskDetails task={createdTask} />
        </section>
      )}
    </section>
  );
}
