import fs from 'fs';
import path from 'path';

const dir = './public/images';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const svgs = [
  // Q1: quadrilateral ABCD with angle A=95°
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="800" height="400" fill="url(#bg1)" rx="20"/>
  <polygon points="200,120 600,100 550,320 150,300" fill="rgba(100,180,255,0.15)" stroke="#64b5ff" stroke-width="3"/>
  <circle cx="200" cy="120" r="5" fill="#ff6b6b"/><text x="185" y="108" fill="#ff6b6b" font-size="26" font-family="Arial" font-weight="bold">أ</text>
  <circle cx="600" cy="100" r="5" fill="#ff6b6b"/><text x="610" y="88" fill="#ff6b6b" font-size="26" font-family="Arial" font-weight="bold">ب</text>
  <circle cx="550" cy="320" r="5" fill="#ff6b6b"/><text x="560" y="345" fill="#ff6b6b" font-size="26" font-family="Arial" font-weight="bold">ج</text>
  <circle cx="150" cy="300" r="5" fill="#ff6b6b"/><text x="125" y="325" fill="#ff6b6b" font-size="26" font-family="Arial" font-weight="bold">د</text>
  <path d="M 200,120 L 230,118" stroke="#ffd700" stroke-width="2" fill="none"/>
  <path d="M 200,120 L 198,150" stroke="#ffd700" stroke-width="2" fill="none"/>
  <path d="M 205,120 A 15 15 0 0 0 200 135" stroke="#ffd700" stroke-width="2" fill="none"/>
  <text x="220" y="140" fill="#ffd700" font-size="22" font-weight="bold" filter="url(#glow)">95°</text>
  <text x="520" y="310" fill="#ff6b6b" font-size="32" font-weight="bold">?</text>
</svg>`,

  // Q2: Two inscribed angles sharing same arc
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
    <filter id="glow2"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="800" height="400" fill="url(#bg2)" rx="20"/>
  <text x="400" y="50" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">زاويتان تشتركان في نفس القوس</text>
  <circle cx="400" cy="210" r="140" fill="rgba(100,180,255,0.08)" stroke="#64b5ff" stroke-width="3"/>
  <circle cx="400" cy="70" r="6" fill="#ff6b6b"/><text x="410" y="58" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">أ</text>
  <circle cx="520" cy="180" r="6" fill="#ffd700"/><text x="535" y="188" fill="#ffd700" font-size="24" font-family="Arial" font-weight="bold">ب</text>
  <circle cx="300" cy="310" r="6" fill="#69db7c"/><text x="280" y="340" fill="#69db7c" font-size="24" font-family="Arial" font-weight="bold">ج</text>
  <circle cx="480" cy="310" r="6" fill="#da77f2"/><text x="490" y="340" fill="#da77f2" font-size="24" font-family="Arial" font-weight="bold">د</text>
  <path d="M 520,180 A 140 140 0 0 1 300,310" stroke="#ffd700" stroke-width="3" fill="none" stroke-dasharray="8,4" opacity="0.7"/>
  <line x1="400" y1="70" x2="520" y2="180" stroke="#69db7c" stroke-width="2" stroke-dasharray="5,3"/>
  <line x1="400" y1="70" x2="300" y2="310" stroke="#69db7c" stroke-width="2" stroke-dasharray="5,3"/>
  <line x1="480" y1="310" x2="520" y2="180" stroke="#da77f2" stroke-width="2" stroke-dasharray="5,3"/>
  <line x1="480" y1="310" x2="300" y2="310" stroke="#da77f2" stroke-width="2" stroke-dasharray="5,3"/>
  <path d="M 420,85 A 20 20 0 0 1 430,95" stroke="#69db7c" stroke-width="2" fill="none"/>
  <path d="M 500,298 A 20 20 0 0 0 475,305" stroke="#da77f2" stroke-width="2" fill="none"/>
  <text x="435" y="100" fill="#69db7c" font-size="18" font-weight="bold">θ</text>
  <text x="495" y="315" fill="#da77f2" font-size="18" font-weight="bold">θ</text>
  <text x="585" y="210" fill="#ffd700" font-size="22" font-weight="bold" filter="url(#glow2)">?</text>
</svg>`,

  // Q3: Circle center origin diameter 8
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bg3)" rx="20"/>
  <line x1="400" y1="40" x2="400" y2="370" stroke="#334" stroke-width="1"/>
  <line x1="50" y1="200" x2="750" y2="200" stroke="#334" stroke-width="1"/>
  <circle cx="400" cy="200" r="130" fill="rgba(100,180,255,0.1)" stroke="#64b5ff" stroke-width="3"/>
  <line x1="400" y1="200" x2="530" y2="200" stroke="#ff6b6b" stroke-width="2"/>
  <line x1="400" y1="200" x2="400" y2="70" stroke="#69db7c" stroke-width="2"/>
  <text x="535" y="195" fill="#ff6b6b" font-size="18" font-weight="bold">نق</text>
  <text x="405" y="80" fill="#69db7c" font-size="16" font-weight="bold">نق</text>
  <line x1="270" y1="200" x2="530" y2="200" stroke="#ffd700" stroke-width="2" stroke-dasharray="6,4"/>
  <text x="350" y="190" fill="#ffd700" font-size="16">القطر = 8 سم</text>
  <text x="400" y="380" text-anchor="middle" fill="#8899cc" font-size="14">المركز = نقطة الأصل</text>
  <text x="400" y="60" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">معادلة الدائرة = ؟</text>
