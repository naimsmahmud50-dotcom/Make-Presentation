/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Executive Audio Narration & Multi-Lingual Subtitle Engine
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Powers the stage runtime voice narration and international karaoke subtitles (`stage.html`, Hotkey: 'V').
 * Features:
 *   1. Zero-Upload Client-Side Speech Synthesis (HTML5 Web Speech API `speechSynthesis`)
 *   2. Multi-Lingual Executive Translation: English (en), Japanese (ja), German (de),
 *      Spanish (es), French (fr), Mandarin Chinese (zh), and Bengali (bn).
 *   3. Real-time Karaoke Subtitle Ticker with word-level boundary highlighting (`onboundary`)
 *   4. Native Voice Auto-Discovery matching selected language and high-clarity timbre
 *   5. Seamless Play / Pause / Resume / Skip controls with audio synthesizer cues
 *
 * [ZERO-UPLOAD GUARANTEE]:
 * 100% client-side memory execution. No external cloud speech APIs, keys, or recordings.
 *
 * [ENGINEERING NOTES]:
 *   - Change language anytime: `voiceNarrator.setLanguage('ja')` or `'de'`
 *   - Call `voiceNarrator.narrateSlide({ slideIndex, title, points, archetype, onStart, onBoundary, onEnd })`
 * =========================================================================================
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', tag: 'EN' },
  { code: 'ja', label: '日本語', tag: 'JA' },
  { code: 'de', label: 'Deutsch', tag: 'DE' },
  { code: 'es', label: 'Español', tag: 'ES' },
  { code: 'fr', label: 'Français', tag: 'FR' },
  { code: 'zh', label: '中文 (Mandarin)', tag: 'ZH' },
  { code: 'bn', label: 'বাংলা (Bengali)', tag: 'BN' }
];

