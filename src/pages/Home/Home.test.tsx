import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { Home } from "./Home";
import type { Task } from "../../api/ApiClient";
import { addTask } from "../../api/ApiClient";

const mockTask: Task = {
  id: 40,
  title: "A mock task",
  description: "A description of a mock task",
  status: "Not started",
  dueTime: "19/12/2025 12:00:00 PM",
};

jest.mock("../../api/ApiClient");

describe("Home page", () => {
  test("renders the form fields", () => {
    render(<Home />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date and time/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add task/i })
    ).toBeInTheDocument();
  });

  test("displays validation errors when form is empty", async () => {
    render(<Home />);

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /add task/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/please enter a title/i)).toBeInTheDocument();
      expect(
        screen.getByText(/please enter a due date and time/i)
      ).toBeInTheDocument();
    });
  });

  test("submits and displays valid data", async () => {
    render(<Home />);
    const title = screen.getByLabelText(/title/i);
    const description = screen.getByLabelText(/description/i);
    const dueTime = screen.getByLabelText(/due date and time/i);

    const apiCall = addTask as jest.Mock;
    apiCall.mockResolvedValue({
      json: () => Promise.resolve(mockTask),
    });

    act(() => {
      fireEvent.change(title, {
        target: { value: mockTask.title },
      });
      fireEvent.change(description, {
        target: { value: mockTask.description },
      });
      fireEvent.change(dueTime, {
        target: { value: "2025-12-19T12:00" },
      });
      fireEvent.click(screen.getByRole("button", { name: /add task/i }));
    });

    await waitFor(() => {
      expect(apiCall).toHaveBeenCalledTimes(1);
      expect(
        screen.getByText(/success, task has been created/i)
      ).toBeInTheDocument();
      expect(screen.getByRole("table")).toBeVisible();
      expect(
        screen.getByRole("button", { name: /dismiss/i })
      ).toBeInTheDocument();
    });
  });

  test("displays error message when addTask fails", async () => {
    render(<Home />);
    const title = screen.getByLabelText(/title/i);
    const description = screen.getByLabelText(/description/i);
    const dueTime = screen.getByLabelText(/due date and time/i);

    const apiCall = addTask as jest.Mock;
    apiCall.mockRejectedValueOnce(new Error("Network error"));

        act(() => {
      fireEvent.change(title, {
        target: { value: mockTask.title },
      });
      fireEvent.change(description, {
        target: { value: mockTask.description },
      });
      fireEvent.change(dueTime, {
        target: { value: "2025-12-19T12:00" },
      });
      fireEvent.click(screen.getByRole("button", { name: /add task/i }));
    });

    await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  })
});