</svg>`,

  // Q4: Thales theorem - inscribed angle with diameter
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
    <filter id="glow4"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="800" height="400" fill="url(#bg4)" rx="20"/>
  <text x="400" y="50" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">زاوية محيطية تشارك وتر</text>
  <path d="M 160,280 A 240 240 0 0 1 640,280" fill="rgba(100,180,255,0.08)" stroke="#64b5ff" stroke-width="3"/>
  <line x1="160" y1="280" x2="640" y2="280" stroke="#ff6b6b" stroke-width="3"/>
  <line x1="160" y1="280" x2="420" y2="100" stroke="#69db7c" stroke-width="2"/>
  <line x1="640" y1="280" x2="420" y2="100" stroke="#69db7c" stroke-width="2"/>
  <circle cx="160" cy="280" r="6" fill="#ff6b6b"/><text x="135" y="308" fill="#ff6b6b" font-size="26" font-family="Arial" font-weight="bold">أ</text>
  <circle cx="640" cy="280" r="6" fill="#ff6b6b"/><text x="650" y="308" fill="#ff6b6b" font-size="26" font-family="Arial" font-weight="bold">ب</text>
  <circle cx="420" cy="100" r="6" fill="#ffd700"/><text x="430" y="88" fill="#ffd700" font-size="26" font-family="Arial" font-weight="bold">ج</text>
  <path d="M 420,100 L 420,130 L 450,130" stroke="#ffd700" stroke-width="2" fill="none"/>
  <text x="455" y="138" fill="#ffd700" font-size="22" font-weight="bold" filter="url(#glow4)">?</text>
</svg>`,

  // Q5: 4x² - 4y² = 36 (NOT a circle)
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg5" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bg5)" rx="20"/>
  <text x="400" y="50" text-anchor="middle" fill="#e0e0ff" font-size="26" font-family="Arial" font-weight="bold">4س² - 4ص² = 36</text>
  <line x1="100" y1="200" x2="700" y2="200" stroke="#334" stroke-width="1"/>
  <line x1="400" y1="50" x2="400" y2="350" stroke="#334" stroke-width="1"/>
  <path d="M 400,200 C 420,130 480,70 530,50" stroke="#ff6b6b" stroke-width="3" fill="none"/>
  <path d="M 400,200 C 380,270 320,330 270,350" stroke="#ff6b6b" stroke-width="3" fill="none"/>
  <path d="M 400,200 C 420,270 480,330 530,350" stroke="#ff6b6b" stroke-width="3" fill="none"/>
  <path d="M 400,200 C 380,130 320,70 270,50" stroke="#ff6b6b" stroke-width="3" fill="none"/>
  <text x="400" y="160" text-anchor="middle" fill="#8899cc" font-size="20">هل هذه معادلة دائرة؟</text>
  <text x="400" y="380" text-anchor="middle" fill="#8899cc" font-size="16">ما قيمة نق؟</text>
</svg>`,

  // Q6: Tangent-chord angle theorem
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg6" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bg6)" rx="20"/>
  <text x="400" y="50" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">مماس للدائرة</text>
  <circle cx="380" cy="230" r="140" fill="rgba(100,180,255,0.08)" stroke="#64b5ff" stroke-width="3"/>
  <line x1="120" y1="120" x2="620" y2="370" stroke="#ff6b6b" stroke-width="3"/>
  <text x="610" y="385" fill="#ff6b6b" font-size="22" font-family="Arial" font-weight="bold">المماس أب</text>
  <circle cx="300" cy="180" r="7" fill="#ffd700"/>
  <text x="265" y="170" fill="#ffd700" font-size="26" font-family="Arial" font-weight="bold">س</text>
  <line x1="300" y1="180" x2="450" y2="110" stroke="#69db7c" stroke-width="2"/>
  <circle cx="450" cy="110" r="6" fill="#69db7c"/>
  <text x="458" y="98" fill="#69db7c" font-size="26" font-family="Arial" font-weight="bold">ع</text>
  <circle cx="230" cy="290" r="6" fill="#da77f2"/>
  <text x="215" y="315" fill="#da77f2" font-size="26" font-family="Arial" font-weight="bold">ص</text>
  <line x1="230" y1="290" x2="300" y2="180" stroke="#da77f2" stroke-width="2" stroke-dasharray="5,3"/>
  <line x1="230" y1="290" x2="450" y2="110" stroke="#da77f2" stroke-width="2" stroke-dasharray="5,3"/>
  <path d="M 300,180 L 320,170" stroke="#ffd700" stroke-width="2" fill="none"/>
  <path d="M 300,180 L 310,190" stroke="#ffd700" stroke-width="2" fill="none"/>
  <path d="M 305,178 A 10 10 0 0 1 306 186" stroke="#ffd700" stroke-width="2" fill="none"/>
  <text x="325" y="178" fill="#ffd700" font-size="18" font-weight="bold">40°</text>
  <path d="M 235,275 A 20 20 0 0 1 245,275" stroke="#da77f2" stroke-width="2" fill="none"/>
  <text x="240" y="280" fill="#da77f2" font-size="16" font-weight="bold">?</text>
</svg>`,

  // Q7: Isosceles trapezoid always cyclic
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg7" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bg7)" rx="20"/>
  <text x="400" y="50" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">أي شكل يمكن أن يكون رباعياً دائرياً؟</text>
  <circle cx="400" cy="210" r="155" fill="rgba(100,180,255,0.06)" stroke="#64b5ff" stroke-width="2" stroke-dasharray="8,4"/>
  <polygon points="250,300 550,300 480,120 320,120" fill="rgba(100,180,255,0.12)" stroke="#ffd700" stroke-width="3"/>
  <line x1="285" y1="300" x2="275" y2="290" stroke="#69db7c" stroke-width="2"/>
  <line x1="275" y1="290" x2="285" y2="280" stroke="#69db7c" stroke-width="2"/>
  <line x1="515" y1="300" x2="525" y2="290" stroke="#69db7c" stroke-width="2"/>
  <line x1="525" y1="290" x2="515" y2="280" stroke="#69db7c" stroke-width="2"/>
  <text x="260" y="265" fill="#69db7c" font-size="16" transform="rotate(-20,260,265)">متساويان</text>
  <text x="530" y="265" fill="#69db7c" font-size="16" transform="rotate(20,530,265)">متساويان</text>
  <text x="260" y="295" fill="#ffd700" font-size="18">α</text>
  <text x="530" y="295" fill="#ffd700" font-size="18">α</text>
  <text x="310" y="130" fill="#ff6b6b" font-size="18">β</text>
  <text x="480" y="130" fill="#ff6b6b" font-size="18">β</text>
