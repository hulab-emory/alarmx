import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  // materialDark,
  // materialLight,
  oneLight,
} from 'react-syntax-highlighter/dist/cjs/styles/prism';


export default function Markdown({ children }) {
  return (
    <div className="" style={{
      padding: '30px',
    }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                style={oneLight}
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
        }}
      >{children}</ReactMarkdown>
    </div>
  )
}