export const MULTI_LINGUAL_SCRIPTS = {
  en: {
    0: "Welcome to the executive presentation of this system. We are addressing manual friction and operational bottlenecks. Through our zero-upload autonomous architecture, all AST parsing, security classification, and execution run strictly in-browser without sending a single byte to external servers.",
    1: "Moving to our architectural blueprint. This directed pipeline graph visualizes real-time data flow between triggers, worker nodes, and persistence layers. Each service blade can be inspected in detail, and orbiting in 3D Holodeck mode provides spatial topology clarity.",
    2: "Next, our in-browser execution sandbox. Powered by WebAssembly and CPython, raw Python logic compiles and runs at hardware speeds inside isolated memory. When an event fires, the entire pipeline processes deterministically in milliseconds.",
    3: "Here we evaluate responsive presentation fidelity across standard enterprise hardware—from 32-inch 6K desktop monitors to high-density mobile viewports, ensuring pixel-perfect layout stability and zero layout shift.",
    4: "Examining business impact and economics. This bento matrix demonstrates an 84 percent reduction in incident turnaround, reclaiming 35 engineering hours each week and translating to over $136,000 in bottom-line annual value.",
    5: "Finally, live audience engagement. Stakeholders connect instantly through our mobile companion remote to submit questions, trigger live test events, and interact with the presentation in real time."
  },
  ja: {
    0: "このシステムの幹部向けプレゼンテーションへようこそ。私たちは運用の摩擦とボトルネックを解決します。ゼロアップロードの自律型アーキテクチャにより、すべてのAST解析、セキュリティ分類、実行はブラウザ内で完結し、外部サーバーに1バイトも送信されません。",
    1: "アーキテクチャの青写真をご覧ください。この有向パイプライングラフは、トリガー、ワーカーノード、永続化層の間のリアルタイムデータフローを可視化します。3Dホロデッキモードで空間的なトポロジも明確に把握できます。",
    2: "次に、ブラウザ内実行サンドボックスです。WebAssemblyとCPythonを活用し、Pythonロジックを分離されたメモリ内でハードウェア最高速でコンパイルおよび実行します。",
    3: "ここでは、32インチ6Kデスクトップから高密度モバイルまで、標準的なエンタープライズハードウェア全体での応答性の高い表示忠実度を評価します。",
    4: "ビジネスへの影響と経済性を検証します。このベントマトリックスは、インシデント解決時間の84パーセント削減と、毎週35エンジニアリング時間の回収、年間13万6千ドル以上の価値創出を実証しています。",
    5: "最後に、リアルタイムの聴衆エンゲージメントです。関係者はモバイルコンパニオンリモートを通じて瞬時に接続し、質問の送信やテストイベントのトリガーを実行できます。"
  },
  de: {
    0: "Willkommen zur Management-Präsentation dieses Systems. Durch unsere autonome Zero-Upload-Architektur laufen AST-Parsing, Sicherheitsklassifizierung und Ausführung vollständig im Browser ab, ohne ein einziges Byte an externe Server zu senden.",
    1: "Unser Architektur-Entwurf. Dieser gerichtete Pipeline-Graph visualisiert den Echtzeit-Datenfluss zwischen Triggern, Worker-Knoten und Persistenzschichten mit 3D-Holodeck-Topologie.",
    2: "Als Nächstes unsere browserinterne Ausführungs-Sandbox. Angetrieben von WebAssembly und CPython kompiliert und läuft Python-Code mit Hardware-Geschwindigkeit in isoliertem Speicher.",
    3: "Wir evaluieren die Darstellungstreue auf Standard-Unternehmenshardware – von 32-Zoll-6K-Monitoren bis hin zu mobilen Ansichten für maximale Layout-Stabilität.",
    4: "Geschäftlicher Mehrwert und ROI: Diese Bento-Matrix belegt eine 84-prozentige Reduzierung der Bearbeitungszeit, 35 eingesparte Ingenieursstunden pro Woche und über 136.000 Dollar jährlichen Mehrwert.",
    5: "Echtzeit-Publikumseinbindung: Stakeholder verbinden sich direkt über ihr Smartphone, um Fragen zu stellen und Live-Tests auszulösen."
  },
  es: {
    0: "Bienvenidos a la presentación ejecutiva de este sistema. Gracias a nuestra arquitectura autónoma de cero cargas, todo el análisis AST, la clasificación de seguridad y la ejecución se procesan en el navegador sin enviar un solo byte a servidores externos.",
    1: "Pasando a nuestro modelo arquitectónico. Este grafo dirigido visualiza el flujo de datos en tiempo real entre disparadores, nodos de trabajo y capas de persistencia en 2D y 3D.",
    2: "A continuación, nuestro entorno de pruebas en el navegador, impulsado por WebAssembly y CPython con ejecución determinista en milisegundos.",
    3: "Evaluamos la fidelidad de presentación adaptable en hardware empresarial, desde monitores 6K hasta pantallas móviles con cero desplazamiento visual.",
    4: "Impacto económico: Esta matriz bento demuestra una reducción del 84 por ciento en la resolución de incidentes, recuperando 35 horas de ingeniería semanales y más de $136,000 en valor anual.",
    5: "Participación en vivo: La audiencia se conecta instantáneamente mediante el control remoto móvil para enviar preguntas y disparar pruebas en tiempo real."
  },
  fr: {
    0: "Bienvenue à la présentation exécutive de ce système. Grâce à notre architecture autonome zéro transfert, tout le traitement AST, la classification de sécurité et l'exécution se déroulent dans le navigateur sans envoyer un seul octet à des serveurs externes.",
    1: "Voici notre modèle d'architecture. Ce graphe orienté visualise le flux de données en temps réel entre déclencheurs, nœuds de traitement et couches de persistance avec vue spatiale 3D.",
    2: "Voici notre bac à sable d'exécution intégré au navigateur, propulsé par WebAssembly et CPython à la vitesse matérielle.",
    3: "Nous évaluons ici la fidélité réactive sur le matériel d'entreprise, des écrans 6K aux appareils mobiles sans décalage de mise en page.",
    4: "Impact commercial et retour sur investissement : cette matrice bento démontre une réduction de 84 pour cent du temps de résolution et plus de 136 000 dollars de valeur annuelle.",
    5: "Engagement interactif en direct : les participants se connectent via leur smartphone pour poser des questions et déclencher des tests instantanément."
  },
  zh: {
    0: "欢迎参加本系统的高管技术演示。借助我们纯客户端零上传自主架构，所有的AST语法解析、安全分类与运行时执行均在浏览器内部完成，无需向外部服务器发送任何数据。",
    1: "这是我们的系统架构蓝图。有向流水线图实时展示触发器、计算节点与持久层之间的数据流，并支持3D全息甲板空间透视。",
    2: "接下来是浏览器沙箱环境，依托WebAssembly与CPython，实现微秒级硬件加速确定性执行。",
    3: "我们评估在各类企业级硬件上的响应式呈现效果，从32英寸6K大屏到高密度移动终端，实现零布局抖动。",
    4: "商业价值与投资回报：便当矩阵展现事件处理时间缩短84%，每周节省35小时工程工时，年均节省资金超13.6万美元。",
    5: "最后是现场互动：与会嘉宾可通过手机即时连接，实时提交提问并触发测试事件。"
  },
  bn: {
    0: "আমাদের সিস্টেমের এক্সিকিউটিভ প্রেজেন্টেশনে আপনাদের স্বাগতম। আমাদের জিরো-আপলোড অটোনোমাস আর্কিটেকচারের মাধ্যমে সকল AST পার্সিং, সিকিউরিটি ক্লাসিফিকেশন এবং কোড এক্সিকিউশন কোনো ডেটা এক্সটার্নাল সার্ভারে না পাঠিয়ে সম্পূর্ণ ক্লায়েন্ট ব্রাউজারে রান করে।",
    1: "আমাদের আর্কিটেকচার ব্লুপ্রিন্ট। এই ডিরেক্টেড পাইপলাইন গ্রাফে রিয়েল-টাইম ট্রিগার, ওয়ার্কার নোড এবং ডেটাবেজের প্রবাহ সরাসরি ভিজ্যুয়ালাইজ করা হয় এবং 3D হোলোডেক মোডে স্পষ্ট স্পেশিয়াল টপোলজি পাওয়া যায়।",
    2: "ব্রাউজার-ভিত্তিক এক্সিকিউশন স্যান্ডবক্স। WebAssembly এবং CPython এর মাধ্যমে পাইথন কোড সরাসরি মেমোরিতে হার্ডওয়্যার স্পিডে এক্সিকিউট হয়।",
    3: "৩২-ইঞ্চি ৬কে ডিসপ্লে থেকে মোবাইল স্ক্রিন পর্যন্ত সকল ডিভাইসে নিখুঁত রেসপন্সিভ লেআউট স্টেবিলিটি নিশ্চিত করা হয়েছে।",
    4: "বিজনেস ইমপ্যাক্ট ও আরওআই: এই বেন্টো ম্যাট্রিক্স প্রমাণ করে যে এটি প্রতি সপ্তাহে ৩৫ ঘণ্টার ইঞ্জিনিয়ারিং সময় বাঁচায় এবং বার্ষিক ১ লক্ষ ৩৬ হাজার ডলারের বেশি ভ্যালু তৈরি করে।",
    5: "লাইভ অডিয়েন্স এনগেজমেন্ট: উপস্থিত স্টেকহোল্ডাররা তাদের স্মার্টফোন দিয়ে সরাসরি প্রশ্ন পাঠাতে এবং লাইভ টেস্ট ইভেন্ট ট্রিগার করতে পারেন।"
  }
};

