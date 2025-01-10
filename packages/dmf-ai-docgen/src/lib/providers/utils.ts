/**
 * Removes only the outermost markdown code block if present
 * Preserves any nested markdown blocks
 */
export function removeOuterMarkdownBlock(text: string): string {
  // Check if the text starts and ends with markdown blocks
  const startsWithBlock = text.trimStart().startsWith("```markdown");
  const endsWithBlock = text.trimEnd().endsWith("```");

  if (startsWithBlock && endsWithBlock) {
    return text.substring(12, text.length - 3);
  }

  return text;
}
