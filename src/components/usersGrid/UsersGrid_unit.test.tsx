
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UsersGrid from "./UsersGrid";
import data from "./users.json";

describe("UsersGrid Component", () => {
  test("renders company information", () => {
    render(<UsersGrid />);
    expect(screen.getByText(data.companyInfo.companyName)).toBeInTheDocument();
    expect(screen.getByText(data.companyInfo.companyMotto)).toBeInTheDocument();
    expect(
      screen.getByText(`Since ${new Date(data.companyInfo.companyEst).getFullYear()}`)
    ).toBeInTheDocument();
  });

  test("filters rows based on search input", () => {
    render(<UsersGrid />);
    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "John" } });
    expect(screen.getByText("John")).toBeInTheDocument();
  });

  test("sorts rows when sortable headers are clicked", () => {
    render(<UsersGrid />);
    const nameHeader = screen.getByText("Name");
    fireEvent.click(nameHeader); // Sort Ascending
    fireEvent.click(nameHeader); // Sort Descending
    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  test("paginates rows correctly", () => {
    render(<UsersGrid />);
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);
    expect(nextButton).toBeInTheDocument();
  });

  test("opens and closes modal when a row is clicked", () => {
    render(<UsersGrid />);
    const row = screen.getAllByRole("row")[1]; // First row of data
    fireEvent.click(row);

    // Check modal content
    expect(screen.getByText("Employer Name")).toBeInTheDocument();

    const closeButton = screen.getByText("×");
    fireEvent.click(closeButton);

    // Ensure modal is closed
    expect(screen.queryByText("Employer Name")).not.toBeInTheDocument();
  });
});
