import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const EditorialSection = ({ problem }) => {
  const solutions = problem?.referenceSolution || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeSolution = solutions[activeIndex];

  const handleCopy = async () => {
    if (activeSolution?.solutionCode) {
      await navigator.clipboard.writeText(activeSolution.solutionCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="space-y-12 mb-8">
      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        {problem?.title || "Untitled Problem"}
      </h2>

      {/* Video Section */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          🎥 Video Solution
        </h3>
        {problem?.secureUrl ? (
          <video
            src={problem.secureUrl}
            controls
            className="w-full h-auto rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm"
            style={{ maxHeight: "65vh" }}
          />
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">
            Video Solution is not available for this problem.
          </p>
        )}
      </section>

      {/* Divider */}
      <hr className="border-gray-300 dark:border-gray-700" />

      {/* Code Section */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          💻 Reference Solutions
        </h3>

        {solutions.length > 0 ? (
          <>
            {/* Tabs */}
            <div className="flex flex-wrap gap-3">
              {solutions.map((sol, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-colors border ${
                    activeIndex === index
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                      : "border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/20"
                  }`}
                >
                  {sol.language}
                </button>
              ))}
            </div>

            {/* Code block */}
            <div className="relative mt-6 rounded-lg overflow-hidden">
              {/* Mini copy button */}
              <button
                onClick={handleCopy}
                className={`absolute top-3 right-3 p-2 rounded-md border text-sm transition-colors shadow-sm
                  ${
                    copied
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-green-600 text-green-600 bg-white/90 dark:bg-gray-800/90 hover:bg-green-50 dark:hover:bg-green-600/20"
                  }`}
                title={copied ? "Copied!" : "Copy code"}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>

              {/* Code block background */}
              <div className="bg-gray-900">
                <SyntaxHighlighter
                  language={activeSolution.language?.toLowerCase() || "text"}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: "2rem", // more padding inside the code
                    fontSize: "0.95rem",
                    lineHeight: "1.7",
                    background: "transparent",
                  }}
                  wrapLines
                  showLineNumbers
                >
                  {activeSolution.solutionCode}
                </SyntaxHighlighter>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">
            No reference solutions available.
          </p>
        )}
      </section>
    </div>
  );
};

export default EditorialSection;

