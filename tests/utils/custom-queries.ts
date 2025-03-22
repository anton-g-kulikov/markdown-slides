import { queryHelpers, buildQueries } from "@testing-library/react";

// Custom query that finds elements with either data-testid or data-cy
const queryAllByTestId = (container: HTMLElement, id: string) => {
  return (
    queryHelpers.queryAllByAttribute("data-testid", container, id) ||
    queryHelpers.queryAllByAttribute("data-cy", container, id)
  );
};

// The third argument to buildQueries should be a function that formats errors
const getMultipleError = (c: Element | null, id: string) =>
  `Found multiple elements with data-testid or data-cy: ${id}`;

const getMissingError = (c: Element | null, id: string) =>
  `Unable to find an element with testid or data-cy: ${id}`;

const [
  queryByTestId,
  getAllByTestId,
  getByTestId,
  findAllByTestId,
  findByTestId,
] = buildQueries(queryAllByTestId, getMissingError, getMultipleError);

export {
  queryByTestId,
  queryAllByTestId,
  getByTestId,
  getAllByTestId,
  findAllByTestId,
  findByTestId,
};
