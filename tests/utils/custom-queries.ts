import { queryHelpers, buildQueries } from "@testing-library/react";

// Custom query that finds elements with either data-testid or data-cy
const queryAllByTestId = (container: HTMLElement, id: string) => {
  return (
    queryHelpers.queryAllByAttribute("data-testid", container, id) ||
    queryHelpers.queryAllByAttribute("data-cy", container, id)
  );
};

const [
  queryByTestId,
  getAllByTestId,
  getByTestId,
  findAllByTestId,
  findByTestId,
] = buildQueries(
  queryAllByTestId,
  (id) => `Unable to find an element with testid or data-cy: ${id}`
);

export {
  queryByTestId,
  queryAllByTestId,
  getByTestId,
  getAllByTestId,
  findAllByTestId,
  findByTestId,
};
