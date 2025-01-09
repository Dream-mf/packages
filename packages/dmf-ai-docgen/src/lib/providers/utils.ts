export function extractMarkdownBlock(text: string) {
  const regex = /```.*?\n([\s\S]*?)\n```/g;
  const matches = [];
  let match: RegExpExecArray | null;
  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1]);
  }
  return matches.length > 0 ? matches.join("\n") : text;
}
