import React, { useState, useRef, useEffect } from "react";
import "./SYAssistant.css";

// Assets from src/assets/chatbot/
import iconMessage from "../assets/chatbot/chatbot_message.png";
import iconCancel from "../assets/chatbot/chatbot_cancel.png";
import iconDropdown from "../assets/chatbot/chatbot_dropdown.png";
import iconTop from "../assets/chatbot/chatbot_top.png";
import iconBottom from "../assets/chatbot/chatbot_bottom.png";

const CHAT_API = "http://localhost:5000/api/chat";
const WELCOME_MESSAGE = "Hi! I am SY Assistant. Ask me about routes and fares.";

function SYAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Show welcome message when chat opens (only once per open)
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "bot",
          text: WELCOME_MESSAGE,
        },
      ]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const closeChat = () => {
    setIsOpen(false);
  };

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    // Add user message
    const userMessage = { role: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const res = await fetch(CHAT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json().catch(() => ({}));
      const replyText =
        res.ok && data.reply ? data.reply : "Service unavailable right now.";
      setMessages((prev) => [...prev, { role: "bot", text: replyText }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Service unavailable right now." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sy-assistant" aria-label="SY Assistant chat">
      {/* Chat window — fixed left, above the button */}
      {isOpen && (
        <div
          className="sy-assistant-window"
          role="dialog"
          aria-label="Chat window"
        >
          {/* Header: blue bar, dropdown (close) left, top image right */}
          <header className="sy-assistant-header">
            <button
              type="button"
              className="sy-assistant-header-btn"
              onClick={closeChat}
              aria-label="Close chat"
            >
              <img src={iconDropdown} alt="" />
            </button>
            <img
              src={iconTop}
              alt="SY Assistant"
              className="sy-assistant-header-logo"
            />
          </header>

          {/* Body: scrollable messages */}
          <div className="sy-assistant-body">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`sy-assistant-msg sy-assistant-msg--${msg.role}`}
              >
                {msg.role === "bot" && (
                  <img
                    src={iconBottom}
                    alt=""
                    className="sy-assistant-avatar"
                  />
                )}
                <div className="sy-assistant-bubble">
                  <span className="sy-assistant-text">{msg.text}</span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="sy-assistant-msg sy-assistant-msg--bot">
                <img src={iconBottom} alt="" className="sy-assistant-avatar" />
                <div className="sy-assistant-bubble sy-assistant-typing">
                  <span>...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer: input + send */}
          <footer className="sy-assistant-footer">
            <input
              ref={inputRef}
              type="text"
              className="sy-assistant-input"
              placeholder="Ask about routes or fares..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              aria-label="Message input"
            />
            <button
              type="button"
              className="sy-assistant-send"
              onClick={handleSend}
              disabled={isLoading || !inputText.trim()}
              aria-label="Send message"
            >
              Send
            </button>
          </footer>
        </div>
      )}

      {/* Floating button: bottom left — message icon when closed, cancel when open */}
      <button
        type="button"
        className="sy-assistant-toggle"
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
      >
        <img
          src={isOpen ? iconCancel : iconMessage}
          alt=""
          width={56}
          height={56}
        />
      </button>
    </div>
  );
}

export default SYAssistant;
