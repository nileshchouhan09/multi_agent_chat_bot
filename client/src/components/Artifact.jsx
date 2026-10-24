import {
  Check,
  Code2,
  Copy,
  Eye,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { easeInOut, motion } from "motion/react";
import Editor from "@monaco-editor/react";

const Artifact = () => {
  const artifacts = useSelector((state) => state.message.artifacts);
  const [collapase, setCollapse] = useState(false);

  const [tab, setTab] = useState("code");
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);



  const detectLanguage = (fileName = "") => {
    const name = fileName.toLocaleLowerCase();
    if (name.endsWith(".html")) return "html";
    if (name.endsWith(".css")) return "css";
    if (name.endsWith(".js")) return "javascript";
    if (name.endsWith(".jsx")) return "javascript";
    if (name.endsWith(".ts")) return "typescript";
    if (name.endsWith(".tsx")) return "typescript";
    if (name.endsWith(".json")) return "json";
    if (name.endsWith(".py")) return "python";
    if (name.endsWith(".cpp")) return "cpp";
    if (name.endsWith(".c")) return "cpp";
    if (name.endsWith(".java")) return "java";
    if (name.endsWith(".rb")) return "ruby";
    if (name.endsWith(".go")) return "go";
    if (name.endsWith(".rs")) return "rust";
    if (name.endsWith(".sql")) return "sql";
    if (name.endsWith(".php")) return "php";
    if (name.endsWith(".md")) return "markdown";
    return "plaintext";
  }; //
  const file = artifacts[0]?.files[activeFile];
  const htmlFile = artifacts[0]?.files?.find((f) => f.name === "index.html");
  const cssfile = artifacts[0]?.files?.find((f) => f.name === "style.css");
  const jsFile = artifacts[0]?.files?.find((f) => f.name === "script.js");

  const handleCopy = () => {
    navigator.clipboard.writeText(file?.content || "");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const canPreview = Boolean(htmlFile);
  const previewDoc = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Your website description">
    <style>
    ${cssfile?.content || ""}
    </style>
</head>
<body>
${htmlFile?.content || ""}

    <script>
    ${jsFile?.content || ""}
    </script>
</body>
</html>
  `;

  if (artifacts.length == 0) return null;

  return (
    <motion.div
      initial={{ width: "400px" }}
      animate={{ width: collapase ? 36 : 400 }}
      transition={{
        duration: 0.3,
        ease: easeInOut,
      }}
      className="hidden lg:flex h-full border-1 border-white/[0.06] flex-col overflow-hidden shrink-0 w-[250px]"
    >
      {!collapase ? (
        <div className="flex flex-col h-full bg-[#0d0f14] ">
          <div className="h-14 px-4 border-b border-white/6 flex items-center gap-3 shrink-0 ">
            <button
              onClick={() => setCollapse((prev) => !prev)}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0 "
            >
              <PanelRightClose size={16} />
            </button>

            <div className="flex items-center gap-2 flex-1 min-w-0 ">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 shrink-0">
                <Code2 className="text-indigo-400" size={12} />
              </div>

              <div className="text-[13px] font-medium text-slate-200 truncate">
                {artifacts[0].title}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer rounded-lg">
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>

              {canPreview && (
                <div className="flex items-center gap-1 bg-white/4 border border-white/6 p-1 rounded-lg">
                  <button
                    onClick={() => setTab("code")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors duration-150
                  ${
                    tab === "code"
                      ? "bg-indigo-500 text-slate-200"
                      : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                  }`}
                  >
                    <Code2 size={11} /> Code
                  </button>

                  <button
                    onClick={() => setTab("preview")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors duration-150
                  ${
                    tab === "preview"
                      ? "bg-indigo-500 text-slate-200"
                      : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                  }`}
                  >
                    <Eye size={11} /> Preview
                  </button>
                </div>
              )}
            </div>
          </div>

          {tab === "code" && (
            <div className="h-auto flex border-b border-white/6 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden shrink-0">
              {artifacts[0]?.files.map((file, index) => (
                <button
                  onClick={() => setActiveFile(index)}
                  className={`px-4 py-2.5 text-[11px] font-medium whitespace-nowrap transition-colors duration-150 border-r border-white/5 relative cursor-pointer bg-transparent
                      ${
                        activeFile === index
                          ? "text-indigo-400"
                          : "text-slate-500 hover:text-slate-300"
                      }
                      `}
                >
                  {file.name}

                  {activeFile === index && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 rounded-t-full"></div>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            {tab === "preview" && canPreview ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.5,
                }}
                className="w-full h-full"
              >
                <iframe
                  title="preview"
                  srcDoc={previewDoc}
                  sandbox="allow-scripts"
                  className="w-full h-full bg-white"
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.5,
                }}
                className="h-full"
              >
                <Editor
                  height="100%"
                  language={detectLanguage(
                    artifacts[0]?.files[activeFile].name,
                  )}
                  theme="vs-dark"
                  value={artifacts[0]?.files[activeFile].content}
                  options={{
                    minimap: {
                      enabled: false,
                    },
                    readOnly: true,
                    fontSize: 14,
                    wordWrap: "on",
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    padding: {
                      top: 10,
                      bottom: 10,
                    },
                    lineNumbers: "on",
                    renderLineHighlight: "none",
                  }}
                />
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex h-full border border-white/6 bg-[#0d0f14] flex-col items-center py-4 gap-3 shrink-0 ">
          <button
            onClick={() => setCollapse((prev) => !prev)}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0 "
          >
            <PanelRightOpen size={16} />
          </button>

          <div
            className="text-[10px] font-medium text-slate-600 tracking-widest uppercase whitespace-nowrap "
            style={{
              writingMode: "vertical-lr",
            }}
          >
            {artifacts[0].title}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Artifact;