</svg>`,

  // Q8: Circle equation concept illustration
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg8" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
    <filter id="glow8"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="800" height="400" fill="url(#bg8)" rx="20"/>
  <text x="400" y="50" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">معادلة الدائرة</text>
  <line x1="400" y1="60" x2="400" y2="370" stroke="#334" stroke-width="1"/>
  <line x1="50" y1="210" x2="750" y2="210" stroke="#334" stroke-width="1"/>
  <circle cx="400" cy="210" r="120" fill="rgba(100,180,255,0.1)" stroke="#64b5ff" stroke-width="3"/>
  <line x1="400" y1="210" x2="520" y2="210" stroke="#ffd700" stroke-width="2.5"/>
  <circle cx="400" cy="210" r="4" fill="#fff"/>
  <text x="520" y="205" fill="#ffd700" font-size="20" font-weight="bold">نق</text>
  <text x="390" y="230" fill="#fff" font-size="14">(0,0)</text>
  <text x="400" y="360" text-anchor="middle" fill="#64b5ff" font-size="28" font-family="Arial" font-weight="bold" filter="url(#glow8)">س² + ص² = نق²</text>
  <text x="400" y="390" text-anchor="middle" fill="#8899cc" font-size="15">قارن المعادلات بالصيغة القياسية</text>
</svg>`,

  // Q9: Cyclic quadrilateral exterior angle 75°
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg9" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
    <filter id="glow9"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="800" height="400" fill="url(#bg9)" rx="20"/>
  <text x="400" y="50" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">زاوية خارجة 75°</text>
  <circle cx="400" cy="220" r="160" fill="rgba(100,180,255,0.07)" stroke="#64b5ff" stroke-width="2.5"/>
  <polygon points="300,80 560,140 500,330 200,300" fill="rgba(100,180,255,0.1)" stroke="#ffd700" stroke-width="3"/>
  <circle cx="300" cy="80" r="6" fill="#ff6b6b"/><text x="280" y="65" fill="#ff6b6b" font-size="26" font-family="Arial" font-weight="bold">أ</text>
  <circle cx="560" cy="140" r="6" fill="#ff6b6b"/><text x="575" y="128" fill="#ff6b6b" font-size="26" font-family="Arial" font-weight="bold">ب</text>
  <circle cx="500" cy="330" r="6" fill="#ff6b6b"/><text x="510" y="358" fill="#ff6b6b" font-size="26" font-family="Arial" font-weight="bold">ج</text>
  <circle cx="200" cy="300" r="6" fill="#ff6b6b"/><text x="170" y="323" fill="#ff6b6b" font-size="26" font-family="Arial" font-weight="bold">د</text>
  <line x1="200" y1="300" x2="80" y2="340" stroke="#ff6b6b" stroke-width="2.5"/>
  <text x="60" y="355" fill="#ff6b6b" font-size="26" font-family="Arial" font-weight="bold">س</text>
  <path d="M 190,305 A 20 20 0 0 1 170,315" stroke="#ffd700" stroke-width="2" fill="none"/>
  <text x="165" y="310" fill="#ffd700" font-size="18" font-weight="bold">75°</text>
  <text x="558" y="145" fill="#69db7c" font-size="24" font-weight="bold" filter="url(#glow9)">?</text>
</svg>`,

  // Q10: Right triangle in semicircle (Thales)
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg10" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bg10)" rx="20"/>
  <text x="400" y="50" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">مثلث داخل دائرة</text>
  <path d="M 140,280 A 260 260 0 0 1 660,280" fill="rgba(100,180,255,0.08)" stroke="#64b5ff" stroke-width="3"/>
  <line x1="140" y1="280" x2="660" y2="280" stroke="#ff6b6b" stroke-width="3"/>
  <line x1="140" y1="280" x2="420" y2="70" stroke="#69db7c" stroke-width="3"/>
  <line x1="660" y1="280" x2="420" y2="70" stroke="#69db7c" stroke-width="3"/>
  <text x="240" y="200" fill="#ffd700" font-size="20" font-weight="bold" transform="rotate(-55,240,200)">6 سم</text>
  <text x="560" y="200" fill="#ffd700" font-size="20" font-weight="bold" transform="rotate(55,560,200)">8 سم</text>
  <path d="M 420,70 L 420,105 L 455,105" stroke="#ffd700" stroke-width="2.5" fill="none"/>
  <circle cx="140" cy="280" r="7" fill="#ff6b6b"/><text x="112" y="308" fill="#ff6b6b" font-size="28" font-family="Arial" font-weight="bold">أ</text>
  <circle cx="660" cy="280" r="7" fill="#ff6b6b"/><text x="670" y="308" fill="#ff6b6b" font-size="28" font-family="Arial" font-weight="bold">ب</text>
  <circle cx="420" cy="70" r="7" fill="#ff6b6b"/><text x="430" y="55" fill="#ff6b6b" font-size="28" font-family="Arial" font-weight="bold">ج</text>
  <text x="360" y="275" fill="#ff6b6b" font-size="18" font-weight="bold">أب قطر</text>
  <text x="400" y="380" text-anchor="middle" fill="#8899cc" font-size="16">المركز = نقطة الأصل. ما معادلة الدائرة؟</text>
</svg>`,

  // Q11: Circle center (2,-3) radius 5
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg11" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
    <filter id="glow11"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="800" height="400" fill="url(#bg11)" rx="20"/>
  <text x="400" y="45" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">دائرة مركزها (2،-3) ونصف قطرها 5</text>
  <line x1="50" y1="250" x2="750" y2="250" stroke="#334" stroke-width="1"/>
  <line x1="350" y1="30" x2="350" y2="370" stroke="#334" stroke-width="1"/>
  <circle cx="470" cy="170" r="120" fill="rgba(100,180,255,0.1)" stroke="#64b5ff" stroke-width="3"/>
  <circle cx="470" cy="170" r="5" fill="#ffd700"/>
  <text x="475" y="163" fill="#ffd700" font-size="20" font-weight="bold" filter="url(#glow11)">(2،-3)</text>
  <line x1="470" y1="170" x2="560" y2="230" stroke="#ff6b6b" stroke-width="2" stroke-dasharray="5,3"/>
  <text x="560" y="240" fill="#ff6b6b" font-size="18" font-weight="bold">نق=5</text>
  <text x="400" y="385" text-anchor="middle" fill="#8899cc" font-size="15">(س-د)²+(ص-هـ)²=نق²</text>
