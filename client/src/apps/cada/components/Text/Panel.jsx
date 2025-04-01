import React from "react";
import { sortBy } from "lodash";

const splitWithOffsets = (text, offsets) => {
  let lastEnd = 0;
  const splits = [];

  for (let offset of sortBy(offsets, (o) => o.start)) {
    const { start, end } = offset;
    if (lastEnd < start) {
      splits.push({
        start: lastEnd,
        end: start,
        content: text.slice(lastEnd, start),
      });
    }
    splits.push({
      ...offset,
      mark: true,
      content: text.slice(start, end),
    });
    lastEnd = end;
  }
  if (lastEnd < text.length) {
    splits.push({
      start: lastEnd,
      end: text.length,
      content: text.slice(lastEnd, text.length),
    });
  }

  return splits;
};

const selectionIsEmpty = (selection) => {
  let position = selection.anchorNode.compareDocumentPosition(
    selection.focusNode
  );

  return position === 0 && selection.focusOffset === selection.anchorOffset;
};

const selectionIsBackwards = (selection) => {
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

const Mark = (props) => {
  return (
    <mark
      style={{ ...props.markStyle, backgroundColor: props.color }}
      data-start={props.start}
      data-end={props.end}
      onClick={() => props.onClick({ start: props.start, end: props.end })}
    >
      {props.content}
      {props.tag && <span style={props.tagStyle}>{props.tag}</span>}
    </mark>
  );
};

const Split = (props) => {
  if (props.mark) return <Mark {...props} />;

  return (
    <span
      data-start={props.start}
      data-end={props.end}
      onClick={() => props.onClick({ start: props.start, end: props.end })}
    >
      {props.content}
    </span>
  );
};

const TextAnnotatorPanel = (props) => {
  const getSpan = (span) => {
    if (props.getSpan) return props.getSpan(span);
    return {
      start: span.start,
      end: span.end,
    };
  };

  const handleMouseUp = () => {
    if (!props.onChange) return;

    const selection = window.getSelection();

    if (selectionIsEmpty(selection)) return;

    let start =
      parseInt(
        selection.anchorNode.parentElement.getAttribute("data-start"),
        10
      ) + selection.anchorOffset;
    let end =
      parseInt(
        selection.focusNode.parentElement.getAttribute("data-start"),
        10
      ) + selection.focusOffset;

    if (selectionIsBackwards(selection)) {
      [start, end] = [end, start];
    }

    props.onChange([
      ...props.value,
      getSpan({ start, end, text: content.slice(start, end) }),
    ]);

    window.getSelection().empty();
  };

  const handleSplitClick = ({ start, end }) => {
    const splitIndex = props.value.findIndex(
      (s) => s.start === start && s.end === end
    );
    if (splitIndex >= 0) {
      props.onChange([
        ...props.value.slice(0, splitIndex),
        ...props.value.slice(splitIndex + 1),
      ]);
    }
  };

  const { content, value, style } = props;
  const splits = splitWithOffsets(content, value);

  return (
    <div style={style} onMouseUp={handleMouseUp}>
      {splits.map((split) => (
        <Split
          key={`${split.start}-${split.end}`}
          {...props}
          {...split}
          onClick={handleSplitClick}
        />
      ))}
    </div>
  );
};

export default TextAnnotatorPanel;
