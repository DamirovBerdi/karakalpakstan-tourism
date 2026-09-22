import React, { useMemo } from 'react';

interface FormattedMessageProps {
  content: string;
  isUser?: boolean;
}

// Cleans up stray unclosed markdown tokens (e.g., lone **, *, --) so they never display as raw code
function sanitizeText(raw: string): string {
  if (!raw) return '';
  let t = raw;

  // Fix unbalanced double asterisks (e.g. "**-Так пишет" or trailing "**")
  const boldCount = (t.match(/\*\*/g) || []).length;
  if (boldCount % 2 !== 0) {
    // If odd number of **, remove the lone unclosed **
    t = t.replace(/\*\*([^*]*)$/, '$1');
  }

  // Remove dangling bullet asterisks like "**- " at the start
  t = t.replace(/^\*\*\s*[-•*]\s*/, '');

  return t;
}

// Parses inline bold, italic, code, and links
function parseInline(text: string, isUser: boolean): React.ReactNode[] {
  if (!text) return [];

  const sanitized = sanitizeText(text);
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|__[^_]+__|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(sanitized)) !== null) {
    if (match.index > lastIndex) {
      const plain = sanitized.substring(lastIndex, match.index).replace(/\*{1,2}/g, '');
      if (plain) nodes.push(plain);
    }

    const token = match[0];
    const key = `inline-${lastIndex}-${match.index}`;

    if (token.startsWith('**') && token.endsWith('**')) {
      const boldText = token.slice(2, -2);
      nodes.push(
        <strong
          key={key}
          className={`font-semibold ${isUser ? 'text-white' : 'text-deepblue-950'}`}
        >
          {boldText}
        </strong>
      );
    } else if (token.startsWith('__') && token.endsWith('__')) {
      const boldText = token.slice(2, -2);
      nodes.push(
        <strong
          key={key}
          className={`font-semibold ${isUser ? 'text-white' : 'text-deepblue-950'}`}
        >
          {boldText}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      const italicText = token.slice(1, -1);
      nodes.push(
        <em key={key} className="italic opacity-90">
          {italicText}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      const codeText = token.slice(1, -1);
      nodes.push(
        <code
          key={key}
          className={`rounded px-1.5 py-0.5 text-xs font-mono ${
            isUser ? 'bg-white/20 text-white' : 'bg-sand-100 text-deepblue-800'
          }`}
        >
          {codeText}
        </code>
      );
    } else if (token.startsWith('[') && token.includes('](')) {
      const linkMatch = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        const linkText = linkMatch[1];
        const href = linkMatch[2];
        nodes.push(
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            {linkText}
          </a>
        );
      }
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < sanitized.length) {
    const trailing = sanitized.substring(lastIndex).replace(/\*{1,2}/g, '');
    if (trailing) nodes.push(trailing);
  }

  return nodes;
}

export default function FormattedMessage({ content, isUser = false }: FormattedMessageProps) {
  const elements = useMemo(() => {
    if (!content) return null;

    const lines = content.split('\n');
    const nodes: React.ReactNode[] = [];
    let listBuffer: React.ReactNode[] = [];

    const flushList = () => {
      if (listBuffer.length > 0) {
        nodes.push(
          <ul key={`list-${nodes.length}`} className="my-2 space-y-2 pl-0.5">
            {listBuffer}
          </ul>
        );
        listBuffer = [];
      }
    };

    lines.forEach((rawLine, idx) => {
      const line = rawLine.trim();

      // Empty line -> flush list and add pleasant spacing
      if (!line) {
        flushList();
        nodes.push(<div key={`spacer-${idx}`} className="h-1.5" />);
        return;
      }

      // 1. Check for bullet list items (•, -, *, or line starting with **- or -**)
      const bulletPrefixMatch = line.match(/^([•\-\*]|\*\*\s*[-•*]\s*)\s*(.+)$/);
      // 2. Check for numbered list items (e.g. "1.", "2)")
      const numberPrefixMatch = line.match(/^(\d+)[\.\)]\s*(.+)$/);

      if (bulletPrefixMatch || numberPrefixMatch) {
        const isNumbered = Boolean(numberPrefixMatch);
        const itemNumber = numberPrefixMatch ? numberPrefixMatch[1] : null;
        let itemContent = (numberPrefixMatch ? numberPrefixMatch[2] : bulletPrefixMatch![2]).trim();

        // Check if item starts with a bold title like "**Заголовок:** Описание" or "**Заголовок** — Описание"
        let titleNode: React.ReactNode = null;
        const titleMatch = itemContent.match(/^\*\*([^*]+)\*\*[:\s—–-]\s*(.*)$/);

        if (titleMatch) {
          const title = titleMatch[1].trim();
          const rest = titleMatch[2].trim();
          titleNode = (
            <span className={`font-semibold ${isUser ? 'text-white' : 'text-deepblue-950'}`}>
              {title}:
            </span>
          );
          itemContent = rest;
        }

        listBuffer.push(
          <li key={`item-${idx}`} className="flex items-start gap-2.5 text-sm leading-relaxed">
            {isNumbered ? (
              <span
                className={`inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold mt-0.5 ${
                  isUser
                    ? 'bg-white/20 text-white'
                    : 'bg-deepblue-100 text-deepblue-700 ring-1 ring-deepblue-200'
                }`}
              >
                {itemNumber}
              </span>
            ) : (
              <span
                className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                  isUser ? 'bg-gold-300' : 'bg-terracotta-500 ring-2 ring-terracotta-100'
                }`}
              />
            )}
            <div className="flex-1 min-w-0">
              {titleNode && <div className="mb-0.5">{titleNode}</div>}
              {itemContent && (
                <span className={isUser ? 'text-white/95' : 'text-deepblue-900/90'}>
                  {parseInline(itemContent, isUser)}
                </span>
              )}
            </div>
          </li>
        );
        return;
      }

      // Regular line
      flushList();

      // Check for Markdown headings (#, ##, ###)
      if (line.startsWith('#')) {
        const headingText = line.replace(/^#+\s*/, '');
        nodes.push(
          <h4
            key={`heading-${idx}`}
            className={`font-display font-bold mt-2.5 mb-1 text-sm tracking-tight ${
              isUser ? 'text-white' : 'text-deepblue-950'
            }`}
          >
            {parseInline(headingText, isUser)}
          </h4>
        );
        return;
      }

      // Check for standalone bold section title like "**1. Главные места:**" without leading bullet
      const standaloneTitleMatch = line.match(/^\*\*([^*]+)\*\*$/);
      if (standaloneTitleMatch) {
        nodes.push(
          <div
            key={`title-${idx}`}
            className={`font-semibold mt-2 mb-0.5 text-sm ${
              isUser ? 'text-white font-bold' : 'text-deepblue-950'
            }`}
          >
            {standaloneTitleMatch[1]}
          </div>
        );
        return;
      }

      // Standard paragraph
      nodes.push(
        <p key={`p-${idx}`} className="text-sm leading-relaxed mb-1.5 last:mb-0">
          {parseInline(line, isUser)}
        </p>
      );
    });

    flushList();
    return nodes;
  }, [content, isUser]);

  return <div className="space-y-1 break-words">{elements}</div>;
}
