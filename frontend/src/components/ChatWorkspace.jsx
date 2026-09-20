import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, FileText, Sparkles, ChevronDown, ChevronUp, Copy, Check, Download, Lightbulb, ShieldAlert, BarChart3, ListChecks, Lock, Key, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function formatInline(text) {
  if (!text) return null;
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="text-white font-semibold">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 rounded bg-black/40 border border-cyber-border text-cyan-300 font-mono text-xs">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="text-cyan-200">
          {token.slice(1, -1)}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

function FormattedMessage({ text }) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeBuffer = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${i}`} className="p-3 rounded-xl bg-black/60 border border-cyber-border text-cyan-300 font-mono text-xs overflow-x-auto my-2">
            <code>{codeBuffer.join('\n')}</code>
          </pre>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={`sp-${i}`} className="h-1.5" />);
      continue;
    }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={`h4-${i}`} className="text-sm font-bold text-white mt-2 mb-1 font-['Outfit']">
          {formatInline(trimmed.slice(4))}
        </h4>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-base font-bold text-white mt-3 mb-1.5 font-['Outfit']">
          {formatInline(trimmed.slice(3))}
        </h3>
      );
    } else if (trimmed.startsWith('# ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-lg font-bold text-white mt-3 mb-2 font-['Outfit']">
          {formatInline(trimmed.slice(2))}
        </h2>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <div key={`li-${i}`} className="flex items-start space-x-2 my-1 pl-1">
          <span className="text-cyan-400 font-bold select-none">•</span>
          <span className="text-slate-200 text-sm flex-1 leading-relaxed">{formatInline(trimmed.slice(2))}</span>
        </div>
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)\.\s(.*)$/);
      elements.push(
        <div key={`nli-${i}`} className="flex items-start space-x-2 my-1 pl-1">
          <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20 select-none">
            {match[1]}
          </span>
          <span className="text-slate-200 text-sm flex-1 leading-relaxed">{formatInline(match[2])}</span>
        </div>
      );
    } else {
      elements.push(
        <p key={`p-${i}`} className="my-1 text-slate-200 text-sm leading-relaxed">
          {formatInline(line)}
        </p>
      );
    }
  }

  if (inCodeBlock && codeBuffer.length > 0) {
    elements.push(
      <pre key="code-end" className="p-3 rounded-xl bg-black/60 border border-cyber-border text-cyan-300 font-mono text-xs overflow-x-auto my-2">
        <code>{codeBuffer.join('\n')}</code>
      </pre>
    );
  }

  return <div className="space-y-0.5">{elements}</div>;
}

export default function ChatWorkspace({ 
  messages, 
  onSendMessage, 
  loading, 
  onStopResponse,
  hasDocs, 
  onExportChat, 
  settings,
  licenseInfo,
  onOpenLicense
}) {
  const [input, setInput] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAnswerIndex, setCopiedAnswerIndex] = useState(null);
  const [expandedCitations, setExpandedCitations] = useState({});
  const messagesEndRef = useRef(null);

  const autoScrollEnabled = settings?.autoScroll ?? true;
  const showCitationsDefault = settings?.showCitationsDefault ?? true;

  const scrollToBottom = () => {
    if (autoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSendMessage(input);
    setInput('');
  };

  const handleChipClick = (promptText) => {
    if (loading) return;
    onSendMessage(promptText);
  };

  const toggleCitations = (idx) => {
    setExpandedCitations(prev => ({
      ...prev,
      [idx]: prev[idx] !== undefined ? !prev[idx] : !showCitationsDefault
    }));
  };

  const isCitationExpanded = (idx) => {
    return expandedCitations[idx] !== undefined ? expandedCitations[idx] : showCitationsDefault;
  };

  const handleCopyCitations = (citations, idx) => {
    const formatted = citations.map(c => `[Source: ${c.source}, Page ${c.page}]\n${c.content}`).join('\n\n');
    navigator.clipboard.writeText(formatted);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAnswer = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedAnswerIndex(idx);
    setTimeout(() => setCopiedAnswerIndex(null), 2000);
  };

  // Sample prompt chips for non-technical users
  const promptChips = [
    { icon: Lightbulb, label: "Summarize key findings", text: "Please provide a concise summary of the key findings in the document." },
    { icon: ShieldAlert, label: "List risks & warnings", text: "What are the main risks, warnings, or compliance issues mentioned?" },
    { icon: BarChart3, label: "Extract key data & numbers", text: "Extract and summarize the key numbers, dates, and data points." },
    { icon: ListChecks, label: "Create action items", text: "List the main action items, recommendations, and next steps." }
  ];

  return (
    <main className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] bg-transparent overflow-hidden relative">
      {/* Workspace Header & Export Toolbar */}
      <div className="h-12 border-b border-cyber-border bg-cyber-card/40 px-6 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white tracking-wide">Smart Document Assistant</span>
          <span className="text-[10px] text-cyber-muted font-mono">• Active Session</span>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onExportChat}
            className="px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-medium flex items-center space-x-1.5 transition-all text-xs"
            title="Export Q&A thread to Markdown file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report (.md)</span>
          </button>
        )}
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-cyber-glow">
              <Bot className="w-8 h-8 text-blue-400" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">Ask Questions About Your Documents</h3>
              <p className="text-xs text-cyber-muted mt-1 leading-relaxed">
                {hasDocs 
                  ? "Your documents are ready. Click a quick starter below or type a question to extract insights."
                  : "Upload a PDF, TXT, MD, or DOCX document in the sidebar to get started."}
              </p>
            </div>

            {/* Smart Prompt Starter Chips for Non-Technical Users */}
            {hasDocs && (
              <div className="grid grid-cols-2 gap-3 w-full pt-2">
                {promptChips.map((chip, cIdx) => {
                  const ChipIcon = chip.icon;
                  return (
                    <button
                      key={cIdx}
                      onClick={() => handleChipClick(chip.text)}
                      disabled={loading}
                      className="p-3 rounded-xl glass-panel border border-cyber-border hover:border-blue-500/40 hover:bg-cyber-card/80 text-left transition-all group flex items-start space-x-2.5"
                    >
                      <ChipIcon className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">{chip.label}</p>
                        <p className="text-[10px] text-cyber-muted line-clamp-1 mt-0.5">{chip.text}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start space-x-3 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white ${
                msg.sender === 'user' ? 'bg-blue-600 shadow-cyber-glow' : 'bg-cyber-card border border-cyber-border'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-cyan-400" />}
              </div>

              <div className="space-y-3 flex-1">
                {/* Message Bubble + Copy Answer Button */}
                <div className={`group relative p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600/90 text-white shadow-cyber-glow rounded-tr-none' 
                    : 'glass-panel text-slate-200 border-cyber-border rounded-tl-none'
                }`}>
                  {msg.sender === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <FormattedMessage text={msg.text} />
                  )}

                  {/* Copy Answer Icon for Bot Messages */}
                  {msg.sender === 'bot' && (
                    <button
                      onClick={() => handleCopyAnswer(msg.text, idx)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-cyber-card/80 text-cyber-muted hover:text-white border border-cyber-border opacity-0 group-hover:opacity-100 transition-all text-xs flex items-center gap-1"
                      title="Copy Answer"
                    >
                      {copiedAnswerIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-[10px] text-emerald-400 font-mono">Copied</span>
                        </>
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>

                {/* Page References Accordion Card */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="rounded-xl border border-cyber-border bg-cyber-card/40 overflow-hidden">
                    <button
                      onClick={() => toggleCitations(idx)}
                      className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-cyber-muted hover:text-white bg-cyber-card/80 transition-colors"
                    >
                      <span className="flex items-center gap-1.5 text-cyan-400">
                        <FileText className="w-3.5 h-3.5" />
                        Page References ({msg.citations.length})
                      </span>
                      {isCitationExpanded(idx) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <AnimatePresence>
                      {isCitationExpanded(idx) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="p-3 border-t border-cyber-border space-y-2 bg-cyber-bg/50"
                        >
                          <div className="flex justify-end mb-1">
                            <button
                              onClick={() => handleCopyCitations(msg.citations, idx)}
                              className="px-2 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[10px] font-mono flex items-center gap-1 transition-all"
                            >
                              {copiedIndex === idx ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" /> Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" /> Copy References
                                </>
                              )}
                            </button>
                          </div>

                          {msg.citations.map((cite, cIdx) => (
                            <div key={cIdx} className="p-2.5 rounded-lg bg-cyber-card/60 border border-cyber-border text-xs space-y-1">
                              <div className="flex items-center justify-between text-[10px] text-cyber-muted font-mono">
                                <span className="text-cyan-400 font-semibold">{cite.source}</span>
                                <span>Page {cite.page}</span>
                              </div>
                              <p className="text-slate-300 italic text-[11px] font-mono border-l-2 border-cyan-500/40 pl-2">
                                "{cite.content}"
                              </p>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start space-x-3"
          >
            <div className="w-8 h-8 rounded-xl bg-cyber-card border border-cyber-border flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <div className="p-4 rounded-2xl glass-panel text-xs text-cyber-muted font-mono flex items-center justify-between space-x-4 max-w-md">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Searching document & crafting answer...</span>
              </div>
              {onStopResponse && (
                <button
                  type="button"
                  onClick={onStopResponse}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 hover:border-red-500/60 text-red-400 text-xs font-mono transition-all shadow-sm"
                  title="Stop generating"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>Stop</span>
                </button>
              )}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Prompt Box + Quick Chips Bar */}
      <div className="p-4 glass-panel border-t border-cyber-border z-10 space-y-2">
        {hasDocs && messages.length > 0 && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-4xl mx-auto scrollbar-none">
            {promptChips.map((chip, cIdx) => {
              const ChipIcon = chip.icon;
              return (
                <button
                  key={cIdx}
                  onClick={() => handleChipClick(chip.text)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-lg bg-cyber-card/60 hover:bg-blue-500/10 border border-cyber-border hover:border-blue-500/30 text-cyber-muted hover:text-white text-[11px] font-medium flex items-center gap-1.5 flex-shrink-0 transition-all"
                >
                  <ChipIcon className="w-3 h-3 text-cyan-400" />
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative flex items-center max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder={hasDocs ? "Ask a question about your uploaded documents..." : "Upload a PDF or document first..."}
            className="w-full py-3.5 pl-5 pr-28 rounded-2xl bg-cyber-card/80 border border-cyber-border text-white text-sm placeholder-cyber-muted focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/60 transition-all shadow-inner"
          />

          {loading ? (
            <button
              type="button"
              onClick={onStopResponse}
              className="absolute right-2 px-3 py-2 rounded-xl bg-red-600/90 hover:bg-red-500 text-white transition-all shadow-lg flex items-center gap-1.5 text-xs font-semibold border border-red-400/30 animate-pulse"
              title="Stop generation"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-cyber-glow disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>
    </main>
  );
}
