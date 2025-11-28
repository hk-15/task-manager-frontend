import { type JSX } from "react";
import { type Task } from "../../api/ApiClient";

interface Props {
  task: Task;
}

export function TaskDetails(props: Props): JSX.Element {
  return (
    <table>
      <tbody>
        <tr>
          <td>Title</td>
          <td>{props.task.title}</td>
        </tr>
        <tr>
          <td>Description</td>
          <td>{props.task.description}</td>
        </tr>
        <tr>
          <td>Status</td>
          <td>{props.task.status}</td>
        </tr>
        <tr>
          <td>Due</td>
          <td>{props.task.dueTime}</td>
        </tr>
      </tbody>
    </table>
  );
}
