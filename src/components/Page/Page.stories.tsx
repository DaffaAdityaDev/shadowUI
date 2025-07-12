import Page from '.'

export default {
  title: "MyComponents/Page",
  component: Page,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      description: "The title of the page",
      control: {
        type: "text",
      },
    },
    children: {
      description: "The content of the page",
      control: {
        type: "text",
      },
    }
  },
};

export const PageOne = {
  args: {
    title: "Page One",
    children: "This is the content of page one",
  },
};

export const PageTwo = {
  args: {
    title: "Page Two",
    children: "This is the content of page two",
  },
};
