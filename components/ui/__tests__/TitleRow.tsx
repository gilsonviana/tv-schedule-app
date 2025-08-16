import React from "react";
import { render } from "@testing-library/react-native";
import { TitleRow } from "../TitleRow";
import { tvImageMock } from "../__mocks__";
import { TestWrapper } from "../TestWrapper";

describe("TitleRow", () => {
  it("should render the text", () => {
    const { getByText } = render(
      <TestWrapper>
        <TitleRow name="Test" />
      </TestWrapper>
    );
    expect(getByText("Test")).toBeTruthy();
  });
  it("should render the favorite button", () => {
    const { getByTestId } = render(
      <TestWrapper>
        <TitleRow name="Test" favoriteType="shows" image={tvImageMock} />
      </TestWrapper>
    );
    expect(getByTestId("favorite-button")).toBeVisible();
  });
});
