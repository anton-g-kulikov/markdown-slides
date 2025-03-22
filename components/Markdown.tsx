import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import dynamic from "next/dynamic";

// Dynamically import ReactMarkdown (which is a component)
const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

// Don't use dynamic for plugins as they're not React components
// Instead use a client-side only wrapper component that loads them
const MarkdownRenderer = ({ content }: { content: string }) => {
  const [isReady, setIsReady] = React.useState(false);
  const [remarkPlugins, setRemarkPlugins] = React.useState<any[]>([]);
  const [rehypePlugins, setRehypePlugins] = React.useState<any[]>([]);
  const [markdownComponents, setMarkdownComponents] = React.useState<any>(null);

  React.useEffect(() => {
    // Import plugins only on the client side
    const loadPlugins = async () => {
      try {
        // Import all required plugins
        const [remarkGfm, rehypeRaw, rehypeSanitize] = await Promise.all([
          import("remark-gfm"),
          import("rehype-raw"),
          import("rehype-sanitize"),
        ]);

        // Create the components object for ReactMarkdown
        setMarkdownComponents({
          code({ node, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const { ref, ...restProps } = props;
            return !match ? (
              <code className={className} {...restProps} data-cy="inline-code">
                {children}
              </code>
            ) : (
              <SyntaxHighlighter
                style={vscDarkPlus as any}
                language={match[1]}
                PreTag="div"
                className={`language-${match[1]}`}
                {...restProps}
                data-cy="code-block"
                data-testid="code-block"
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            );
          },
          li({ node, children, ...props }: any) {
            return <li {...props}>{children}</li>;
          },
        });

        // Set plugins separately using properly typed state setters
        setRemarkPlugins([remarkGfm.default]);
        setRehypePlugins([rehypeRaw.default, rehypeSanitize.default]);
        setIsReady(true);
      } catch (error) {
        console.error("Error loading markdown plugins:", error);
      }
    };

    loadPlugins();
  }, []);

  if (!isReady || !markdownComponents) {
    return <div className="animate-pulse">Loading markdown...</div>;
  }

  return (
    <ReactMarkdown
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
      components={markdownComponents}
    >
      {content}
    </ReactMarkdown>
  );
};

interface MarkdownProps {
  content: string;
}

const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  return (
    <div
      className="markdown-content prose prose-invert max-w-none"
      data-cy="markdown-content"
      data-testid="markdown-content"
    >
      <MarkdownRenderer content={content} />
    </div>
  );
};

export default Markdown;
