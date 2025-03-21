import React, { CSSProperties, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

// Dynamically import ESM modules for non-test environments
const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });
const remarkGfm = dynamic(() => import("remark-gfm"), { ssr: false });
const rehypeRaw = dynamic(() => import("rehype-raw"), { ssr: false });
const rehypeSanitize = dynamic(() => import("rehype-sanitize"), { ssr: false });

interface MarkdownProps {
  content: string;
}

const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  // Remove the test-conditional synchronous require code and always initialize as empty
  const [plugins, setPlugins] = useState<any[]>([]);
  const [rehypePlugins, setRehypePlugins] = useState<any[]>([]);

  useEffect(() => {
    const loadPlugins = async () => {
      const [remarkGfmModule, rehypeRawModule, rehypeSanitizeModule] =
        await Promise.all([
          import("remark-gfm"),
          import("rehype-raw"),
          import("rehype-sanitize"),
        ]);
      setPlugins([remarkGfmModule.default]);
      setRehypePlugins([rehypeRawModule.default, rehypeSanitizeModule.default]);
    };
    loadPlugins();
  }, []);

  if (!plugins.length || !rehypePlugins.length) {
    return <div>Loading markdown renderer...</div>;
  }

  return (
    <div
      className="markdown-content prose prose-invert max-w-none"
      data-cy="markdown-content"
    >
      <ReactMarkdown
        remarkPlugins={plugins}
        rehypePlugins={rehypePlugins}
        components={{
          code({ node, className, children, ...props }) {
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
          li({ node, children, ...props }) {
            return <li {...props}>{children}</li>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