export class VoiceNarratorEngine {
  constructor() {
    this.synth = (typeof window !== 'undefined' && 'speechSynthesis' in window) ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.currentLanguage = 'en';
    this.rate = 1.0;
    this.pitch = 1.02;
    this.selectedVoice = null;
    this.activeSlideIndex = null;
    this.onBoundaryCallback = null;
    this.onEndCallback = null;
    this.onStartCallback = null;

    this.initVoices();
  }

  initVoices() {
    if (!this.synth) return;

    const populateVoices = () => {
      const voices = this.synth.getVoices();
      if (!voices || voices.length === 0) return;

      this.updateVoiceForLanguage(this.currentLanguage);
    };

    populateVoices();
    if (typeof window !== 'undefined' && this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = populateVoices;
    }
  }

  /**
   * Sets active language and picks appropriate native voice
   * @param {string} langCode
   */
  setLanguage(langCode) {
    if (!MULTI_LINGUAL_SCRIPTS[langCode]) {
      langCode = 'en';
    }
    this.currentLanguage = langCode;
    this.updateVoiceForLanguage(langCode);
  }

  updateVoiceForLanguage(langCode) {
    if (!this.synth) return;
    const voices = this.synth.getVoices() || [];
    if (voices.length === 0) return;

    // Filter voices matching language
    const langPrefix = langCode.toLowerCase();
    const matching = voices.filter(v => v.lang.toLowerCase().startsWith(langPrefix));

    if (matching.length > 0) {
      const preferred = matching.find(v => 
        v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Enhanced')
      ) || matching[0];
      this.selectedVoice = preferred;
    } else {
      // Fallback to default English voice
      this.selectedVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
    }
  }

