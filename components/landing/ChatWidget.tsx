"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Comment02Icon } from "@hugeicons/core-free-icons";

export default function ChatWidget() {
  const [showPopup, setShowPopup] = useState(false);
  const [hasPopupBeenShown, setHasPopupBeenShown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [messages, setMessages] = useState<Array<{ id: number; text: string; sender: "support" | "user"; time: string }>>([
    {
      id: 1,
      text: "Hey there!👋 Glad you stopped by. If you get stuck finding anything or need help understanding how UdhaarClear fits your workflow, we are just a message away.",
      sender: "support",
      time: "1w",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const audioPlayedRef = useRef(false);
  const playInteractionListenersActiveRef = useRef(false);
  const timerElapsedRef = useRef(false);
  const audioUnlockedRef = useRef(false);
  const popupShownRef = useRef(false);

  // Pre-load audio elements to guarantee instant playback alignment
  const chimeAudioRef = useRef<HTMLAudioElement | null>(null);

  const [popupShowTime, setPopupShowTime] = useState<number | null>(null);
  const [timeElapsedText, setTimeElapsedText] = useState("Just now");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio("/audio/notification-audio.wav");
      audio.preload = "auto";
      audio.volume = 0.5;
      chimeAudioRef.current = audio;
    }
  }, []);

  // Live timer for the message popup
  useEffect(() => {
    if (!showPopup || !popupShowTime) return;

    const interval = setInterval(() => {
      const diffMs = Date.now() - popupShowTime;
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 10) {
        setTimeElapsedText("Just now");
      } else if (diffSec < 60) {
        setTimeElapsedText(`${diffSec}s ago`);
      } else {
        const diffMin = Math.floor(diffSec / 60);
        setTimeElapsedText(`${diffMin}m ago`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [showPopup, popupShowTime]);

  const cleanupInteractionListeners = () => {
    window.removeEventListener("click", playAudioOnInteraction);
    window.removeEventListener("mousedown", playAudioOnInteraction);
    window.removeEventListener("keydown", playAudioOnInteraction);
    window.removeEventListener("touchstart", playAudioOnInteraction);
    playInteractionListenersActiveRef.current = false;
  };

  const triggerPopupAndSound = () => {
    if (popupShownRef.current) return;
    popupShownRef.current = true;
    
    setShowPopup(true);
    setHasPopupBeenShown(true);
    setPopupShowTime(Date.now());
    cleanupInteractionListeners();

    if (chimeAudioRef.current) {
      chimeAudioRef.current.play().catch((err) => {
        console.warn("Chime playback failed:", err.message);
      });
    }
  };

  const playAudioOnInteraction = (e: Event) => {
    if (popupShownRef.current) {
      cleanupInteractionListeners();
      return;
    }

    // Ignore direct clicks on the widget/trigger button/close button itself to prevent clicking sound
    const isElement = e.target instanceof Element;
    const isWidgetClick = isElement && (e.target as Element).closest('[data-chat-widget]');
    if (isWidgetClick) {
      popupShownRef.current = true;
      cleanupInteractionListeners();
      return;
    }

    audioUnlockedRef.current = true;

    // If 1.5s timer has already fired, trigger popup and sound together now!
    if (timerElapsedRef.current) {
      triggerPopupAndSound();
    } else {
      // Pre-unlock the audio context silently so that when the 1.5s timer fires, it works instantly
      if (chimeAudioRef.current) {
        const originalVolume = chimeAudioRef.current.volume;
        chimeAudioRef.current.volume = 0;
        chimeAudioRef.current.play()
          .then(() => {
            if (chimeAudioRef.current) {
              chimeAudioRef.current.volume = originalVolume;
            }
            cleanupInteractionListeners(); // successfully pre-unlocked
          })
          .catch(() => {});
      }
    }
  };

  // Play notification chime and show popup after 1.5 seconds
  useEffect(() => {
    // Listen for early interactions to pre-unlock audio
    window.addEventListener("click", playAudioOnInteraction, { passive: true });
    window.addEventListener("mousedown", playAudioOnInteraction, { passive: true });
    window.addEventListener("keydown", playAudioOnInteraction, { passive: true });
    window.addEventListener("touchstart", playAudioOnInteraction, { passive: true });
    playInteractionListenersActiveRef.current = true;

    const timer = setTimeout(() => {
      timerElapsedRef.current = true;
      
      // If user has already interacted, trigger immediately!
      if (audioUnlockedRef.current) {
        triggerPopupAndSound();
      } else {
        // Try playing immediately in case autoplay is permitted
        if (chimeAudioRef.current) {
          chimeAudioRef.current.play()
            .then(() => {
              // Autoplay permitted. Trigger popup and sound in sync
              setShowPopup(true);
              setHasPopupBeenShown(true);
              setPopupShowTime(Date.now());
              popupShownRef.current = true;
              cleanupInteractionListeners();
            })
            .catch(() => {
              // Autoplay blocked. Do not show popup yet. It will trigger in sync
              // on the first page interaction (handled by playAudioOnInteraction).
            });
        }
      }
    }, 1500);

    return () => {
      clearTimeout(timer);
      cleanupInteractionListeners();
    };
  }, []);

  // Scroll messages container to the bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = {
      id: Date.now(),
      text: inputValue,
      sender: "user" as const,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    // Simulate agent reply
    setTimeout(() => {
      const supportReply = {
        id: Date.now() + 1,
        text: "Thank you for reaching out! Since this is a demo environment, a member of our team will contact you shortly at your registered email.",
        sender: "support" as const,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, supportReply]);
      
      // Play a subtle sound on receive if widget is open
      const audio = new Audio("/audio/notification-audio.wav");
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }, 1200);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowPopup(false);
    setUnreadCount(0);
    popupShownRef.current = true;
    cleanupInteractionListeners();
  };

  const dismissPopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPopup(false);
    setUnreadCount(0);
    popupShownRef.current = true;
    cleanupInteractionListeners();
  };

  return (
    <div data-chat-widget="true" className="fixed bottom-5 right-5 z-50 flex flex-col items-end font-sans">
      {/* 1. Chat Dialog Window (Replicating Screenshot Layout Exactly) */}
      {isOpen && (
        <div className="mb-4 w-[360px] max-w-[calc(100vw-32px)] h-[530px] bg-white rounded-[28px] border border-black/[0.06] shadow-[0_16px_48px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="bg-white px-5 py-4.5 flex items-center justify-between border-b border-gray-100 shrink-0 select-none">
            <div className="flex items-center gap-3">
              {/* Back chevron */}
             
              
              {/* Overlapping avatars */}
              <div className="flex -space-x-3 shrink-0 select-none">
                <div className="relative w-8.5 h-8.5 rounded-full overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                  <Image
                    src="/images/support-avatar-2.png"
                    alt="Support team member 1"
                    fill
                    sizes="34px"
                    className="object-cover"
                  />
                </div>
              
              </div>

              {/* Brand Name & response status */}
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900 text-[14.5px] leading-none tracking-tight">Support & Success Team</span>
                <div className="flex items-center gap-1 mt-0.5 text-[11px] text-gray-500 font-medium">
                  <span>The team can also help</span>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
          
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-white select-none">
            {/* Ask us anything prompt centered at top */}
            <div className="text-center text-gray-400 text-[12px] font-normal my-1">
              Ask us anything, or share your feedback.
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col gap-1 max-w-[85%] ${
                  msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                }`}
              >
                <div
                  className={`px-4.5 py-3.5 rounded-[22px] text-[13.5px] leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-neutral-900 text-white rounded-tr-none"
                      : "bg-[#F3F4F6] text-gray-900 rounded-tl-none font-normal"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[11px] text-gray-400 mt-1 px-1">
                  {msg.sender === "user" ? "You" : "Product Expert"} &bull; {msg.id === 1 ? "1w" : msg.time}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form Box floating card */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white shrink-0 select-none">
            <div className="border border-gray-200 rounded-[24px] p-3 flex flex-col gap-2.5 bg-white shadow-sm focus-within:border-gray-300 focus-within:shadow transition-all">
              {/* Text Input */}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Message..."
                className="w-full px-2 py-1 text-[13.5px] bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
              />
              
              {/* Action Bar */}
              <div className="flex items-center justify-between pt-1">
                {/* Left Icons */}
                <div className="flex items-center gap-1.5 text-gray-400">
                  <button type="button" className="p-1.5 rounded-full hover:bg-gray-100 hover:text-gray-600 transition-colors" aria-label="Attach file">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l5.656-5.656A5.002 5.002 0 0118.364 16.34l-8.485 8.485a7.002 7.002 0 01-9.9-9.9l8.485-8.485a9.001 9.001 0 0112.728 12.728l-8.485 8.485m0-11.314l-3.536 3.536" />
                    </svg>
                  </button>
                  <button type="button" className="p-1.5 rounded-full hover:bg-gray-100 hover:text-gray-600 transition-colors" aria-label="Emoji picker">
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M12 18.75V16.5m-3-9h.008v.008H9V7.5zm6 0h.008v.008H15V7.5z" />
                    </svg>
                  </button>
                  <button type="button" className="p-1.5 rounded-full hover:bg-gray-100 hover:text-gray-600 transition-colors" aria-label="GIF picker">
                    <span className="text-[10px] font-bold tracking-tight border-2 border-gray-400 px-0.5 py-px rounded shrink-0">GIF</span>
                  </button>
                  <button type="button" className="p-1.5 rounded-full hover:bg-gray-100 hover:text-gray-600 transition-colors" aria-label="Voice input">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className={`w-7.5 h-7.5 rounded-full flex items-center justify-center transition-all ${
                    inputValue.trim()
                      ? "bg-neutral-900 hover:bg-neutral-800 text-white cursor-pointer active:scale-95"
                      : "bg-gray-100 text-gray-300 cursor-not-allowed"
                  }`}
                  aria-label="Send message"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* 2. Automated Bubble Message Popup */}
      {showPopup && !isOpen && (
        <div
          onClick={toggleChat}
          className="group relative mb-3 mr-1 bg-white hover:bg-neutral-50 border border-black/[0.06] hover:border-black/[0.12] rounded-3xl py-3 pl-3.5 pr-11 shadow-[0_12px_36px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] cursor-pointer select-none transition-all duration-300 flex items-center gap-2 max-w-[340px] animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out"
        >
          {/* Support Avatar */}
          <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-black/[0.04] shadow-sm">
            <Image
              src="/images/profile.jpeg"
              alt="Neha"
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>

          {/* Text Content */}
          <div className="flex flex-col min-w-0 pr-1">
            <span className="text-[13px] font-medium text-gray-900 leading-tight truncate">
              Quick question? We're right here.
            </span>
            <span className="text-[11px] text-gray-400 font-normal mt-0.5">
              Product Expert • {timeElapsedText}
            </span>
          </div>

          {/* Dismiss button */}
          <button
            onClick={dismissPopup}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* 3. Floating Trigger Button */}
      <button
        onClick={toggleChat}
        className="relative w-11 h-11 rounded-full bg-neutral-950 hover:bg-neutral-800 active:scale-90 shadow-[0_6px_20px_rgba(0,0,0,0.12)] flex items-center justify-center group transition-all duration-200"
        aria-label="Toggle chat helper"
      >
        {isOpen ? (
          <svg className="w-5 h-5 text-white transition-all duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M18.601 8.39897C18.269 8.06702 17.7309 8.06702 17.3989 8.39897L12 13.7979L6.60099 8.39897C6.26904 8.06702 5.73086 8.06702 5.39891 8.39897C5.06696 8.73091 5.06696 9.2691 5.39891 9.60105L11.3989 15.601C11.7309 15.933 12.269 15.933 12.601 15.601L18.601 9.60105C18.9329 9.2691 18.9329 8.73091 18.601 8.39897Z" fill="currentColor" />
          </svg>
        ) : (
          <HugeiconsIcon
            icon={Comment02Icon}
            className="text-white group-hover:scale-110 transition-transform duration-300"
            size={20}
          />
        )}

        {/* Unread red dot badge without animation and numbers */}
        {unreadCount > 0 && !isOpen && (
          <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm ring-2 ring-neutral-950" />
        )}
      </button>
    </div>
  );
}
