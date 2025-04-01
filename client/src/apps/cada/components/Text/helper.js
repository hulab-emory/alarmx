export const combineOffsets = (offsets, modelValues) => {
  let combinedOffsets = [];

  if (offsets.length === 0) {
    // If offsets are empty, process only modelValues to combine overlapping intervals
    combinedOffsets = mergeIntervals(
      modelValues.map((model) => ({
        ...model,
        start: Number(model.start),
        end: Number(model.end),
      }))
    );
    return combinedOffsets;
  }

  // First, process the offsets to include any overlapping modelValues
  for (let offset of offsets) {
    const start = Number(offset.start);
    const end = Number(offset.end);
    const overlappingModels = modelValues.filter(
      (model) => Number(model.start) < end && Number(model.end) > start
    );
    if (overlappingModels.length > 0) {
      combinedOffsets.push({
        ...offset,
        start,
        end,
        models: overlappingModels.map((model) => ({
          ...model,
          start: Number(model.start),
          end: Number(model.end),
        })),
      });
    } else {
      combinedOffsets.push({
        ...offset,
        start,
        end,
      });
    }
  }

  // Then, add any modelValues that do not overlap with any existing offsets
  for (let model of modelValues) {
    const start = Number(model.start);
    const end = Number(model.end);
    const overlappingOffset = combinedOffsets.find(
      (offset) => offset.start < end && offset.end > start
    );
    if (!overlappingOffset) {
      combinedOffsets.push({
        ...model,
        start,
        end,
      });
    }
  }

  // Merge overlapping intervals in the combinedOffsets array
  combinedOffsets = mergeIntervals(combinedOffsets);

  return combinedOffsets;
};
// Helper function to merge overlapping intervals
const mergeIntervals = (intervals) => {
  intervals.sort((a, b) => a.start - b.start);
  let merged = [];

  for (let i = 0; i < intervals.length; i++) {
    let current = intervals[i];
    if (merged.length === 0 || merged[merged.length - 1].end < current.start) {
      merged.push(current);
    } else {
      let last = merged[merged.length - 1];
      last.end = Math.max(last.end, current.end);
      // Combine tags and models
      last.models = (last.models || []).concat(current.models || []);
    }
  }
  return merged;
};

export const splitWithOffsets = (text, offsets) => {
  let lastEnd = 0;
  const splits = [];

  // Sort the combined offsets by start position
  offsets = sortBy(offsets, ["start", "end"]);

  for (let offset of offsets) {
    const start = Number(offset.start);
    const end = Number(offset.end);

    // Handle non-overlapping part before the current offset
    if (lastEnd < start) {
      splits.push({
        start: lastEnd,
        end: start,
        content: text.slice(lastEnd, start),
      });
    }

    // Add the current offset to the splits
    splits.push({
      ...offset,
      start,
      end,
      mark: true,
      content: text.slice(start, end),
    });

    lastEnd = end;
  }

  // Handle the remaining part after the last offset
  if (lastEnd < text.length) {
    splits.push({
      start: lastEnd,
      end: text.length,
      content: text.slice(lastEnd, text.length),
    });
  }

  return splits;
};

export const selectionIsEmpty = (selection) => {
  let position = selection.anchorNode.compareDocumentPosition(
    selection.focusNode
  );
  return position === 0 && selection.focusOffset === selection.anchorOffset;
};

export const selectionIsBackwards = (selection) => {
  if (selectionIsEmpty(selection)) return false;

  let position = selection.anchorNode.compareDocumentPosition(
    selection.focusNode
  );

  let backward = false;
  if (
    (!position && selection.anchorOffset > selection.focusOffset) ||
    position === Node.DOCUMENT_POSITION_PRECEDING
  )
    backward = true;

  return backward;
};
