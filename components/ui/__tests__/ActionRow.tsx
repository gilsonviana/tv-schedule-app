import React from "react";
import { render } from "@testing-library/react-native";
import { TestWrapper } from "../TestWrapper";
import { ActionRow } from "../ActionRow";

describe("ActionRow", () => {
  it("should render the label", () => {
    const { getByText } = render(
      <TestWrapper>
        <ActionRow label="Test" toggle={false} />
      </TestWrapper>
    );
    expect(getByText("Test")).toBeTruthy();
  });
  it("should render the switch", () => {
    const { getByTestId } = render(
      <TestWrapper>
        <ActionRow label="Test" toggle={true} />
      </TestWrapper>
    );
    expect(getByTestId("action-row-switch")).toBeVisible();
  });
});
