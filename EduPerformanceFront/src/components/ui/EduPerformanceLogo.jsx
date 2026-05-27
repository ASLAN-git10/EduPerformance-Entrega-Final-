import React from "react";

export default function EduPerformanceLogo({ className = "", size = 80 }) {
  return (
    <div className={`edu-logo-wrapper ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="edu-logo-svg"
        aria-label="EduPerformance Logo"
      >
        <defs>
          {/* Flame Gradients */}
          {/* Cyan to Blue Flame (Left) */}
          <linearGradient id="flameLeftGrad" x1="0%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="40%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>

          {/* Orange to Red Flame (Right) */}
          <linearGradient id="flameRightGrad" x1="100%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ffd166" />
          </linearGradient>

          {/* Golden Yellow Accents */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd166" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>

          {/* Dark Book Cover */}
          <linearGradient id="bookCoverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Sleek drop shadow for the logo */}
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g className="logo-group">
          {/* 1. RISING FLAMES & PARTICLES (Background & Center) */}
          <g className="flames-group">
            {/* Left Cyan/Blue Flame Trail */}
            <path
              d="M100 135 C75 120, 60 90, 75 60 C85 40, 70 30, 85 18 C90 35, 80 50, 92 68 C100 80, 105 105, 100 135 Z"
              fill="url(#flameLeftGrad)"
              opacity="0.9"
              className="flame-left"
            />

            {/* Right Orange/Red Flame Trail */}
            <path
              d="M100 135 C125 120, 140 90, 125 60 C115 40, 130 30, 115 18 C110 35, 120 50, 108 68 C100 80, 95 105, 100 135 Z"
              fill="url(#flameRightGrad)"
              opacity="0.9"
              className="flame-right"
            />

            {/* Center Turquoise Flame with Rising Arrow */}
            <path
              d="M100 135 C88 115, 85 90, 95 70 C97 50, 90 40, 100 12 C110 40, 103 50, 105 70 C115 90, 112 115, 100 135 Z"
              fill="url(#flameLeftGrad)"
              opacity="0.95"
              className="flame-center"
            />

            {/* UPWARD ARROW (at the very peak of the center flame) */}
            <path
              d="M100 8 L108 18 L103 18 L103 26 L97 26 L97 18 L92 18 Z"
              fill="#22d3ee"
              className="arrow-peak"
              filter="drop-shadow(0px 0px 4px rgba(34,211,238,0.6))"
            />

            {/* Floating Diamond Sparkles */}
            <polygon points="68,85 71,81 74,85 71,89" fill="url(#goldGrad)" className="sparkle sp-1" />
            <polygon points="132,85 135,81 138,85 135,89" fill="url(#goldGrad)" className="sparkle sp-2" />
            <polygon points="90,48 92,44 94,48 92,52" fill="#22d3ee" className="sparkle sp-3" />
            <polygon points="110,48 112,44 114,48 112,52" fill="#ff7e47" className="sparkle sp-4" />
          </g>

          {/* 2. THE OPEN BOOK (Foreground) */}
          <g className="book-group">
            {/* Dark Book Cover Background */}
            {/* Left Cover Page */}
            <path
              d="M100 138 C100 138, 70 125, 45 132 C40 133.5, 36 138, 36 143 L36 172 C36 177, 40 178.5, 45 177 C70 170, 100 182, 100 182 Z"
              fill="url(#bookCoverGrad)"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
            {/* Right Cover Page */}
            <path
              d="M100 138 C100 138, 130 125, 155 132 C160 133.5, 164 138, 164 143 L164 172 C164 177, 160 178.5, 155 177 C130 170, 100 182, 100 182 Z"
              fill="url(#bookCoverGrad)"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />

            {/* Inner Pages (White/Light Blue 3D Stack) */}
            {/* Left Page Core */}
            <path
              d="M100 135 C100 135, 72 122, 48 128 C45 129, 42 132, 42 136 L42 165 C42 169, 45 169, 48 168 C72 162, 100 175, 100 175 Z"
              fill="#f1f5f9"
            />
            {/* Left Page Top Face (slightly darker white for depth) */}
            <path
              d="M100 133 C100 133, 73 120, 50 126 C47 127, 44 130, 44 134 L44 163 C44 167, 47 167, 50 166 C73 160, 100 173, 100 173 Z"
              fill="#ffffff"
            />

            {/* Right Page Core */}
            <path
              d="M100 135 C100 135, 128 122, 152 128 C155 129, 158 132, 158 136 L158 165 C158 169, 155 169, 152 168 C128 162, 100 175, 100 175 Z"
              fill="#e2e8f0"
            />
            {/* Right Page Top Face */}
            <path
              d="M100 133 C100 133, 127 120, 150 126 C153 127, 156 130, 156 134 L156 163 C156 167, 153 167, 150 166 C127 160, 100 173, 100 173 Z"
              fill="#f8fafc"
            />

            {/* Center Spine Shadow/Line */}
            <path d="M100 133 L100 174" stroke="rgba(15, 23, 42, 0.15)" strokeWidth="2.5" />

            {/* Book Corners and Highlights in Gold (Luxury touch) */}
            {/* Left Corners */}
            <path d="M44 134 L48 133" stroke="url(#goldGrad)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M44 163 L48 164" stroke="url(#goldGrad)" strokeWidth="1.5" strokeLinecap="round" />
            {/* Right Corners */}
            <path d="M156 134 L152 133" stroke="url(#goldGrad)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M156 163 L152 164" stroke="url(#goldGrad)" strokeWidth="1.5" strokeLinecap="round" />

            {/* Symbols on Pages (Digital & Education UI Indicators) */}
            {/* Left Page Symbol: Code brackets [] */}
            <path
              d="M62 142 L58 142 L58 152 L62 152"
              stroke="#0f172a"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
              className="page-symbol"
            />
            <path
              d="M68 142 L72 142 L72 152 L68 152"
              stroke="#0f172a"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
              className="page-symbol"
            />

            {/* Right Page Symbol: Performance Chart & Growth Check */}
            {/* Growth Graph bars */}
            <line x1="124" y1="154" x2="124" y2="148" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" opacity="0.75" className="page-symbol" />
            <line x1="130" y1="154" x2="130" y2="144" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" opacity="0.75" className="page-symbol" />
            <line x1="136" y1="154" x2="136" y2="140" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" opacity="0.75" className="page-symbol" />

            {/* Dynamic swoosh checkmark on top of the bars representing Performance */}
            <path
              d="M122 144 L128 141 L138 134"
              stroke="url(#flameRightGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="page-swoosh"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
