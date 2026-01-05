"use client"
import { useState, useRef, useEffect, useCallback, FormEvent, KeyboardEvent } from 'react';
import { sendChat, ChatMessage } from '@/services/chat';

// Fallback responses for when API is unavailable
const fallbackResponses: Record<string, string> = {
    "hello": "Hi there! How can I help you today?",
    "help": "You can ask me about our services, projects, or anything else you need to know.",
    "services": "We offer web development, design, and consulting services.",
    "projects": "Check out our portfolio to see some of our recent work.",
    "contact": "You can reach us through the contact form or email us directly.",
    "default": "I'm sorry, I didn't understand that. Could you please rephrase?"
};

export default function Chat() {
    const [isOpen, setIsOpen] = useState(false);
    const [isTheaterMode, setIsTheaterMode] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const TypingDots = () => (
        <div className="flex items-center gap-1">
            <span 
                className="h-2 w-2 rounded-full bg-current opacity-70 animate-pulse"
                style={{ animationDelay: '0ms' }}
            />
            <span 
                className="h-2 w-2 rounded-full bg-current opacity-70 animate-pulse"
                style={{ animationDelay: '200ms' }}
            />
            <span 
                className="h-2 w-2 rounded-full bg-current opacity-70 animate-pulse"
                style={{ animationDelay: '400ms' }}
            />
        </div>
    );

    const TypingBubble = ({ compact = true }: { compact?: boolean }) => (
        <div 
            className={`max-w-[${compact ? '80%' : '70%'}] ${compact ? 'p-3' : 'p-4'} rounded-2xl bg-[var(--border-color)] text-[var(--text-color)] rounded-bl-none border border-[var(--border-color)] animate-bounce`}
        >
            <TypingDots />
        </div>
    );

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const toggleTheaterMode = useCallback(() => {
        setIsTheaterMode(!isTheaterMode);
        if (!isTheaterMode) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isTheaterMode]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: globalThis.KeyboardEvent) => {
            if (e.key === 'Escape' && isTheaterMode) {
                e.preventDefault();
                toggleTheaterMode();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isTheaterMode, toggleTheaterMode]);

    // Cleanup body overflow on unmount
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleClearMessages = () => {
        if (messages.length === 0) return;
        const ok = window.confirm('Clear all chat messages?');
        if (!ok) return;
        setMessages([]);
    };

    const getFallbackResponse = (userInput: string) => {
        const input = userInput.toLowerCase();
        for (const [key, response] of Object.entries(fallbackResponses)) {
            if (input.includes(key)) {
                return response;
            }
        }
        return fallbackResponses.default;
    };

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString()
        };

        const currentInput = inputMessage;
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);
        setError(null);

        try {
            // Get all messages for context (limit to last 10 for API efficiency)
            const contextMessages = [...messages, userMessage].slice(-10);
            
            // Call server-side API route
            const aiResponse = await sendChat(contextMessages);

            const botMessage: ChatMessage = {
                id: Date.now() + 1,
                text: aiResponse,
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString()
            };
            
            setMessages(prev => [...prev, botMessage]);
        } catch (error: any) {
            console.error('Chat error:', error);
            setError(error.message);
            
            // Fallback to predefined responses
            const fallbackMessage: ChatMessage = {
                id: Date.now() + 1,
                text: getFallbackResponse(currentInput),
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString(),
                isError: true
            };
            
            setMessages(prev => [...prev, fallbackMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            // Create a synthetic event or call logic directly
            // Since handleSendMessage expects FormEvent, we can just call logic if we separate it, 
            // but for now let's just cast or mock the event.
            // Easier: extract logic or just call it.
            // Let's manually trigger the form submit logic or just copy logic.
            // Best practice: separate submit logic. But for quick migration:
            // handleSendMessage(e as unknown as FormEvent);
            // Actually, handleSendMessage takes FormEvent. We can pass a synthetic one.
            const form = (e.target as HTMLElement).closest('form');
            if (form) form.requestSubmit();
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            <div className="fixed bottom-30 right-5 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="chat-toggle-btn"
                >
                    {isOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    )}
                </button>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className={`chat-overlay ${isTheaterMode ? 'theater-mode' : ''}`}>
                    <div className="chat-container">
                        <div className="chat-header">
                            <h3>Chat Assistant</h3>
                            <div className="chat-controls">
                                <button 
                                    onClick={toggleTheaterMode}
                                    className="control-btn"
                                    title={isTheaterMode ? 'Exit Theater Mode' : 'Theater Mode'}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                                <button 
                                    onClick={handleClearMessages}
                                    className="control-btn"
                                    title="Clear Messages"
                                    disabled={messages.length === 0}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                                <div className="status-indicator online"></div>
                            </div>
                        </div>
                        
                        <div className="chat-messages">
                            {error && (
                                <div className="error-banner">
                                    <span>⚠️ {error}</span>
                                    <button onClick={() => setError(null)} className="error-close">×</button>
                                </div>
                            )}
                            
                            {messages.length === 0 && (
                                <div className="welcome-message">
                                    <div className="message bot">
                                        <div className="message-content">
                                            <p>👋 Hello! I'm your AI assistant from SupwilSoft. How can I help you today?</p>
                                            <span className="timestamp">{new Date().toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                    <div className="quick-actions">
                                        <button onClick={() => setInputMessage('Tell me about SupwilSoft')} className="quick-btn">About SupwilSoft</button>
                                        <button onClick={() => setInputMessage('What services do you offer?')} className="quick-btn">Our Services</button>
                                        <button onClick={() => setInputMessage('How can I contact you?')} className="quick-btn">Contact Info</button>
                                    </div>
                                </div>
                            )}
                            
                            {messages.map((message, index) => {
                                const key = message.id !== undefined ? String(message.id) : `msg-${index}`;
                                return (
                                    <div key={key} className={`message ${message.sender} ${message.isError ? 'error' : ''}`}>
                                        <div className="message-content">
                                            {message.isError && <span className="error-indicator">⚠️ </span>}
                                            <p>{message.text}</p>
                                            <span className="timestamp">{message.timestamp}</span>
                                            {message.isError && <span className="fallback-note">(Fallback response)</span>}
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {isTyping && (
                                <div className="message bot typing">
                                    <div className="message-content">
                                        <TypingBubble compact={!isTheaterMode} />
                                    </div>
                                </div>
                            )}
                            
                            <div ref={messagesEndRef} />
                        </div>
                        
                        <form onSubmit={handleSendMessage} className="chat-input-form">
                            <div className="input-container">
                                <textarea
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message..."
                                    className="chat-input"
                                    rows={1}
                                />
                                <button 
                                    type="submit" 
                                    className="send-button"
                                    disabled={!inputMessage.trim()}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
             
             <style jsx>{`
                 .chat-toggle-btn {
                     width: 64px;
                     height: 64px;
                     border-radius: 50%;
                     background: linear-gradient(135deg, var(--main-color), var(--main-color));
                     color: white;
                     border: none;
                     cursor: pointer;
                     display: flex;
                     align-items: center;
                     justify-content: center;
                     box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                     transition: all 0.3s ease;
                 }
                 
                 .chat-toggle-btn:hover {
                     transform: scale(1.1);
                     box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
                 }
                 
                 .chat-overlay {
                     position: fixed;
                     bottom: 200px;
                     right: 24px;
                     z-index: 40;
                     transition: all 0.3s ease;
                 }
                 
                 .chat-overlay.theater-mode {
                     top: 0;
                     left: 0;
                     right: 0;
                     bottom: 0;
                     background: rgba(0, 0, 0, 0.5);
                     display: flex;
                     align-items: center;
                     justify-content: center;
                 }
                 
                 .chat-container {
                     display: flex;
                     flex-direction: column;
                     height: 600px;
                     width: 400px;
                     background: var(--background);
                     border: 1px solid var(--border-color);
                     border-radius: 12px;
                     overflow: hidden;
                     box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                 }
                 
                 .theater-mode .chat-container {
                     width: 90vw;
                     height: 90vh;
                     max-width: 1200px;
                     max-height: 800px;
                 }
                
                .chat-header {
                     display: flex;
                     align-items: center;
                     justify-content: space-between;
                     padding: 16px 20px;
                     background: var(--main-color);
                     color: white;
                     border-bottom: 1px solid var(--border-color);
                 }
                 
                 .chat-header h3 {
                     margin: 0;
                     font-size: 18px;
                     font-weight: 600;
                 }
                 
                 .chat-controls {
                     display: flex;
                     align-items: center;
                     gap: 8px;
                 }
                 
                 .control-btn {
                     background: rgba(255, 255, 255, 0.1);
                     border: none;
                     color: white;
                     padding: 6px;
                     border-radius: 6px;
                     cursor: pointer;
                     transition: background 0.2s ease;
                 }
                 
                 .control-btn:hover:not(:disabled) {
                     background: rgba(255, 255, 255, 0.2);
                 }
                 
                 .control-btn:disabled {
                     opacity: 0.5;
                     cursor: not-allowed;
                 }
                 
                 .status-indicator {
                     width: 10px;
                     height: 10px;
                     border-radius: 50%;
                     background: #4ade80;
                 }
                 
                 .status-indicator.online {
                     animation: pulse 2s infinite;
                 }
                 
                 @keyframes pulse {
                     0%, 100% { opacity: 1; }
                     50% { opacity: 0.5; }
                 }
                
                .chat-messages {
                     flex: 1;
                     padding: 20px;
                     overflow-y: auto;
                     display: flex;
                     flex-direction: column;
                     gap: 16px;
                     background: var(--background);
                 }
                 
                 .error-banner {
                     background: #fee2e2;
                     border: 1px solid #fecaca;
                     color: #dc2626;
                     padding: 12px 16px;
                     border-radius: 8px;
                     display: flex;
                     align-items: center;
                     justify-content: space-between;
                     margin-bottom: 16px;
                     font-size: 14px;
                 }
                 
                 .error-close {
                     background: none;
                     border: none;
                     color: #dc2626;
                     cursor: pointer;
                     font-size: 18px;
                     font-weight: bold;
                     padding: 0;
                     width: 20px;
                     height: 20px;
                     display: flex;
                     align-items: center;
                     justify-content: center;
                 }
                 
                 .error-close:hover {
                     background: rgba(220, 38, 38, 0.1);
                     border-radius: 50%;
                 }
                 
                 .welcome-message {
                     display: flex;
                     flex-direction: column;
                     gap: 16px;
                     margin-top: auto;
                 }
                 
                 .quick-actions {
                     display: flex;
                     flex-wrap: wrap;
                     gap: 8px;
                     margin-top: 12px;
                 }
                 
                 .quick-btn {
                     background: var(--border-color);
                     color: var(--text-color);
                     border: 1px solid var(--border-color);
                     padding: 8px 12px;
                     border-radius: 16px;
                     font-size: 12px;
                     cursor: pointer;
                     transition: all 0.2s ease;
                 }
                 
                 .quick-btn:hover {
                     background: var(--main-color);
                     color: white;
                     border-color: var(--main-color);
                 }
                
                .message {
                    display: flex;
                    max-width: 70%;
                }
                
                .message.user {
                    align-self: flex-end;
                }
                
                .message.bot {
                    align-self: flex-start;
                }
                
                .message-content {
                    padding: 12px 16px;
                    border-radius: 18px;
                    position: relative;
                }
                
                .message.user .message-content {
                    background: var(--main-color);
                    color: white;
                    border-bottom-right-radius: 4px;
                }
                
                .message.bot .message-content {
                    background: var(--border-color);
                    color: var(--text-color);
                    border-bottom-left-radius: 4px;
                }
                
                .message.error .message-content {
                    background: #fef3cd;
                    border: 1px solid #fde68a;
                    color: #92400e;
                }
                
                .error-indicator {
                    color: #dc2626;
                    font-weight: bold;
                }
                
                .fallback-note {
                    font-size: 10px;
                    opacity: 0.7;
                    font-style: italic;
                    display: block;
                    margin-top: 4px;
                }
                
                .message-content p {
                    margin: 0 0 4px 0;
                    line-height: 1.4;
                }
                
                .timestamp {
                    font-size: 11px;
                    opacity: 0.7;
                }
                
                .typing-indicator {
                    display: flex;
                    gap: 4px;
                    align-items: center;
                }
                
                .typing-indicator span {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--text-color);
                    opacity: 0.4;
                    animation: typing 1.4s infinite;
                }
                
                .typing-indicator span:nth-child(2) {
                    animation-delay: 0.2s;
                }
                
                .typing-indicator span:nth-child(3) {
                    animation-delay: 0.4s;
                }
                
                @keyframes typing {
                    0%, 60%, 100% {
                        transform: translateY(0);
                        opacity: 0.4;
                    }
                    30% {
                        transform: translateY(-10px);
                        opacity: 1;
                    }
                }
                
                .chat-input-form {
                    padding: 16px 20px;
                    border-top: 1px solid var(--border-color);
                    background: var(--background);
                }
                
                .input-container {
                    display: flex;
                    gap: 12px;
                    align-items: flex-end;
                }
                
                .chat-input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 1px solid var(--border-color);
                    border-radius: 24px;
                    background: var(--background);
                    color: var(--text-color);
                    resize: none;
                    outline: none;
                    font-family: inherit;
                    font-size: 14px;
                    line-height: 1.4;
                    max-height: 120px;
                    transition: border-color 0.2s ease;
                }
                
                .chat-input:focus {
                    border-color: var(--main-color);
                }
                
                .chat-input::placeholder {
                    color: var(--text-color);
                    opacity: 0.5;
                }
                
                .send-button {
                    width: 44px;
                    height: 44px;
                    border: none;
                    border-radius: 50%;
                    background: var(--main-color);
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                }
                
                .send-button:hover:not(:disabled) {
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(0, 71, 143, 0.3);
                }
                
                .send-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }
                
                .send-button:active:not(:disabled) {
                    transform: scale(0.95);
                }
                
                /* Scrollbar styling */
                .chat-messages::-webkit-scrollbar {
                    width: 6px;
                }
                
                .chat-messages::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .chat-messages::-webkit-scrollbar-thumb {
                    background: var(--border-color);
                    border-radius: 3px;
                }
                
                .chat-messages::-webkit-scrollbar-thumb:hover {
                    background: var(--main-color);
                }
                
                /* Responsive design */
                @media (max-width: 768px) {
                    .chat-container {
                        height: 500px;
                        margin: 0 16px;
                    }
                    
                    .message {
                        max-width: 85%;
                    }
                    
                    .chat-header {
                        padding: 12px 16px;
                    }
                    
                    .chat-messages {
                        padding: 16px;
                    }
                    
                    .chat-input-form {
                        padding: 12px 16px;
                    }
                }
            `}</style>
        </>
    );
}