</svg>`,

  // Q12: Center from equation x²+y²-6x+8y=0
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg12" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bg12)" rx="20"/>
  <text x="400" y="45" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">س²+ص²-6س+8ص=0</text>
  <line x1="50" y1="200" x2="750" y2="200" stroke="#334" stroke-width="1"/>
  <line x1="400" y1="50" x2="400" y2="350" stroke="#334" stroke-width="1"/>
  <circle cx="460" cy="120" r="100" fill="rgba(100,180,255,0.1)" stroke="#64b5ff" stroke-width="3"/>
  <circle cx="460" cy="120" r="5" fill="#ffd700"/>
  <text x="465" y="112" fill="#ffd700" font-size="20" font-weight="bold">المركز = ؟</text>
  <text x="400" y="385" text-anchor="middle" fill="#8899cc" font-size="15">أوجد إحداثيات المركز</text>
</svg>`,

  // Q13: Inscribed 70° and reflex central angle
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg13" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
    <filter id="glow13"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="800" height="400" fill="url(#bg13)" rx="20"/>
  <text x="400" y="45" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">زاوية محيطية 70°</text>
  <circle cx="400" cy="210" r="150" fill="rgba(100,180,255,0.08)" stroke="#64b5ff" stroke-width="3"/>
  <circle cx="400" cy="210" r="5" fill="#fff"/>
  <text x="405" y="203" fill="#fff" font-size="18" font-weight="bold">م</text>
  <circle cx="300" cy="75" r="6" fill="#ff6b6b"/><text x="280" y="63" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">أ</text>
  <circle cx="560" cy="260" r="6" fill="#ff6b6b"/><text x="575" y="270" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">ب</text>
  <circle cx="290" cy="330" r="6" fill="#ff6b6b"/><text x="270" y="355" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">ج</text>
  <line x1="300" y1="75" x2="290" y2="330" stroke="#69db7c" stroke-width="2"/>
  <line x1="300" y1="75" x2="560" y2="260" stroke="#69db7c" stroke-width="2"/>
  <line x1="400" y1="210" x2="300" y2="75" stroke="#ffd700" stroke-width="1.5" stroke-dasharray="5,3"/>
  <line x1="400" y1="210" x2="560" y2="260" stroke="#ffd700" stroke-width="1.5" stroke-dasharray="5,3"/>
  <path d="M 315,85 A 20 20 0 0 1 325,95" stroke="#69db7c" stroke-width="2" fill="none"/>
  <text x="330" y="95" fill="#69db7c" font-size="18" font-weight="bold">70°</text>
  <path d="M 390,195 A 15 15 0 0 1 400,195" stroke="#ffd700" stroke-width="2" fill="none"/>
  <text x="405" y="230" fill="#ffd700" font-size="16">المنعكسة=؟</text>
  <text x="400" y="385" text-anchor="middle" fill="#8899cc" font-size="15">الزاوية المركزية المنعكسة = ؟</text>
</svg>`,

  // Q14: Cyclic quadrilateral ratio 2:3
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg14" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bg14)" rx="20"/>
  <text x="400" y="45" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">نسبة زاويتين متقابلتين 2:3</text>
  <circle cx="400" cy="210" r="155" fill="rgba(100,180,255,0.07)" stroke="#64b5ff" stroke-width="2.5"/>
  <polygon points="300,70 560,130 490,330 210,290" fill="rgba(100,180,255,0.1)" stroke="#ffd700" stroke-width="3"/>
  <circle cx="300" cy="70" r="6" fill="#ff6b6b"/><text x="280" y="58" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">أ</text>
  <circle cx="560" cy="130" r="6" fill="#ff6b6b"/><text x="575" y="120" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">ب</text>
  <circle cx="490" cy="330" r="6" fill="#ff6b6b"/><text x="500" y="355" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">ج</text>
  <circle cx="210" cy="290" r="6" fill="#ff6b6b"/><text x="185" y="312" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">د</text>
  <text x="320" y="110" fill="#ff6b6b" font-size="20" font-weight="bold">2س</text>
  <text x="490" y="310" fill="#ff6b6b" font-size="20" font-weight="bold">3س</text>
  <text x="400" y="385" text-anchor="middle" fill="#8899cc" font-size="15">مجموعهما = 180°</text>
</svg>`,

  // Q15: Tangent-chord angle 55°
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg15" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
    <filter id="glow15"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="800" height="400" fill="url(#bg15)" rx="20"/>
  <text x="400" y="45" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">مماس وزاوية مماسية 55°</text>
  <circle cx="380" cy="230" r="140" fill="rgba(100,180,255,0.08)" stroke="#64b5ff" stroke-width="3"/>
  <line x1="70" y1="130" x2="660" y2="380" stroke="#ff6b6b" stroke-width="3"/>
  <text x="650" y="390" fill="#ff6b6b" font-size="22" font-family="Arial" font-weight="bold">مماس س ص</text>
  <circle cx="280" cy="180" r="7" fill="#ffd700"/>
  <text x="255" y="168" fill="#ffd700" font-size="26" font-family="Arial" font-weight="bold">أ</text>
  <line x1="280" y1="180" x2="480" y2="120" stroke="#69db7c" stroke-width="2.5"/>
  <circle cx="480" cy="120" r="6" fill="#69db7c"/>
  <text x="490" y="108" fill="#69db7c" font-size="26" font-family="Arial" font-weight="bold">ب</text>
  <path d="M 280,180 L 300,170" stroke="#ffd700" stroke-width="2" fill="none"/>
  <path d="M 280,180 L 290,190" stroke="#ffd700" stroke-width="2" fill="none"/>
  <path d="M 285,178 A 10 10 0 0 1 286 186" stroke="#ffd700" stroke-width="2" fill="none"/>
  <text x="305" y="178" fill="#ffd700" font-size="18" font-weight="bold">55°</text>
  <line x1="380" y1="230" x2="480" y2="120" stroke="#ffd700" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="395" y="145" fill="#ffd700" font-size="16" font-weight="bold" filter="url(#glow15)">المركزية=؟</text>
  <circle cx="380" cy="230" r="4" fill="#fff"/>
  <text x="385" y="238" fill="#fff" font-size="14">م</text>
