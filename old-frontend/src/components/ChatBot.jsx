import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  RotateCcw, 
  ShoppingBag, 
  Truck, 
  CreditCard,
  ShieldCheck, 
  HelpCircle,
  Phone,
  ArrowRight,
  Bot
} from 'lucide-react';

const ChatBot = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [generalSettings, setGeneralSettings] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch general settings for dynamic phone / email / site name
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    fetch(`${apiUrl}/api/settings/general_settings`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setGeneralSettings(data);
      })
      .catch(() => {});
  }, []);

  const siteName = generalSettings?.siteName || "Kinaboo";
  const phone = generalSettings?.phone || "+880 1700-000000";

  // Initialize greeting messages on first open
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          sender: 'bot',
          text: `👋 আসসালামু আলাইকুম! আমি **${siteName} AI Assistant**। 
${siteName}-এ আপনাকে স্বাগতম! আমাদের পণ্য, অর্ডার, ডেলিভারি বা পলিসি সংক্রান্ত যেকোনো তথ্যের জন্য আমাকে জিজ্ঞেস করতে পারেন।`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [siteName, messages.length]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Do not show chatbot inside admin dashboard
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  // Pre-configured Quick Questions & Knowledge Answers
  const knowledgeBase = [
    {
      keywords: ['introduce', 'kinaboo', 'about', 'পরিচিতি', 'সম্পর্কে', 'কিনাবু কি', 'কোম্পানি', 'দোকান'],
      reply: `✨ **${siteName} পরিচিতি ও লক্ষ্য:**
${siteName} হলো বাংলাদেশের একটি বিশ্বস্ত ও আধুনিক অনলাইন শপিং প্ল্যাটফর্ম। আমাদের উদ্দেশ্য হলো প্রিমিয়াম কোয়ালিটি পণ্য সেরা দামে ও দ্রুততম ডেলিভারির মাধ্যমে আপনার ঘরে পৌঁছে দেওয়া।

🌟 **আমাদের প্রধান বৈশিষ্ট্য:**
• ১০০% জেনুইন ও কোয়ালিটি নিশ্চিত পণ্য
• সারা বাংলাদেশে ক্যাশ অন ডেলিভারি (COD)
• ৭ দিনের সহজ রিটার্ন ও রিপ্লেসমেন্ট সুবিধা
• সার্বক্ষণিক আন্তরিক কাস্টমার সাপোর্ট

🛍️ আমাদের সম্পূর্ণ কালেকশন দেখতে পারেন: [সব প্রোডাক্ট দেখুন](/shop)`
    },
    {
      keywords: ['order', 'how to order', 'অর্ডার', 'কিভাবে কিনব', 'অর্ডার করার নিয়ম', 'কেনার নিয়ম'],
      reply: `📦 **অর্ডার করার নিয়ম খুবই সহজ:**
১. পছন্দের প্রোডাক্টের নিচে **"অর্ডার করুন"** বাটনে ক্লিক করুন।
২. আপনার নাম, মোবাইল নাম্বার এবং সম্পূর্ণ ঠিকানা লিখুন।
৩. ক্যাশ অন ডেলিভারি সিলেক্ট করে **"অর্ডার কনফার্ম করুন"**-এ ক্লিক করলেই অর্ডার সম্পন্ন হবে!

কোনো জটিল রেজিস্ট্রেশনের প্রয়োজন নেই।`
    },
    {
      keywords: ['delivery', 'charge', 'ship', 'ডেলিভারি', 'চার্জ', 'খরচ', 'কবে পাব', 'সময়'],
      reply: `🚚 **ডেলিভারি সময় ও চার্জ:**
• **ঢাকার ভিতরে:** ২৪ থেকে ৪৮ ঘণ্টার মধ্যে (চার্জ ৬০ টাকা)
• **ঢাকার বাইরে:** ২ থেকে ৩ কার্যদিবসের মধ্যে (চার্জ ১২০ টাকা)

ডেলিভারি ম্যানের সামনে প্রোডাক্ট চেক করে নেওয়ার সুযোগ রয়েছে।`
    },
    {
      keywords: ['return', 'exchange', 'refund', 'রিটার্ন', 'এক্সচেঞ্জ', 'রিফান্ড', 'বদলাব', 'পরিবর্তন'],
      reply: `🔄 **৭ দিনের সহজ রিটার্ন ও এক্সচেঞ্জ:**
প্রোডাক্ট হাতে পাওয়ার পর ৭ দিনের মধ্যে যেকোনো সাইজ, কালার বা ডিফেক্টের ক্ষেত্রে এক্সচেঞ্জ করতে পারবেন।

ভুল বা ত্রুটিযুক্ত প্রোডাক্টের ক্ষেত্রে কোনো ডেলিভারি চার্জ ছাড়াই সম্পূর্ণ ফ্রিতে রিপ্লেসমেন্ট দেওয়া হবে। বিস্তারিত: [রিটার্ন পলিসি পেজ](/pages/return-exchange)`
    },
    {
      keywords: ['payment', 'bkash', 'nagad', 'cod', 'পেমেন্ট', 'বিকাশ', 'নগদ', 'টাকা'],
      reply: `💳 **পেমেন্ট পদ্ধতি:**
• **ক্যাশ অন ডেলিভারি:** পণ্য হাতে পেয়ে চেক করে মূল্য পরিশোধ করতে পারবেন।
• **ডিজিটাল পেমেন্ট:** বিকাশ, নগদ, রকেট ও ভিসা/মাস্টারকার্ডের মাধ্যমে অগ্রিম পেমেন্ট সুবিধা।`
    },
    {
      keywords: ['contact', 'phone', 'call', 'number', 'helpline', 'যোগাযোগ', 'ফোন', 'নাম্বার', 'কথা'],
      reply: `📞 **আমাদের হেল্পলাইন ও সাপোর্ট:**
• ফোন: **${phone}**
• ইমেইল: **${generalSettings?.email || 'support@kinaboo.com'}**
• সরাসরি WhatsApp-এ কথা বলতে নিচের WhatsApp বাটনে ক্লিক করুন!`
    }
  ];

  const handleSendMessage = (userText) => {
    const text = (userText || inputMessage).trim();
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // AI intelligent answer match with typing delay
    setTimeout(() => {
      const lower = text.toLowerCase();
      let matched = knowledgeBase.find(item => 
        item.keywords.some(k => lower.includes(k.toLowerCase()))
      );

      let botReply = matched?.reply;

      if (!botReply) {
        if (lower.includes('hi') || lower.includes('hello') || lower.includes('সালাম') || lower.includes('কেমন')) {
          botReply = `হ্যালো! 😊 আমি ${siteName} AI অ্যাসিস্ট্যান্ট। আপনাকে কীভাবে সাহায্য করতে পারি? নিচের অপশনগুলো থেকে বেছে নিতে পারেন অথবা সরাসরি প্রশ্ন লিখুন।`;
        } else {
          botReply = `ধন্যবাদ আপনার বার্তার জন্য! 😊 
আপনি কি **${siteName} পরিচিতি**, **অর্ডার পদ্ধতি**, **ডেলিভারি তথ্য** বা **রিটার্ন পলিসি** সম্পর্কে জানতে চান? 

অথবা আমাদের প্রতিনিধির সাথে সরাসরি কথা বলতে কল করুন: **${phone}** অথবা নিচের অপশনগুলোতে ক্লিক করুন।`;
        }
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    { 
      label: `Introduce ${siteName}`, 
      query: `Introduce ${siteName}`,
      icon: Sparkles,
      colorClass: 'pill-coral'
    },
    { 
      label: 'অর্ডার করার নিয়ম', 
      query: 'কিভাবে অর্ডার করব?',
      icon: ShoppingBag,
      colorClass: 'pill-blue'
    },
    { 
      label: 'ডেলিভারি ও চার্জ', 
      query: 'ডেলিভারি চার্জ কত?',
      icon: Truck,
      colorClass: 'pill-amber'
    },
    { 
      label: 'রিটার্ন পলিসি', 
      query: 'রিটার্ন পলিসি কি?',
      icon: RotateCcw,
      colorClass: 'pill-purple'
    },
    { 
      label: 'পেমেন্ট পদ্ধতি', 
      query: 'পেমেন্ট পদ্ধতি কি কি?',
      icon: CreditCard,
      colorClass: 'pill-teal'
    },
  ];

  // Helper to parse markdown bold and rich elements
  const renderFormattedMessage = (rawText) => {
    if (!rawText) return null;

    const lines = rawText.split('\n');

    const parseBoldParts = (text) => {
      const parts = text.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="chat-bold-text">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    };

    return lines.map((line, lineIdx) => {
      if (!line.trim()) {
        return <div key={lineIdx} className="chat-msg-spacer" />;
      }

      // Check for inline link replacements
      if (line.includes('[সব প্রোডাক্ট দেখুন](/shop)')) {
        return (
          <div key={lineIdx} className="chat-action-link-container">
            <Link to="/shop" className="chat-action-link-btn" onClick={() => setIsOpen(false)}>
              <ShoppingBag size={15} /> <span>সব প্রোডাক্ট দেখুন</span> <ArrowRight size={14} />
            </Link>
          </div>
        );
      }
      if (line.includes('[রিটার্ন পলিসি পেজ](/pages/return-exchange)')) {
        return (
          <div key={lineIdx} className="chat-action-link-container">
            <Link to="/pages/return-exchange" className="chat-action-link-btn" onClick={() => setIsOpen(false)}>
              <ShieldCheck size={15} /> <span>রিটার্ন পলিসি বিস্তারিত</span> <ArrowRight size={14} />
            </Link>
          </div>
        );
      }

      // Bullet items
      if (line.startsWith('•') || line.startsWith('-')) {
        const cleanBullet = line.replace(/^[•\-]\s*/, '');
        return (
          <div key={lineIdx} className="chat-bullet-item">
            <span className="bullet-dot">✦</span>
            <div className="bullet-text">{parseBoldParts(cleanBullet)}</div>
          </div>
        );
      }

      // Numbered lists e.g. "১. " or "1. "
      if (/^[১-৯0-9]+\.\s*/.test(line)) {
        const match = line.match(/^([১-৯0-9]+\.)\s*(.*)/);
        if (match) {
          return (
            <div key={lineIdx} className="chat-ordered-item">
              <span className="order-number-badge">{match[1]}</span>
              <div className="order-text">{parseBoldParts(match[2])}</div>
            </div>
          );
        }
      }

      return (
        <p key={lineIdx} className="chat-paragraph">
          {parseBoldParts(line)}
        </p>
      );
    });
  };

  return (
    <>
      {/* 1. Floating Chat Trigger Button (Circular Icon directly above Scroll To Top) */}
      <div className="floating-chat-trigger-container">
        <button
          type="button"
          id="kinaboo-chat-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Kinaboo Chatbot"
          className={`floating-chat-icon-btn ${isOpen ? 'active' : ''}`}
          title={`Chat with ${siteName} Assistant`}
        >
          {isOpen ? (
            <X size={20} className="chat-btn-icon" />
          ) : (
            <>
              <span className="chat-online-dot"></span>
              <Bot size={22} className="chat-btn-icon" />
            </>
          )}
        </button>
      </div>

      {/* 2. Interactive Chat Modal Window */}
      {isOpen && (
        <>
          <div 
            className="chat-mobile-backdrop" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="chat-widget-window">
            {/* Header */}
            <div className="chat-widget-header">
              <div className="chat-mobile-drag-bar"></div>
              <div className="chat-header-main-row">
                <div className="chat-header-info">
                  <div className="chat-bot-avatar">
                    <Bot size={20} />
                    <span className="avatar-online-indicator"></span>
                  </div>
                  <div>
                    <h3 className="chat-header-title">{siteName} AI Assistant</h3>
                    <div className="chat-header-status">
                      <span className="status-dot"></span>
                      <span>Online | 24/7 AI Smart Support</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="chat-close-btn"
                  aria-label="Close Chat"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="chat-messages-container">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-message-bubble ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="msg-bot-avatar">
                      <Bot size={14} />
                    </div>
                  )}
                  <div className="msg-content-wrapper">
                    <div className="msg-text">
                      {renderFormattedMessage(msg.text)}
                    </div>
                    <span className="msg-timestamp">{msg.time}</span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="chat-message-bubble bot-msg">
                  <div className="msg-bot-avatar">
                    <Bot size={14} />
                  </div>
                  <div className="typing-indicator-box">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Prompt Chips */}
            <div className="chat-quick-prompts-bar">
              {quickPrompts.map((p, i) => {
                const IconComponent = p.icon;
                return (
                  <button
                    key={i}
                    type="button"
                    className={`quick-prompt-pill ${p.colorClass}`}
                    onClick={() => handleSendMessage(p.query)}
                  >
                    <IconComponent size={13} className="pill-icon" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
              <a
                href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${siteName}, I need some assistance!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="quick-prompt-pill pill-whatsapp"
              >
                <Phone size={13} className="pill-icon" />
                <span>WhatsApp Chat</span>
              </a>
            </div>

            {/* Input & Send Bar */}
            <div className="chat-input-container">
              <input
                type="text"
                className="chat-input-field"
                placeholder={`যেকোনো প্রশ্ন লিখুন...`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                type="button"
                className="chat-send-btn"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ChatBot;
