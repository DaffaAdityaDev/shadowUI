import "@testing-library/jest-dom";
import Page from "./index";
import { render } from "@testing-library/react";

describe("Page", () => {
  it("should render title and children correctly", () => {
    const title = "Test Title";
    const children = "test children";
    const { getByText } = render(<Page title={title}>{children}</Page>);
    const titleElement = getByText(title);
    const childrenElement = getByText(children);

    expect(titleElement).toBeInTheDocument();
    expect(childrenElement).toBeInTheDocument();
  });

  it("rende the correct styling", () => {
    const title = "Test Title";
    const children = "test children";
    const { getByTestId } = render(
      <Page title={title} data-testid="page-container">
        {children}
      </Page>
    );
    const containerElement = getByTestId("page-container");
    expect(containerElement).toHaveStyle(`
      background-color: #f5f5f5;
    `);
  });
});