</svg>`,

  // Q16: AB diameter, angle CAB=40°
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg16" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bg16)" rx="20"/>
  <text x="400" y="45" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">أب قطر، ج أ ب = 40°</text>
  <path d="M 140,280 A 260 260 0 0 1 660,280" fill="rgba(100,180,255,0.08)" stroke="#64b5ff" stroke-width="3"/>
  <line x1="140" y1="280" x2="660" y2="280" stroke="#ff6b6b" stroke-width="3"/>
  <line x1="140" y1="280" x2="400" y2="60" stroke="#69db7c" stroke-width="2.5"/>
  <line x1="660" y1="280" x2="400" y2="60" stroke="#69db7c" stroke-width="2.5"/>
  <circle cx="140" cy="280" r="7" fill="#ff6b6b"/><text x="115" y="305" fill="#ff6b6b" font-size="26" font-family="Arial" font-weight="bold">أ</text>
  <circle cx="660" cy="280" r="7" fill="#ff6b6b"/><text x="670" y="305" fill="#ff6b6b" font-size="26" font-family="Arial" font-weight="bold">ب</text>
  <circle cx="400" cy="60" r="7" fill="#ff6b6b"/><text x="408" y="45" fill="#ff6b6b" font-size="26" font-family="Arial" font-weight="bold">ج</text>
  <path d="M 400,60 L 400,95 L 435,95" stroke="#ffd700" stroke-width="2" fill="none"/>
  <path d="M 155,270 A 20 20 0 0 1 165,270" stroke="#ffd700" stroke-width="2" fill="none"/>
  <text x="170" y="268" fill="#ffd700" font-size="18" font-weight="bold">40°</text>
  <text x="575" y="180" fill="#69db7c" font-size="18" font-weight="bold">?</text>
  <text x="400" y="385" text-anchor="middle" fill="#8899cc" font-size="15">أ ب ج = ؟</text>
</svg>`,

  // Q17: Point (6,8) relative to circle x²+y²=100
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg17" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bg17)" rx="20"/>
  <text x="400" y="45" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">النقطة (6،8) والدائرة س²+ص²=100</text>
  <line x1="50" y1="200" x2="750" y2="200" stroke="#334" stroke-width="1"/>
  <line x1="400" y1="30" x2="400" y2="370" stroke="#334" stroke-width="1"/>
  <circle cx="400" cy="200" r="100" fill="rgba(100,180,255,0.1)" stroke="#64b5ff" stroke-width="3"/>
  <circle cx="400" cy="200" r="4" fill="#fff"/>
  <text x="405" y="195" fill="#fff" font-size="16">(0,0)</text>
  <circle cx="460" cy="120" r="7" fill="#ffd700"/>
  <text x="468" y="115" fill="#ffd700" font-size="18" font-weight="bold">(6,8)</text>
  <line x1="400" y1="200" x2="460" y2="120" stroke="#ff6b6b" stroke-width="1.5" stroke-dasharray="5,3"/>
  <text x="420" y="155" fill="#ff6b6b" font-size="15">نق=10</text>
  <text x="400" y="385" text-anchor="middle" fill="#8899cc" font-size="15">أوجد موقع النقطة</text>
</svg>`,

  // Q18: Condition for (x-1)²+(y+2)²=k-3
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg18" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bg18)" rx="20"/>
  <text x="400" y="50" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">(س-1)²+(ص+2)²=ك-3</text>
  <line x1="100" y1="200" x2="700" y2="200" stroke="#334" stroke-width="1"/>
  <line x1="400" y1="60" x2="400" y2="350" stroke="#334" stroke-width="1"/>
  <circle cx="480" cy="250" r="80" fill="rgba(100,180,255,0.08)" stroke="#64b5ff" stroke-width="3" stroke-dasharray="6,3"/>
  <circle cx="480" cy="250" r="4" fill="#ffd700"/>
  <text x="485" y="243" fill="#ffd700" font-size="18" font-weight="bold">(1،-2)</text>
  <text x="400" y="220" text-anchor="middle" fill="#8899cc" font-size="18">نق² = ك-3</text>
  <text x="400" y="385" text-anchor="middle" fill="#8899cc" font-size="15">الشرط: ..... لكي تكون دائرة حقيقية</text>
</svg>`,

  // Q19: Cyclic quadrilateral exterior 115°
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg19" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
    <filter id="glow19"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="800" height="400" fill="url(#bg19)" rx="20"/>
  <text x="400" y="45" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">زاوية خارجة 115°</text>
  <circle cx="400" cy="220" r="155" fill="rgba(100,180,255,0.07)" stroke="#64b5ff" stroke-width="2.5"/>
  <polygon points="280,75 550,130 490,340 220,300" fill="rgba(100,180,255,0.1)" stroke="#ffd700" stroke-width="3"/>
  <circle cx="280" cy="75" r="6" fill="#ff6b6b"/><text x="258" y="63" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">أ</text>
  <circle cx="550" cy="130" r="6" fill="#ff6b6b"/><text x="565" y="118" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">ب</text>
  <circle cx="490" cy="340" r="6" fill="#ff6b6b"/><text x="500" y="365" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">ج</text>
  <circle cx="220" cy="300" r="6" fill="#ff6b6b"/><text x="190" y="322" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">د</text>
  <line x1="550" y1="130" x2="690" y2="110" stroke="#ff6b6b" stroke-width="2.5"/>
  <text x="695" y="105" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">هـ</text>
  <path d="M 555,128 A 18 18 0 0 1 565,120" stroke="#ffd700" stroke-width="2" fill="none"/>
  <text x="570" y="125" fill="#ffd700" font-size="17" font-weight="bold">115°</text>
  <text x="245" y="300" fill="#69db7c" font-size="22" font-weight="bold" filter="url(#glow19)">?</text>
</svg>`,

  // Q20: Two inscribed angles find x
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg20" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
    <filter id="glow20"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="800" height="400" fill="url(#bg20)" rx="20"/>
  <text x="400" y="45" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">زاويتان على نفس القوس</text>
  <circle cx="400" cy="210" r="140" fill="rgba(100,180,255,0.08)" stroke="#64b5ff" stroke-width="3"/>
  <circle cx="300" cy="80" r="6" fill="#ff6b6b"/><text x="280" y="68" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">أ</text>
  <circle cx="580" cy="260" r="6" fill="#ff6b6b"/><text x="595" y="270" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">ب</text>
  <circle cx="320" cy="330" r="6" fill="#69db7c"/><text x="300" y="355" fill="#69db7c" font-size="24" font-family="Arial" font-weight="bold">ج</text>
  <circle cx="480" cy="310" r="6" fill="#da77f2"/><text x="495" y="335" fill="#da77f2" font-size="24" font-family="Arial" font-weight="bold">د</text>
  <line x1="300" y1="80" x2="580" y2="260" stroke="#69db7c" stroke-width="2"/>
  <line x1="300" y1="80" x2="320" y2="330" stroke="#69db7c" stroke-width="2"/>
  <line x1="580" y1="260" x2="480" y2="310" stroke="#da77f2" stroke-width="2"/>
  <line x1="480" y1="310" x2="300" y2="80" stroke="#da77f2" stroke-width="2"/>
  <path d="M 315,95 A 20 20 0 0 1 325,105" stroke="#69db7c" stroke-width="2" fill="none"/>
  <text x="335" y="105" fill="#69db7c" font-size="17" font-weight="bold">س+20</text>
  <path d="M 570,248 A 20 20 0 0 0 560,250" stroke="#da77f2" stroke-width="2" fill="none"/>
  <text x="555" y="270" fill="#da77f2" font-size="17" font-weight="bold">2س-10</text>
  <text x="400" y="385" text-anchor="middle" fill="#8899cc" font-size="15">قيمتهما متساوية ← أوجد س</text>
</svg>`,

  // Q21: Find radius from x²+y²-4x+6y-12=0
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg21" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bg21)" rx="20"/>
  <text x="400" y="45" text-anchor="middle" fill="#e0e0ff" font-size="22" font-family="Arial" font-weight="bold">س²+ص²-4س+6ص-12=0</text>
  <line x1="50" y1="200" x2="750" y2="200" stroke="#334" stroke-width="1"/>
  <line x1="400" y1="50" x2="400" y2="350" stroke="#334" stroke-width="1"/>
  <circle cx="420" cy="130" r="100" fill="rgba(100,180,255,0.1)" stroke="#64b5ff" stroke-width="3"/>
  <circle cx="420" cy="130" r="5" fill="#ffd700"/>
  <text x="425" y="123" fill="#ffd700" font-size="18" font-weight="bold">المركز</text>
  <line x1="420" y1="130" x2="500" y2="180" stroke="#ff6b6b" stroke-width="2" stroke-dasharray="5,3"/>
  <text x="505" y="190" fill="#ff6b6b" font-size="18" font-weight="bold">نق=؟</text>
  <text x="400" y="385" text-anchor="middle" fill="#8899cc" font-size="15">نق = √(ل²+ك²-جـ)</text>
