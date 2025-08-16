import React from "react";
import { render } from "@testing-library/react-native";
import { TestWrapper } from "../TestWrapper";
import { Badge } from "../Badge";

describe("Badge", () => {
  it("should render the text", () => {
    const { getByText } = render(
      <TestWrapper>
        <Badge text="Test" />
      </TestWrapper>
    );
    expect(getByText("Test")).toBeTruthy();
  });
});
