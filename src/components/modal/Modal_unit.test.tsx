import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "./Modal";

describe("Modal Component", () => {
  test("renders nothing when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={jest.fn()}>
        <p>Modal Content</p>
      </Modal>
    );

    expect(screen.queryByText("Modal Content")).not.toBeInTheDocument();
  });

  test("renders the modal content when isOpen is true", () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <p>Modal Content</p>
      </Modal>
    );

    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  test("calls onClose when the close button is clicked", () => {
    const mockOnClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <p>Modal Content</p>
      </Modal>
    );

    const closeButton = screen.getByText("×");
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("calls onClose when clicking outside the modal content", () => {
    const mockOnClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <p>Modal Content</p>
      </Modal>
    );

    const overlay = screen.getByText("Modal Content").parentElement?.parentElement;
    if (overlay) {
      fireEvent.mouseDown(overlay); // Simulate clicking outside
    }
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("does not call onClose when clicking inside the modal content", () => {
    const mockOnClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <p>Modal Content</p>
      </Modal>
    );

    const modalContent = screen.getByText("Modal Content").parentElement;
    if (modalContent) {
      fireEvent.mouseDown(modalContent); // Simulate clicking inside
    }
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