</svg>`,

  // Q22: Cyclic quadrilateral angles 3x and 2x
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg22" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bg22)" rx="20"/>
  <text x="400" y="45" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">أ=3س، ج=2س</text>
  <circle cx="400" cy="210" r="155" fill="rgba(100,180,255,0.07)" stroke="#64b5ff" stroke-width="2.5"/>
  <polygon points="300,70 560,130 490,330 210,290" fill="rgba(100,180,255,0.1)" stroke="#ffd700" stroke-width="3"/>
  <circle cx="300" cy="70" r="6" fill="#ff6b6b"/><text x="280" y="58" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">أ</text>
  <circle cx="560" cy="130" r="6" fill="#ff6b6b"/><text x="575" y="120" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">ب</text>
  <circle cx="490" cy="330" r="6" fill="#ff6b6b"/><text x="500" y="355" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">ج</text>
  <circle cx="210" cy="290" r="6" fill="#ff6b6b"/><text x="185" y="312" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">د</text>
  <text x="305" y="105" fill="#ff6b6b" font-size="20" font-weight="bold">3س</text>
  <text x="480" y="315" fill="#ff6b6b" font-size="20" font-weight="bold">2س</text>
  <text x="400" y="385" text-anchor="middle" fill="#8899cc" font-size="15">زاويتان متقابلتان ← أوجد قيمة س</text>
</svg>`,

  // Q23: Tangent angle 45°
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg23" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
    <filter id="glow23"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="800" height="400" fill="url(#bg23)" rx="20"/>
  <text x="400" y="45" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">زاوية مماسية 45°</text>
  <circle cx="380" cy="230" r="140" fill="rgba(100,180,255,0.08)" stroke="#64b5ff" stroke-width="3"/>
  <line x1="80" y1="120" x2="650" y2="380" stroke="#ff6b6b" stroke-width="3"/>
  <circle cx="280" cy="180" r="7" fill="#ffd700"/>
  <text x="255" y="168" fill="#ffd700" font-size="26" font-family="Arial" font-weight="bold">أ</text>
  <line x1="280" y1="180" x2="450" y2="110" stroke="#69db7c" stroke-width="2.5"/>
  <circle cx="450" cy="110" r="6" fill="#69db7c"/>
  <text x="458" y="98" fill="#69db7c" font-size="26" font-family="Arial" font-weight="bold">ب</text>
  <path d="M 280,180 L 300,170" stroke="#ffd700" stroke-width="2" fill="none"/>
  <path d="M 280,180 L 290,190" stroke="#ffd700" stroke-width="2" fill="none"/>
  <path d="M 285,178 A 10 10 0 0 1 286 186" stroke="#ffd700" stroke-width="2" fill="none"/>
  <text x="305" y="178" fill="#ffd700" font-size="18" font-weight="bold">45°</text>
  <circle cx="380" cy="230" r="4" fill="#fff"/>
  <text x="385" y="238" fill="#fff" font-size="14">م</text>
  <line x1="380" y1="230" x2="450" y2="110" stroke="#ffd700" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="400" y="140" fill="#ffd700" font-size="16" font-weight="bold" filter="url(#glow23)">المركزية=؟</text>
</svg>`,

  // Q24: Circle centered at origin passes through (-6,8)
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg24" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bg24)" rx="20"/>
  <text x="400" y="45" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">تمر بالنقطة (-6،8)</text>
  <line x1="50" y1="200" x2="750" y2="200" stroke="#334" stroke-width="1"/>
  <line x1="400" y1="50" x2="400" y2="350" stroke="#334" stroke-width="1"/>
  <circle cx="400" cy="200" r="100" fill="rgba(100,180,255,0.1)" stroke="#64b5ff" stroke-width="3"/>
  <circle cx="400" cy="200" r="4" fill="#fff"/>
  <text x="405" y="195" fill="#fff" font-size="16">(0,0)</text>
  <circle cx="340" cy="120" r="7" fill="#ffd700"/>
  <text x="320" y="112" fill="#ffd700" font-size="18" font-weight="bold">(-6,8)</text>
  <line x1="400" y1="200" x2="340" y2="120" stroke="#ff6b6b" stroke-width="1.5" stroke-dasharray="5,3"/>
  <text x="360" y="155" fill="#ff6b6b" font-size="15">المعادلة=؟</text>
</svg>`,

  // Q25: AB diameter, CAB=35°
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg25" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bg25)" rx="20"/>
  <text x="400" y="45" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">ج أ ب = 35°، أ ب قطر</text>
  <path d="M 140,280 A 260 260 0 0 1 660,280" fill="rgba(100,180,255,0.08)" stroke="#64b5ff" stroke-width="3"/>
  <line x1="140" y1="280" x2="660" y2="280" stroke="#ff6b6b" stroke-width="3"/>
  <line x1="140" y1="280" x2="400" y2="60" stroke="#69db7c" stroke-width="2.5"/>
  <line x1="660" y1="280" x2="400" y2="60" stroke="#69db7c" stroke-width="2.5"/>
  <circle cx="140" cy="280" r="7" fill="#ff6b6b"/><text x="115" y="305" fill="#ff6b6b" font-size="26" font-family="Arial" font-weight="bold">أ</text>
  <circle cx="660" cy="280" r="7" fill="#ff6b6b"/><text x="670" y="305" fill="#ff6b6b" font-size="26" font-family="Arial" font-weight="bold">ب</text>
  <circle cx="400" cy="60" r="7" fill="#ff6b6b"/><text x="408" y="45" fill="#ff6b6b" font-size="26" font-family="Arial" font-weight="bold">ج</text>
  <path d="M 400,60 L 400,95 L 435,95" stroke="#ffd700" stroke-width="2" fill="none"/>
  <path d="M 155,270 A 20 20 0 0 1 165,270" stroke="#ffd700" stroke-width="2" fill="none"/>
  <text x="170" y="268" fill="#ffd700" font-size="18" font-weight="bold">35°</text>
  <text x="575" y="180" fill="#69db7c" font-size="18" font-weight="bold">?</text>
