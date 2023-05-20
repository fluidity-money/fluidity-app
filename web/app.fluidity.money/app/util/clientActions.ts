interface HighlightedText {
  copy: () => void;
  deselect: () => void;
}

const highlightText = (e: Event): HighlightedText | null => {
  const el = e.target as Node | null;

  if (!el) {
    console.error("No Target");
    return null;
  }

  if (
    "createTextRange" in document.body &&
    typeof document.body.createTextRange === "function"
  ) {
    const range = document.body.createTextRange();
    range.moveToElementText(el);
    range.select();

    return {
      copy: () => navigator.clipboard.writeText(el.textContent ?? ""),
      deselect: () => range.remove(),
    };
  } else if (window.getSelection) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(el);
    selection?.removeAllRanges();
    selection?.addRange(range);

    return {
      copy: () => navigator.clipboard.writeText(el.textContent ?? ""),
      deselect: () => selection?.removeAllRanges(),
    };
  }

  console.error("Could not select text, Unsupported browser!");
  return null;
};

export { highlightText };
