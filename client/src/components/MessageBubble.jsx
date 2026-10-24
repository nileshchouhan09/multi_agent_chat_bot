
import { X, Copy, Check } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const MessageBubble = ({ role, content, images = [] }) => {
  const isUser = role === "user";
  const [lightBox, setLightBox] = useState("");
  const [copyCode, setCopyCode] = useState("");

  const getCodeText = (node) => {
    if (typeof node === "string" || typeof node === "number") {
      return String(node);
    }

    if (Array.isArray(node)) {
      return node.map(getCodeText).join("");
    }

    if (node?.props?.children != null) {
      return getCodeText(node.props.children);
    }

    return "";
  };

  const copyCodeFunc = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyCode(code);
      setTimeout(() => setCopyCode(""), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div
      className={`flex w-full mb-7 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`relative min-w-0 max-w-[94%] md:max-w-[78%] text-[14px] md:text-[15px] leading-7 break-words ${
          isUser
            ? "px-5 py-3 rounded-[22px] rounded-tr-[6px] text-slate-200 bg-[#1a1b20] border border-white/[0.06]"
            : "px-1 py-1 text-slate-200 w-full"
        }`}
      >
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {images.map((image, index) => (
              <img
                key={image || index}
                src={image}
                onClick={() => setLightBox(image)}
                loading="lazy"
                onError={(e) => e.currentTarget.remove()}
                alt={`Attachment ${index + 1}`}
                className="w-40 h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition-opacity duration-200"
              />
            ))}
          </div>
        )}

        <div
          className={`${
            isUser
              ? "[&_p]:m-0 [&_pre]:my-3 [&_pre]:rounded-xl [&_a]:no-underline [&_a]:text-slate-200"
              : "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-white [&_h1]:mt-7 [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-100 [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-100 [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:my-3 [&_ul]:my-3 [&_ol]:my-3 [&_li]:my-1.5 [&_a]:text-indigo-400 [&_a]:no-underline [&_blockquote]:border-l-2 [&_blockquote]:border-indigo-400 [&_blockquote]:pl-4 [&_blockquote]:text-slate-400 [&_hr]:border-white/10 [&_hr]:my-5"
          }`}
        >
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-7 mb-4 pb-3 border-b border-white/10">
                  {children}
                </h1>
              ),

              h2: ({ children }) => (
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-100 mt-7 mb-3">
                  {children}
                </h2>
              ),

              h3: ({ children }) => (
                <h3 className="text-lg font-semibold text-indigo-200 mt-5 mb-2">
                  {children}
                </h3>
              ),

              p: ({ children }) => (
                <p className="text-slate-300 leading-7 my-3">{children}</p>
              ),

              strong: ({ children }) => (
                <strong className="font-semibold text-white">
                  {children}
                </strong>
              ),

              em: ({ children }) => (
                <em className="text-violet-200 not-italic">{children}</em>
              ),

              ul: ({ children }) => (
                <ul className="my-4 ml-1 space-y-2 list-disc pl-5 marker:text-indigo-400">
                  {children}
                </ul>
              ),

              ol: ({ children }) => (
                <ol className="my-4 ml-1 space-y-2 list-decimal pl-5 marker:text-indigo-400 marker:font-semibold">
                  {children}
                </ol>
              ),

              li: ({ children }) => (
                <li className="pl-1 text-slate-300 leading-7">{children}</li>
              ),

              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`no-underline transition-colors ${
                    isUser
                      ? "text-slate-200 hover:text-white"
                      : "text-indigo-400 hover:text-violet-300"
                  }`}
                >
                  {children}
                </a>
              ),

              blockquote: ({ children }) => (
                <blockquote className="my-5 border-l-[3px] border-indigo-500 bg-indigo-500/[0.06] rounded-r-xl px-4 py-3 text-slate-300">
                  {children}
                </blockquote>
              ),

              hr: () => <hr className="my-6 border-white/10" />,

              table: ({ children }) => (
                <div className="my-5 w-full overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full border-collapse text-sm text-left">
                    {children}
                  </table>
                </div>
              ),

              thead: ({ children }) => (
                <thead className="bg-indigo-500/10 text-slate-100">
                  {children}
                </thead>
              ),

              th: ({ children }) => (
                <th className="px-4 py-3 font-semibold border-b border-white/10 whitespace-nowrap">
                  {children}
                </th>
              ),

              td: ({ children }) => (
                <td className="px-4 py-3 border-b border-white/[0.06] text-slate-300">
                  {children}
                </td>
              ),

              del: ({ children }) => (
                <del className="text-slate-500">{children}</del>
              ),

              input: ({ checked, ...props }) => (
                <input
                  {...props}
                  checked={checked}
                  readOnly
                  type="checkbox"
                  className="mr-2 accent-indigo-500 align-middle"
                />
              ),

              pre: ({ children }) => {
                const child = children?.props;
                const className = child?.className || "";
                const match = /language-([\w+#.-]+)/.exec(className);
                const language = match?.[1] || "code";
                const code = getCodeText(child?.children).replace(/\n*$/, "");
                const isCopied = copyCode === code && code.length > 0;

                return (
                  <div className="my-5 overflow-hidden rounded-xl border border-white/10 bg-[#0b0d12] shadow-lg">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.04] border-b border-white/10">
                      <span className="text-xs font-medium tracking-wide text-slate-400">
                        {language}
                      </span>

                      <button
                        type="button"
                        onClick={() => copyCodeFunc(code)}
                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                      >
                        {isCopied ? (
                          <Check size={14} className="text-emerald-400" />
                        ) : (
                          <Copy size={14} />
                        )}
                        {isCopied ? "Copied!" : "Copy code"}
                      </button>
                    </div>

                    <pre className="overflow-x-auto p-4 text-[13px] leading-6">
                      {children}
                    </pre>
                  </div>
                );
              },

              code: ({ children, className }) => {
                const isBlock = Boolean(className);

                return isBlock ? (
                  <code className={className}>{children}</code>
                ) : (
                  <code className="rounded-md border border-indigo-400/10 bg-indigo-400/10 px-1.5 py-0.5 font-mono text-[0.88em] text-violet-300">
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </Markdown>
        </div>
      </div>

      {lightBox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setLightBox("")}
        >
          <button
            type="button"
            onClick={() => setLightBox("")}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 rounded-full p-2"
          >
            <X size={20} />
          </button>

          <img
            src={lightBox}
            loading="lazy"
            onError={(e) => e.currentTarget.remove()}
            alt="Attachment preview"
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