</svg>`,

  // Q26: Which is a circle equation?
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg26" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0d1117"/>
      <stop offset="50%" style="stop-color:#161b22"/>
      <stop offset="100%" style="stop-color:#0d1117"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(56,139,253,0.08)"/>
      <stop offset="100%" style="stop-color:rgba(56,139,253,0.02)"/>
    </linearGradient>
    <linearGradient id="glowCircle" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(56,139,253,0.2)"/>
      <stop offset="100%" style="stop-color:rgba(56,139,253,0.05)"/>
    </linearGradient>
    <filter id="shadowCard">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.3)"/>
    </filter>
    <filter id="glow26"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="800" height="400" fill="url(#bg26)" rx="20"/>
  <!-- Decorative top line -->
  <rect x="0" y="0" width="800" height="4" fill="#388bfd" opacity="0.6"/>
  <!-- Left side: Circle illustration -->
  <rect x="20" y="20" width="320" height="360" rx="16" fill="rgba(56,139,253,0.03)" stroke="rgba(56,139,253,0.1)" stroke-width="1"/>
  <line x1="180" y1="60" x2="180" y2="340" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <line x1="40" y1="200" x2="320" y2="200" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <circle cx="180" cy="200" r="100" fill="url(#glowCircle)" stroke="#388bfd" stroke-width="2.5"/>
  <circle cx="180" cy="200" r="3" fill="#fff"/>
  <line x1="180" y1="200" x2="260" y2="200" stroke="#ffd700" stroke-width="2"/>
  <text x="260" y="195" fill="#ffd700" font-size="16" font-weight="bold">نق</text>
  <text x="175" y="225" fill="rgba(255,255,255,0.5)" font-size="12">(0,0)</text>
  <text x="180" y="155" text-anchor="middle" fill="#e0e0ff" font-size="13">س² + ص² = نق²</text>
  <text x="180" y="370" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-size="12">معادلة الدائرة العامة</text>
  <!-- Right side: Equation cards -->
  <text x="540" y="52" text-anchor="middle" fill="#e0e0ff" font-size="22" font-family="Arial" font-weight="bold">أي من التالي معادلة دائرة؟</text>
  <!-- Card 1 -->
  <rect x="370" y="75" width="400" height="60" rx="12" fill="url(#cardGrad)" stroke="rgba(56,139,253,0.2)" stroke-width="1.5" filter="url(#shadowCard)"/>
  <circle cx="390" cy="105" r="14" fill="rgba(56,139,253,0.15)"/>
  <text x="390" y="110" text-anchor="middle" fill="#58a6ff" font-size="14" font-weight="bold">1</text>
  <text x="415" y="110" fill="#e0e0ff" font-size="19" font-family="Arial">2س² + 3ص² = 12</text>
  <!-- Card 2 -->
  <rect x="370" y="145" width="400" height="60" rx="12" fill="url(#cardGrad)" stroke="rgba(56,139,253,0.2)" stroke-width="1.5" filter="url(#shadowCard)"/>
  <circle cx="390" cy="175" r="14" fill="rgba(56,139,253,0.15)"/>
  <text x="390" y="180" text-anchor="middle" fill="#58a6ff" font-size="14" font-weight="bold">2</text>
  <text x="415" y="180" fill="#e0e0ff" font-size="19" font-family="Arial">س² + ص² + 9 = 0</text>
  <!-- Card 3 -->
  <rect x="370" y="215" width="400" height="60" rx="12" fill="url(#cardGrad)" stroke="rgba(56,139,253,0.2)" stroke-width="1.5" filter="url(#shadowCard)"/>
  <circle cx="390" cy="245" r="14" fill="rgba(56,139,253,0.15)"/>
  <text x="390" y="250" text-anchor="middle" fill="#58a6ff" font-size="14" font-weight="bold">3</text>
  <text x="415" y="250" fill="#e0e0ff" font-size="19" font-family="Arial">س² - ص² = 16</text>
  <!-- Card 4 -->
  <rect x="370" y="285" width="400" height="60" rx="12" fill="url(#cardGrad)" stroke="rgba(56,139,253,0.2)" stroke-width="1.5" filter="url(#shadowCard)"/>
  <circle cx="390" cy="315" r="14" fill="rgba(56,139,253,0.15)"/>
  <text x="390" y="320" text-anchor="middle" fill="#58a6ff" font-size="14" font-weight="bold">4</text>
  <text x="415" y="320" fill="#e0e0ff" font-size="19" font-family="Arial">2س² + 2ص² = 18</text>
  <!-- Hint -->
  <text x="570" y="375" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-size="13">قارن بالصيغة العامة لمعادلة الدائرة</text>
</svg>`,

  // Q27: Cyclic quadrilateral exterior 85°
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg27" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
    <filter id="glow27"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="800" height="400" fill="url(#bg27)" rx="20"/>
  <text x="400" y="45" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">زاوية خارجة 85°</text>
  <circle cx="400" cy="220" r="155" fill="rgba(100,180,255,0.07)" stroke="#64b5ff" stroke-width="2.5"/>
  <polygon points="280,75 540,130 480,340 220,300" fill="rgba(100,180,255,0.1)" stroke="#ffd700" stroke-width="3"/>
  <circle cx="280" cy="75" r="6" fill="#ff6b6b"/><text x="258" y="63" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">س</text>
  <circle cx="540" cy="130" r="6" fill="#ff6b6b"/><text x="555" y="118" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">ص</text>
  <circle cx="480" cy="340" r="6" fill="#ff6b6b"/><text x="490" y="365" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">ع</text>
  <circle cx="220" cy="300" r="6" fill="#ff6b6b"/><text x="190" y="322" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">ل</text>
  <line x1="540" y1="130" x2="680" y2="110" stroke="#ff6b6b" stroke-width="2.5"/>
  <text x="685" y="105" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">ك</text>
  <path d="M 545,128 A 18 18 0 0 1 555,120" stroke="#ffd700" stroke-width="2" fill="none"/>
  <text x="560" y="125" fill="#ffd700" font-size="17" font-weight="bold">85°</text>
  <text x="240" y="300" fill="#69db7c" font-size="22" font-weight="bold" filter="url(#glow27)">?</text>
