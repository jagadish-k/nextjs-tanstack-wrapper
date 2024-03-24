import { Row, RowSelectionState } from '@tanstack/react-table';

export function getRowSelectionState<T extends object>(
  selectedItems: T[],
  data: Row<T>[],
  getUniqueIdForMatching: (row: T) => string | number,
): RowSelectionState {
  const indices: RowSelectionState = {};

  selectedItems.forEach((selectedItem) => {
    const matchedItem = data.find(
      (dataItem) => getUniqueIdForMatching(dataItem.original) === getUniqueIdForMatching(selectedItem),
    );

    if (matchedItem) {
      indices[getUniqueIdForMatching(matchedItem.original)] = true;
    }
  });

  return indices;
}

export function retrieveElementsByIndices<T extends object>(elements: T[], indices: number[]): T[] {
  return indices
    .filter((index) => index >= 0 && index < elements.length) // Ensure indices are within bounds
    .map((index) => elements[index]); // Retrieve elements at the specified indices
}
