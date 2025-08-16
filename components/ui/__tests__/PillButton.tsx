import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { TestWrapper } from "../TestWrapper";
import { PillButton } from "../PillButton";

describe("PillButton", () => {
  it("should render the text", () => {
    const { getByText } = render(
      <TestWrapper>
        <PillButton text="Test" />
      </TestWrapper>
    );
    expect(getByText("Test")).toBeTruthy();
  });
  it("should handle button click", () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <TestWrapper>
        <PillButton text="Test" onPress={onPressMock} />
      </TestWrapper>
    );
    fireEvent.press(getByTestId("pill-button"));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