</svg>`,

  // Q28: Two inscribed angles find the measure
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg28" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bg28)" rx="20"/>
  <text x="400" y="45" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">زاويتان على نفس القوس</text>
  <circle cx="400" cy="210" r="140" fill="rgba(100,180,255,0.08)" stroke="#64b5ff" stroke-width="3"/>
  <circle cx="320" cy="80" r="6" fill="#ff6b6b"/><text x="305" y="68" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">أ</text>
  <circle cx="580" cy="270" r="6" fill="#ff6b6b"/><text x="595" y="280" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">ب</text>
  <circle cx="320" cy="330" r="6" fill="#69db7c"/><text x="300" y="355" fill="#69db7c" font-size="24" font-family="Arial" font-weight="bold">ج</text>
  <circle cx="480" cy="310" r="6" fill="#da77f2"/><text x="495" y="335" fill="#da77f2" font-size="24" font-family="Arial" font-weight="bold">د</text>
  <line x1="320" y1="80" x2="580" y2="270" stroke="#69db7c" stroke-width="2"/>
  <line x1="320" y1="80" x2="320" y2="330" stroke="#69db7c" stroke-width="2"/>
  <line x1="580" y1="270" x2="480" y2="310" stroke="#da77f2" stroke-width="2"/>
  <line x1="480" y1="310" x2="320" y2="80" stroke="#da77f2" stroke-width="2"/>
  <path d="M 335,95 A 20 20 0 0 1 345,105" stroke="#69db7c" stroke-width="2" fill="none"/>
  <text x="350" y="105" fill="#69db7c" font-size="17" font-weight="bold">ص+15</text>
  <path d="M 570,258 A 20 20 0 0 0 560,260" stroke="#da77f2" stroke-width="2" fill="none"/>
  <text x="555" y="280" fill="#da77f2" font-size="17" font-weight="bold">2ص-20</text>
  <text x="400" y="382" text-anchor="middle" fill="#8899cc" font-size="15">متساويان ← أوجد قياس الزاوية</text>
</svg>`,

  // Q29: Circle center from (x-4)²+(y+3)²=25
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg29" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
    <filter id="glow29"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="800" height="400" fill="url(#bg29)" rx="20"/>
  <text x="400" y="45" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">(س-4)²+(ص+3)²=25</text>
  <line x1="50" y1="200" x2="750" y2="200" stroke="#334" stroke-width="1"/>
  <line x1="400" y1="50" x2="400" y2="350" stroke="#334" stroke-width="1"/>
  <circle cx="480" cy="240" r="80" fill="rgba(100,180,255,0.1)" stroke="#64b5ff" stroke-width="3"/>
  <circle cx="480" cy="240" r="5" fill="#ffd700"/>
  <text x="488" y="233" fill="#ffd700" font-size="18" font-weight="bold" filter="url(#glow29)">المركز=؟</text>
  <text x="400" y="385" text-anchor="middle" fill="#8899cc" font-size="15">في الصورة (س-د)²+(ص-هـ)²=نق²، المركز (د،هـ)</text>
</svg>`,

  // Q30: Central angle 150°, inscribed on major arc
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg30" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
    <filter id="glow30"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="800" height="400" fill="url(#bg30)" rx="20"/>
  <text x="400" y="45" text-anchor="middle" fill="#e0e0ff" font-size="24" font-family="Arial" font-weight="bold">المركزية = 150° (على القوس الأكبر)</text>
  <circle cx="400" cy="210" r="150" fill="rgba(100,180,255,0.08)" stroke="#64b5ff" stroke-width="3"/>
  <circle cx="400" cy="210" r="5" fill="#fff"/>
  <text x="405" y="203" fill="#fff" font-size="18" font-weight="bold">م</text>
  <circle cx="290" cy="75" r="6" fill="#ff6b6b"/><text x="270" y="63" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">أ</text>
  <circle cx="560" cy="270" r="6" fill="#ff6b6b"/><text x="575" y="280" fill="#ff6b6b" font-size="24" font-family="Arial" font-weight="bold">ب</text>
  <circle cx="250" cy="320" r="6" fill="#ffd700"/><text x="225" y="345" fill="#ffd700" font-size="24" font-family="Arial" font-weight="bold">د</text>
  <line x1="400" y1="210" x2="290" y2="75" stroke="#ffd700" stroke-width="2"/>
  <line x1="400" y1="210" x2="560" y2="270" stroke="#ffd700" stroke-width="2"/>
  <line x1="290" y1="75" x2="250" y2="320" stroke="#69db7c" stroke-width="2"/>
  <line x1="560" y1="270" x2="250" y2="320" stroke="#69db7c" stroke-width="2"/>
  <path d="M 380,195 A 25 25 0 0 1 390,195" stroke="#ffd700" stroke-width="2" fill="none"/>
  <text x="420" y="195" fill="#ffd700" font-size="16" font-weight="bold">150°</text>
  <path d="M 270,85 A 18 18 0 0 1 275,95" stroke="#69db7c" stroke-width="2" fill="none"/>
  <text x="280" y="95" fill="#69db7c" font-size="16" font-weight="bold" filter="url(#glow30)">؟</text>
  <path d="M 290,75 A 150 150 0 0 1 560,270" stroke="#ffd700" stroke-width="2.5" fill="none" stroke-dasharray="8,4" opacity="0.6"/>
  <path d="M 290,75 A 150 150 0 0 0 560,270" stroke="#69db7c" stroke-width="2" fill="none" stroke-dasharray="6,3" opacity="0.4"/>
  <text x="400" y="385" text-anchor="middle" fill="#8899cc" font-size="15">الزاوية المحيطية على القوس الأكبر = ؟</text>
</svg>`
];

for (let i = 0; i < svgs.length; i++) {
  const id = i + 1;
  const fp = path.join(dir, `q${id}.svg`);
  fs.writeFileSync(fp, svgs[i]);
  const size = fs.statSync(fp).size;
  console.log(`✓ Q${id}.svg saved (${(size / 1024).toFixed(1)} KB)`);
}

console.log(`\nAll ${svgs.length} SVGs generated successfully!`);
