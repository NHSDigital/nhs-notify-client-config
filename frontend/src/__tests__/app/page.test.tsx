import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../../app/page";

describe("Home page", () => {
  it("renders the Hello World heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /hello world/i }),
    ).toBeInTheDocument();
  });

  it("renders a main landmark", () => {
    render(<Home />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
