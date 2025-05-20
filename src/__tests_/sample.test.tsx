import { render, screen } from "@testing-library/react";
import React from "react";

const Hello = () => <h1>Hello World</h1>;

test("muestra texto de saludo", () => {
  render(<Hello />);
  expect(screen.getByText("Hello World")).toBeInTheDocument();
});