  /**
   * Generates crisp, high-impact executive narration text based on slide index and current language
   * @param {Object} params
   * @returns {string}
   */
  generateNarrationScript({ slideIndex, title, points }) {
    const langScripts = MULTI_LINGUAL_SCRIPTS[this.currentLanguage] || MULTI_LINGUAL_SCRIPTS.en;

    if (langScripts && langScripts[slideIndex]) {
      return langScripts[slideIndex];
    }

    if (points && points.length > 0) {
      return `${title}. Key highlights include: ${points.join('. ')}.`;
    }

    return `${title}. Presenting architecture and operational performance overview.`;
  }

  /**
   * Narrates slide with real-time word boundary callbacks
   * @param {Object} options
   */
  narrateSlide({
    slideIndex,
    title,
    points = [],
    archetype = 'TYPE_B_PIPELINE',
    onStart = null,
    onBoundary = null,
    onEnd = null
  }) {
    if (!this.synth) {
      console.warn('[VoiceNarrator] SpeechSynthesis API not supported in this browser environment.');
      return;
    }

    // Stop any ongoing speech
    this.stop();

    this.activeSlideIndex = slideIndex;
    this.onStartCallback = onStart;
    this.onBoundaryCallback = onBoundary;
    this.onEndCallback = onEnd;

    const fullScript = this.generateNarrationScript({ slideIndex, title, points, archetype });
    const utterance = new SpeechSynthesisUtterance(fullScript);

    this.updateVoiceForLanguage(this.currentLanguage);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.lang = this.selectedVoice?.lang || this.currentLanguage;
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;

    utterance.onstart = () => {
      this.isPlaying = true;
      this.isPaused = false;
      if (this.onStartCallback) this.onStartCallback(fullScript);
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word' && this.onBoundaryCallback) {
        const charIdx = event.charIndex;
        const charLen = event.charLength || 6;
        const spokenWord = fullScript.substring(charIdx, charIdx + charLen).trim();
        this.onBoundaryCallback({ charIdx, charLen, spokenWord, fullScript });
      }
    };

    utterance.onend = () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.currentUtterance = null;
      if (this.onEndCallback) this.onEndCallback();
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('[VoiceNarrator] Synthesis notice:', e.error);
      }
      this.isPlaying = false;
      this.isPaused = false;
      this.currentUtterance = null;
      if (this.onEndCallback) this.onEndCallback();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  /**
   * Toggles pause/resume
   */
  togglePause() {
    if (!this.synth) return;
    if (this.synth.paused) {
      this.synth.resume();
      this.isPaused = false;
    } else if (this.synth.speaking) {
      this.synth.pause();
      this.isPaused = true;
    }
  }

  /**
   * Stops ongoing narration
   */
  stop() {
    if (!this.synth) return;
    this.synth.cancel();
    this.isPlaying = false;
    this.isPaused = false;
    this.currentUtterance = null;
    if (this.onEndCallback) this.onEndCallback();
  }
}

export const voiceNarrator = new VoiceNarratorEngine();
