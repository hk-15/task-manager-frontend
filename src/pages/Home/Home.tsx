import type { JSX } from "react";
import { AddTask } from "../../components/AddTask/AddTask";

export function Home(): JSX.Element {
  return (
    <section>
      <h1>Home</h1>
    <AddTask />
    </section>
  );
}