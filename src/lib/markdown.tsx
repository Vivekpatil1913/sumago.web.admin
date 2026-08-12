import { Fragment } from "react";

/**
 * The small Markdown subset an article body is written in.
 *
 * Blog posts are authored as Markdown and stored as a single text field — in
 * the admin panel's body editor, and in the committed fallback in `lib/blog.ts`.
 * Before this, the article page split that field on blank lines and rendered
 * every block as a `<p>`, which was fine while the posts were four flat
 * paragraphs of seed copy and wrong the moment a real post arrived: a reader
 * saw `## The chicken-and-egg problem` and `- **Verification** — …` printed as
 * literal text.
 *
 * ## Why a subset, and why hand-written
 *
 * Only what an editor actually types is supported — headings, bullet and
 * numbered lists, bold and italic. That is a dozen lines of parsing against a
 * markdown library plus a sanitiser in the bundle, on a page whose performance
 * is a release gate (CLAUDE.md). It also means **no HTML is ever interpreted**:
 * the parser emits React elements from matched text, so a body containing a
 * `<script>` renders as the characters `<script>`, not as a tag. There is no
 * `dangerouslySetInnerHTML` anywhere in this path.
 *
 * Anything unrecognised degrades to a paragraph rather than disappearing, which
 * is the right failure for editor-authored content.
 */

export type MarkdownBlock =
  | { kind: "heading"; level: 2 | 3; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] };

/** `## ` / `### `. A `# ` H1 is dropped — the page already renders the title. */
const HEADING = /^(#{1,3})\s+(.*)$/;
const BULLET = /^[-*]\s+(.*)$/;
const NUMBERED = /^\d+\.\s+(.*)$/;

/**
 * Split a body into blocks.
 *
 * Blank lines separate blocks, and consecutive list lines inside one block stay
 * together — which is how the posts are actually written. A list that an editor
 * has spaced out with blank lines between items would otherwise render as a run
 * of one-item lists, so adjacent lists of the same kind are merged.
 */
export function parseMarkdown(body: string | null | undefined): MarkdownBlock[] {
  if (!body) return [];

  const blocks: MarkdownBlock[] = [];

  const pushList = (ordered: boolean, items: string[]) => {
    const last = blocks[blocks.length - 1];
    if (last?.kind === "list" && last.ordered === ordered) {
      last.items.push(...items);
      return;
    }
    blocks.push({ kind: "list", ordered, items });
  };

  for (const chunk of body.split(/\n\s*\n/)) {
    const lines = chunk
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (!lines.length) continue;

    /* A chunk is scanned line by line rather than classified as a whole: a
       heading immediately followed by its list, with no blank line between, is
       a shape editors produce constantly. */
    let paragraph: string[] = [];
    let items: string[] = [];
    let ordered = false;

    const flushParagraph = () => {
      if (!paragraph.length) return;
      blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
      paragraph = [];
    };
    const flushList = () => {
      if (!items.length) return;
      pushList(ordered, items);
      items = [];
    };

    for (const line of lines) {
      const heading = HEADING.exec(line);
      if (heading) {
        flushParagraph();
        flushList();
        const level = heading[1].length;
        // `#` is the post's own title, which the article header already shows.
        if (level > 1) blocks.push({ kind: "heading", level: level === 2 ? 2 : 3, text: heading[2] });
        continue;
      }

      const numbered = NUMBERED.exec(line);
      if (numbered) {
        flushParagraph();
        if (items.length && !ordered) flushList();
        ordered = true;
        items.push(numbered[1]);
        continue;
      }

      const bullet = BULLET.exec(line);
      if (bullet) {
        flushParagraph();
        if (items.length && ordered) flushList();
        ordered = false;
        items.push(bullet[1]);
        continue;
      }

      /* A plain line after a list item is that item's continuation, not a new
         paragraph — wrapped Markdown looks exactly like this. */
      if (items.length) {
        items[items.length - 1] += ` ${line}`;
        continue;
      }
      paragraph.push(line);
    }

    flushParagraph();
    flushList();
  }

  return blocks;
}

/** `**bold**` and `*italic*`, as React nodes. Nothing else is interpreted. */
export function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={i} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/**
 * An article body, typeset.
 *
 * The rhythm is the reading column's, not a generic prose reset: section
 * headings get the space that makes a long post scannable, and a bullet's red
 * marker is the same hairline accent the rest of the site separates with.
 */
export function MarkdownBody({ body }: { body: string | null | undefined }) {
  const blocks = parseMarkdown(body);
  if (!blocks.length) return null;

  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        if (block.kind === "heading") {
          return block.level === 2 ? (
            <h2
              key={i}
              className="pt-6 text-2xl font-bold leading-tight tracking-[-0.01em] text-ink md:text-[1.75rem]"
            >
              {renderInline(block.text)}
            </h2>
          ) : (
            <h3 key={i} className="pt-4 text-xl font-bold leading-snug text-ink">
              {renderInline(block.text)}
            </h3>
          );
        }

        if (block.kind === "list") {
          return block.ordered ? (
            <ol key={i} className="space-y-3 pl-1">
              {block.items.map((item, n) => (
                <li key={n} className="flex gap-3 text-lg leading-relaxed text-ink/80">
                  <span className="mt-0.5 shrink-0 text-base font-bold text-brand">{n + 1}.</span>
                  <span>{renderInline(item)}</span>
                </li>
              ))}
            </ol>
          ) : (
            <ul key={i} className="space-y-3 pl-1">
              {block.items.map((item, n) => (
                <li key={n} className="flex gap-3 text-lg leading-relaxed text-ink/80">
                  <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  <span>{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i} className="text-lg leading-relaxed text-ink/80">
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}
