import { useState, useRef, useEffect } from 'react'
import { sendMessageToAI } from '../services/chatService'
import { useToast } from '../context/ToastContext'

const TELUGU_KB = {
  // Greetings
  "నమస్కారం": "నమస్కారం! 🙏 నేను KrishiAI. మీకు పంటలు, వ్యాధులు, పురుగుమందులు మరియు మార్కెట్ ధరల గురించి సహాయం చేస్తాను!",
  "హలో": "హలో! 🌱 KrishiAI కి స్వాగతం. మీ వ్యవసాయ ప్రశ్న అడగండి.",
  
  // Soil types
  "నల్ల నేల": "🌱 నల్ల నేలకు అనుకూలమైన పంటలు:\n• పత్తి (అత్యుత్తమం — నల్ల నేలలో బాగా పెరుగుతుంది)\n• సోయాబీన్ (అధిక దిగుబడి)\n• గోధుమ (రబీ సీజన్)\n• శనగ (తక్కువ నీరు అవసరం)\n\n💡 నల్ల నేల తేమను బాగా నిలుపుకుంటుంది. నీటిపారుదల తక్కువగా చేయండి.",
  "ఎర్ర నేల": "🌱 ఎర్ర నేలకు అనుకూలమైన పంటలు:\n• వేరుశనగ (అత్యుత్తమం)\n• జొన్న, సజ్జ\n• కందులు, పెసలు\n• పత్తి (మధ్యస్థ దిగుబడి)\n\n💡 ఎర్ర నేల త్వరగా ఆరిపోతుంది — తరచుగా నీరు పెట్టండి.",
  "ఇసుక నేల": "🌱 ఇసుక నేలకు అనుకూలమైన పంటలు:\n• పుచ్చకాయ, ఖర్బూజ\n• వేరుశనగ\n• చిలగడదుంప\n• కొబ్బరి (తీర ప్రాంతాలు)\n\n💡 తరచుగా నీరు అవసరం. డ్రిప్ నీటిపారుదల వాడండి.",
  
  // Crop advice
  "టమాటా": "🍅 టమాటా సాగు:\n• సీజన్: అక్టోబర్-నవంబర్ లేదా జూన్-జూలై\n• దూరం: 60×45 సెంటీమీటర్లు\n• నీరు: 7-10 రోజులకొకసారి\n• ఎరువు: NPK 120:60:60 కిలోలు/హెక్టార్\n• దిగుబడి: 20-25 టన్నులు/హెక్టార్\n• లాభం: ₹80,000-1,50,000 ఎకరాకు",
  "వరి": "🌾 వరి సాగు:\n• సీజన్: ఖరీఫ్ (జూన్-జూలై నాటుకోవడం)\n• నీరు: 5 సెంటీమీటర్ల వరద నీరు అవసరం\n• ఎరువు: యూరియా 100కిలో + DAP 50కిలో/ఎకరా\n• నాటే సమయం: 25-30 రోజుల నారు\n• దిగుబడి: 50-60 క్వింటాళ్ళు/హెక్టార్\n• లాభం: ₹20,000-35,000 ఎకరాకు",
  "గోధుమ": "🌾 గోధుమ సాగు:\n• సీజన్: రబీ (అక్టోబర్-నవంబర్)\n• నీరు: 4-6 సార్లు అవసరం\n  - మొదటిసారి: నాటిన 20-25 రోజులకు\n  - రెండవసారి: 40-45 రోజులకు\n• ఎరువు: NPK 120:60:40 కిలోలు/హెక్టార్\n• దిగుబడి: 40-50 క్వింటాళ్ళు/హెక్టార్\n• MSP 2024: ₹2,275/క్వింటాల్",
  "పత్తి": "🌿 పత్తి సాగు:\n• సీజన్: ఖరీఫ్ (ఏప్రిల్-జూన్)\n• దూరం: 90×60 సెంటీమీటర్లు\n• నీరు: 10-15 రోజులకొకసారి\n• ఎరువు: NPK 60:30:30 కిలోలు/ఎకరా\n• దిగుబడి: 15-20 క్వింటాళ్ళు/ఎకరా\n• ధర: ₹5,500-6,500/క్వింటాల్\n• లాభం: ₹30,000-50,000 ఎకరాకు",
  "మొక్కజొన్న": "🌽 మొక్కజొన్న సాగు:\n• సీజన్: ఖరీఫ్ మరియు రబీ రెండూ\n• విత్తన రేటు: 8-10 కిలోలు/ఎకరా\n• నీరు: 7-10 రోజులకొకసారి\n• ఎరువు: NPK 80:40:40 కిలోలు/హెక్టార్\n• దిగుబడి: 25-30 క్వింటాళ్ళు/ఎకరా\n• ధర: ₹1,600-1,900/క్వింటాల్",
  
  // Diseases
  "బ్లైట్": "🔴 బ్లైట్ చికిత్స:\n\nముందుస్తు బ్లైట్ (గుండ్రటి మచ్చలు):\n• మాంకోజెబ్ 75% WP 2గ్రా/లీటర్ స్ప్రే చేయండి\n• 10 రోజులకొకసారి 3 సార్లు\n• పాత ఆకులు తొలగించండి\n\nతరువాతి బ్లైట్ (నీటి మచ్చలు):\n• మెటలాక్సిల్ + మాంకోజెబ్ 2.5గ్రా/లీటర్\n• వెంటనే స్ప్రే చేయండి!\n\n💊 ఖర్చు: ₹500-800/స్ప్రే/ఎకరా",
  "తెగులు": "🔴 తెగులు చికిత్స:\n• మాంకోజెబ్ 75% WP 2గ్రా/లీటర్ స్ప్రే చేయండి\n• 10 రోజులకొకసారి\n• జబ్బు ఆకులు తొలగించండి\n• నీటిని ఆకులపై పడకుండా చూడండి\n\n💡 ముందు జాగ్రత్త: తగిన దూరంలో నాటండి",
  "పురుగులు": "🐛 పురుగుల నివారణ:\n• ఇమిడాక్లోప్రిడ్ 17.8% SL 0.5మిలి/లీటర్\n• లేదా థయామెథాక్సమ్ 25% WG 0.2గ్రా/లీటర్\n• ఉదయం లేదా సాయంత్రం స్ప్రే చేయండి\n\n🌿 సేంద్రీయ పరిష్కారం: వేప నూనె 5మిలి/లీటర్ 10 రోజులకొకసారి\n💰 ఖర్చు: ₹300-500/స్ప్రే",
  "వేప": "🌿 వేప నూనె వాడకం:\n• 5మిలి వేప నూనె + 1మిలి సబ్బు + 1లీటర్ నీరు\n• 10-15 రోజులకొకసారి స్ప్రే చేయండి\n• ఉదయం లేదా సాయంత్రం స్ప్రే చేయండి\n• అన్ని పురుగులకు పనిచేస్తుంది\n• సేంద్రీయ వ్యవసాయానికి అనువైనది",
  
  // Fertilizers
  "ఎరువు": "🌱 ఎరువుల మార్గదర్శకం:\n\n1 ఎకరాకు సాధారణంగా:\n• యూరియా (నత్రజని): 50-60 కిలోలు\n• DAP (భాస్వరం): 25-30 కిలోలు\n• MOP (పొటాష్): 15-20 కిలోలు\n\nవేసే సమయం:\n• విత్తే సమయం: DAP + MOP + 1/3 యూరియా\n• 30 రోజులకు: 1/3 యూరియా\n• 60 రోజులకు: 1/3 యూరియా\n\n💡 సేంద్రీయం: 2-3 టన్నుల పశువుల పేడ/ఎకరా",
  "యూరియా": "💊 యూరియా వాడకం:\n• సాధారణ మోతాదు: 50-60 కిలోలు/ఎకరా\n• విత్తే సమయం: 1/3 వాటా\n• 30-35 రోజులకు: 1/3 వాటా\n• 55-60 రోజులకు: 1/3 వాటా\n• తడి నేలలో వేయండి\n• వర్షానికి ముందు వేయడం మంచిది\n• ధర: ₹267/బస్తా (45కిలో) — రాయితీ ధర",
  
  // Water / Irrigation
  "నీరు": "💧 నీటిపారుదల మార్గదర్శకం:\n\nపంట నీటి అవసరాలు (ఎకరాకు):\n• టమాటా: 7-8 రోజులకొకసారి\n• గోధుమ: 4-6 సార్లు మొత్తం\n• వరి: నిరంతర వరద నీరు\n• పత్తి: 10-15 రోజులకొకసారి\n• ఉల్లి: 5-7 రోజులకొకసారి\n\n💡 డ్రిప్ నీటిపారుదల 40-50% నీరు ఆదా చేస్తుంది",
  "డ్రిప్": "💧 డ్రిప్ నీటిపారుదల:\n• 40-50% నీరు ఆదా అవుతుంది\n• ప్రభుత్వ రాయితీ: 55-75%\n• ఖర్చు: ₹25,000-35,000/ఎకరా\n• 2 సంవత్సరాల్లో లాభాలు వస్తాయి\n• కూరగాయలకు అత్యుత్తమం\n• ₹1800-1551 కి ఫోన్ చేయి - కిసాన్ కాల్ సెంటర్",
  
  // Market prices
  "మార్కెట్": "📊 నేటి మండి ధరలు (సుమారు):\n• టమాటా: ₹800-1,800/క్వింటాల్\n• గోధుమ: ₹2,100-2,400/క్వింటాల్\n• వరి: ₹1,800-2,200/క్వింటాల్\n• ఉల్లి: ₹600-1,200/క్వింటాల్\n• పత్తి: ₹5,500-6,500/క్వింటాల్\n• మిర్చి: ₹8,000-12,000/క్వింటాల్\n\n💡 పూర్తి ధరల జాబితా కోసం Market పేజీ చూడండి",
  "ధర": "📊 నేటి ప్రధాన పంటల ధరలు:\n• టమాటా: ₹1,200/క్వింటాల్\n• వరి: ₹2,000/క్వింటాల్\n• గోధుమ MSP: ₹2,275/క్వింటాల్\n• పత్తి: ₹6,000/క్వింటాల్\n• మిర్చి: ₹10,000/క్వింటాల్\n• పెసలు: ₹7,000/క్వింటాల్",
  "మండి": "📊 మండి సమాచారం:\n• హైదరాబాద్ (గడ్డియన్నారం): టమాటా ₹1,200\n• వరంగల్: వరి ₹2,000\n• గుంటూరు: మిర్చి ₹10,000\n• నిజామాబాద్: పసుపు ₹8,000\n• ఆదోని: పత్తి ₹6,000\n\n💡 అమ్మే ముందు ధరలు సరిచూసుకోండి",
  
  // Profit
  "లాభం": "💰 ఎకరాకు లాభాల అంచనా:\n• టమాటా: ₹80,000-1,50,000\n• గోధుమ: ₹15,000-25,000\n• వరి: ₹20,000-35,000\n• పత్తి: ₹30,000-50,000\n• ఉల్లి: ₹40,000-80,000\n• మిర్చి: ₹60,000-1,20,000\n\n💡 మీ పంట పేరు చెప్పండి — వివరమైన లెక్క చేస్తాను",
  "ఆదాయం": "💰 వ్యవసాయ ఆదాయ అంచనా:\n• మీ పంట ఏమిటి?\n• ఎన్ని ఎకరాలు ఉన్నాయి?\nఅని చెప్పండి — ఖచ్చితమైన లాభం లెక్కిస్తాను!\n\nసాధారణంగా:\n• కూరగాయలు: ₹50,000-1,50,000/ఎకరా\n• ధాన్యాలు: ₹15,000-35,000/ఎకరా\n• నగదు పంటలు: ₹30,000-1,20,000/ఎకరా",
  
  // Government schemes
  "పథకాలు": "🏛️ రైతులకు ప్రభుత్వ పథకాలు:\n• పీఎం కిసాన్: ₹6,000/సంవత్సరం నేరుగా\n• కిసాన్ క్రెడిట్ కార్డ్: 4% వడ్డీకి రుణం\n• డ్రిప్ సబ్సిడీ: 55-75%\n• భూ ఆరోగ్య కార్డు: ఉచిత మట్టి పరీక్ష\n• PMFBY: తక్కువ ప్రీమియంకు పంట బీమా\n• రైతు బంధు: ₹10,000/ఎకరా సహాయం\n\n📞 సహాయానికి: 1800-180-1551",
  "రైతు బంధు": "🏛️ రైతు బంధు పథకం (తెలంగాణ):\n• ₹10,000/ఎకరా సీజన్కు ఇస్తారు\n• ఖరీఫ్లో ₹5,000 + రబీలో ₹5,000\n• నేరుగా బ్యాంక్ ఖాతాలో జమ అవుతుంది\n• రిజిస్ట్రేషన్: VRO కార్యాలయంలో\n• అర్హత: పట్టా భూమి ఉన్న రైతులందరూ",
  
  // Soil testing
  "మట్టి పరీక్ష": "🔬 మట్టి పరీక్ష:\n• ఎక్కడ: దగ్గరలోని కృషి విజ్ఞాన కేంద్రం (KVK)\n• ఖర్చు: ₹100-200/నమూనా\n• సమయం: 7-15 రోజులు\n• ఏమి తెలుస్తుంది: pH, N, P, K, సూక్ష్మపోషకాలు\n\nనమూనా ఎలా తీయాలి:\n1. పొలంలో 6-8 చోట్ల తీయండి\n2. లోతు: 15-20 సెంటీమీటర్లు\n3. అన్నీ కలిపి 500గ్రా పంపండి",
  
  // Weather
  "వాతావరణం": "🌤️ వాతావరణ ఆధారిత సలహాలు:\n• 35°C పైన ఉంటే: ఉదయం/సాయంత్రం నీరు పెట్టండి\n• వర్షం వస్తుందంటే: పురుగుమందు స్ప్రే వద్దు\n• అధిక తేమ ఉంటే: శిలీంధ్ర వ్యాధులు చూసుకోండి\n• చలి పడితే: నర్సరీని నేట్తో కప్పండి\n• గాలి ఎక్కువ: పురుగుమందు స్ప్రే చేయకండి\n\n📱 IMD వాతావరణ: mausam.imd.gov.in",
  
  // Default response in Telugu
  "default_te": "🌱 నేను మీకు ఈ విషయాల గురించి సహాయం చేయగలను:\n• మట్టి రకానికి అనుకూలమైన పంటలు\n• పంట వ్యాధులు మరియు చికిత్స\n• పురుగుమందుల మోతాదు\n• నీటిపారుదల షెడ్యూల్\n• మండి ధరలు మరియు అమ్మే సలహా\n• ఎకరాకు లాభం లెక్క\n• ప్రభుత్వ పథకాలు\n\nఒక నిర్దిష్ట ప్రశ్న అడగండి:\n'నల్ల నేలకు పంట ఏది?'\n'టమాటా తెగులు ఎలా తగ్గించాలి?'\n'మిర్చి ధర ఎంత?'"
};

const QUICK_REPLIES_EN = [
  { text: '🌱 Crop for black soil', msg: 'Best crop for black soil' },
  { text: '🍅 Tomato disease', msg: 'Tomato disease treatment' },
  { text: '💧 Wheat irrigation', msg: 'Wheat water requirement' },
  { text: '💰 Rice profit', msg: 'Rice profit per acre' },
  { text: '🐛 Aphid treatment', msg: 'Aphid pesticide treatment' },
  { text: '🏛️ Govt schemes', msg: 'Government schemes for farmers' }
]

const QUICK_REPLIES_TE = [
  { text: '🌱 నల్ల నేల పంటలు', msg: 'నల్ల నేలకు పంట ఏది?' },
  { text: '🍅 టమాటా వ్యాధి', msg: 'టమాటా తెగులు చికిత్స ఏమిటి?' },
  { text: '💧 గోధుమ నీటిపారుదల', msg: 'గోధుమకు నీరు ఎంత అవసరం?' },
  { text: '💰 వరి లాభం', msg: 'వరి ఎకరాకు లాభం ఎంత?' },
  { text: '🐛 పురుగుమందు', msg: 'పురుగుమందు ఏది వాడాలి?' },
  { text: '🏛️ పథకాలు', msg: 'ప్రభుత్వ పథకాలు ఏమిటి?' }
]

export default function Advisory() {
  const [lang, setLang] = useState(localStorage.getItem('krishiai-lang') || 'en')
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      text: (localStorage.getItem('krishiai-lang') || 'en') === 'te' 
        ? "నమస్కారం! 🙏 నేను KrishiAI. మీకు పంటలు, వ్యాధులు, పురుగుమందులు, నీటిపారుదల మరియు మార్కెట్ ధరల గురించి సహాయం చేస్తాను. మీ ప్రశ్న అడగండి!"
        : "Namaste! 🙏 I'm KrishiAI Assistant. Ask me anything about farming, crops, soil, pests, or market prices.\n\nనమస్కారం! తెలుగులో మాట్లాడాలంటే పై 'తెలుగు' బటన్ నొక్కండి. 🇮🇳" 
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const scrollRef = useRef(null)
  const { addToast } = useToast()

  const handleSetLanguage = (newLang) => {
    setLang(newLang)
    localStorage.setItem('krishiai-lang', newLang)
    const toastMsg = newLang === 'te' ? '🇮🇳 తెలుగు భాష ఎంచుకోబడింది!' : '🇬🇧 English language selected!'
    addToast(toastMsg, 'success')
    
    // Add welcome message in new language
    if (newLang === 'te') {
      setMessages(prev => [...prev, { type: 'bot', text: 'నమస్కారం! 🙏 నేను KrishiAI. మీకు పంటలు, వ్యాధులు, పురుగుమందులు, నీటిపారుదల మరియు మార్కెట్ ధరల గురించి సహాయం చేస్తాను. మీ ప్రశ్న అడగండి!' }])
    } else {
      setMessages(prev => [...prev, { type: 'bot', text: "Namaste! 🙏 I'm KrishiAI Assistant. How can I help you today?" }])
    }
  }

  // 🔊 Text to Speech (TTS)
  const speak = (message) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const speech = new SpeechSynthesisUtterance(message)
    speech.lang = lang === 'te' ? 'te-IN' : 'en-US'
    speech.rate = 1.0
    window.speechSynthesis.speak(speech)
  }

  // 🎤 Speech to Text (STT)
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      addToast('Speech Recognition not supported in this browser 🚫', 'error')
      return
    }

    const recog = new SpeechRecognition()
    recog.lang = lang === 'te' ? 'te-IN' : 'en-IN'
    recog.interimResults = false
    recog.maxAlternatives = 1

    recog.onstart = () => {
      setIsListening(true)
      const listeningMsg = lang === 'te' ? '🎤 వింటున్నాను... తెలుగులో మాట్లాడండి' : '🎤 Listening... Speak now'
      addToast(listeningMsg, 'info')
    }
    recog.onend = () => setIsListening(false)
    recog.onerror = () => {
      setIsListening(false)
      const errorMsg = lang === 'te' ? 'వాయిస్ ఇన్పుట్ లో సమస్య వచ్చింది. మళ్ళీ ప్రయత్నించండి.' : 'Microphone error or permission denied.'
      addToast(errorMsg, 'error')
    }

    recog.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      if (transcript) {
        setInput(transcript)
        handleSend(transcript, true)
      }
    }

    recog.start()
  }

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ 
        top: scrollRef.current.scrollHeight, 
        behavior: 'smooth' 
      })
    }
  }, [messages, isLoading])

  const getTeluguResponse = (input) => {
    const lowerInput = input.toLowerCase().trim()
    for (const [keyword, response] of Object.entries(TELUGU_KB)) {
      if (keyword !== 'default_te' && lowerInput.includes(keyword)) {
        return response
      }
    }
    
    // Check for common Telugu words fallback
    if (lowerInput.includes('నమస్') || lowerInput.includes('హలో') || lowerInput.includes('hi')) {
      return TELUGU_KB['నమస్కారం']
    }
    if (lowerInput.includes('పంట') || lowerInput.includes('సాగు')) {
      return 'మీ మట్టి రకం చెప్పండి (నల్ల నేల/ఎర్ర నేల/ఇసుక నేల) — అనుకూలమైన పంటలు సూచిస్తాను! 🌱'
    }
    if (lowerInput.includes('వ్యాధి') || lowerInput.includes('జబ్బు') || lowerInput.includes('మచ్చ')) {
      return '🔍 వ్యాధి గుర్తింపు కోసం Image AI పేజీకి వెళ్ళి ఆకు ఫోటో అప్లోడ్ చేయండి. లేదా లక్షణాలు వివరించండి.'
    }
    if (lowerInput.includes('ధర') || lowerInput.includes('మండి') || lowerInput.includes('అమ్మ')) {
      return TELUGU_KB['మండి']
    }
    if (lowerInput.includes('నీరు') || lowerInput.includes('నీటి') || lowerInput.includes('పారుదల')) {
      return TELUGU_KB['నీరు']
    }
    if (lowerInput.includes('లాభ') || lowerInput.includes('ఆదాయ') || lowerInput.includes('సంపాదన')) {
      return TELUGU_KB['లాభం']
    }
    if (lowerInput.includes('ఎరువు') || lowerInput.includes('యూరియా') || lowerInput.includes('dap')) {
      return TELUGU_KB['ఎరువు']
    }
    if (lowerInput.includes('పురుగు') || lowerInput.includes('క్రిమి') || lowerInput.includes('పెస్ట్')) {
      return TELUGU_KB['పురుగులు']
    }
    if (lowerInput.includes('సబ్సిడీ') || lowerInput.includes('పథకం') || lowerInput.includes('ప్రభుత్వ')) {
      return TELUGU_KB['పథకాలు']
    }
    
    return TELUGU_KB['default_te']
  }

  const handleSend = async (text = input, fromVoice = false) => {
    const trimmedText = text.trim()
    if (!trimmedText || isLoading) return

    setMessages(prev => [...prev, { type: 'user', text: trimmedText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    setInput('')
    setIsLoading(true)

    try {
      let botResponseText = ''
      
      if (lang === 'te') {
        botResponseText = getTeluguResponse(trimmedText)
      } else {
        const response = await sendMessageToAI(trimmedText)
        botResponseText = response.text
      }
      
      const botMsg = { 
        type: 'bot', 
        text: botResponseText, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }
      
      setMessages(prev => [...prev, botMsg])
      addToast(lang === 'te' ? 'సందేశం పంపబడింది! 🌱' : 'Message sent! 🌱', 'success')
      
      if (fromVoice) speak(botResponseText)

    } catch (error) {
      addToast(lang === 'te' ? 'సర్వర్ కనెక్ట్ కావడం లేదు' : 'Failed to connect to AI server', 'error')
      setMessages(prev => [...prev, { type: 'bot', text: lang === 'te' ? '❌ సర్వర్ ఎర్రర్.' : '❌ Error connecting to server.' }])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    if (window.confirm(lang === 'te' ? "మీరు ఖచ్చితంగా చాట్ క్లియర్ చేయాలనుకుంటున్నారా?" : "Are you sure you want to clear the chat?")) {
      setMessages([{ 
        type: 'bot', 
        text: lang === 'te' 
          ? "నమస్కారం! 🙏 నేను KrishiAI. మీకు పంటలు, వ్యాధులు, పురుగుమందులు, నీటిపారుదల మరియు మార్కెట్ ధరల గురించి సహాయం చేస్తాను. మీ ప్రశ్న అడగండి!"
          : "Namaste! 🙏 I'm KrishiAI Assistant. Ask me anything about farming, crops, soil, pests, or market prices." 
      }])
      addToast(lang === 'te' ? 'చాట్ క్లియర్ చేయబడింది' : 'Chat cleared', 'info')
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    addToast(lang === 'te' ? 'క్లిప్‌బోర్డ్‌కు కాపీ చేయబడింది! 📋' : 'Copied to clipboard! 📋', 'success')
  }

  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, (_, p1) => `<strong>${p1}</strong>`)
      return <div key={i} dangerouslySetInnerHTML={{ __html: formattedLine || '&nbsp;' }} style={{ marginBottom: line ? 8 : 0 }} />
    })
  }

  const theme = {
    bgApp: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
    bgCard: '#ffffff',
    bgBotMsg: '#f3f4f6',
    textMain: '#111827',
    textSec: '#4b5563',
    border: 'var(--border)'
  }

  const currentQuickReplies = lang === 'te' ? QUICK_REPLIES_TE : QUICK_REPLIES_EN

  return (
    <div className="page-wrapper fade-in" style={{ display: 'flex', justifyContent: 'center', background: theme.bgApp, padding: '2rem 1rem', minHeight: 'calc(100vh - 68px)', transition: 'background 0.3s ease' }}>
      
      <div style={{
        width: '100%', maxWidth: '850px', display: 'flex', flexDirection: 'column',
        background: theme.bgCard, borderRadius: '24px',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)',
        border: `1px solid ${theme.border}`, overflow: 'hidden',
        height: '80vh', minHeight: '600px', transition: 'all 0.3s ease'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem', background: 'var(--gradient-primary)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: 'none'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>🤖</div>
            <div>
              <h1 style={{ fontWeight: 800, fontSize: '1.2rem', margin: 0, letterSpacing: '-0.02em', color: '#fff' }}>KrishiAI Assistant</h1>
              <div style={{ fontSize: '0.8rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <span style={{ width: 8, height: 8, background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 8px #4ade80' }} /> Online | {lang === 'te' ? 'ఏదైనా అడగండి' : 'Ask me anything'}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={clearChat} title={lang === 'te' ? 'చాట్ క్లియర్ చేయండి' : 'Clear Chat'} style={{
              background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer',
              width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s'
            }} onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.25)'} onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.15)'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} style={{
          flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', scrollbarWidth: 'thin'
        }}>
          {messages.map((m, i) => (
            <div key={i} className="slide-up" style={{
              alignSelf: m.type === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: 4
            }}>
              <div style={{
                padding: '1rem 1.25rem', borderRadius: 24, position: 'relative',
                fontSize: '0.95rem', lineHeight: 1.6,
                background: m.type === 'user' ? 'var(--primary)' : theme.bgBotMsg,
                color: m.type === 'user' ? '#fff' : theme.textMain,
                border: m.type === 'user' ? 'none' : `1px solid ${theme.border}`,
                borderBottomRightRadius: m.type === 'user' ? 6 : 24,
                borderBottomLeftRadius: m.type === 'user' ? 24 : 6,
                boxShadow: m.type === 'user' ? '0 10px 15px -3px rgba(34,197,94,0.25)' : '0 4px 6px -1px rgba(0,0,0,0.05)',
              }}>
                {formatText(m.text)}
                {m.type === 'bot' && (
                  <button onClick={() => copyToClipboard(m.text)} title={lang === 'te' ? 'కాపీ చేయండి' : 'Copy Reply'} style={{
                    position: 'absolute', bottom: -10, right: -10, background: '#fff', border: '1px solid var(--border)',
                    borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)', transition: '0.2s', zIndex: 10
                  }} className="hover-glow">
                    <span style={{ fontSize: '0.7rem' }}>📋</span>
                  </button>
                )}
              </div>
              {m.time && <div style={{ fontSize: '0.7rem', color: theme.textSec, textAlign: m.type === 'user' ? 'right' : 'left', margin: '0 8px' }}>{m.time}</div>}
              
              {/* Suggestions */}
              {m.type === 'bot' && !isLoading && i === messages.length - 1 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: '1rem' }}>
                  {currentQuickReplies.map(reply => (
                    <button key={reply.text} onClick={() => handleSend(reply.msg)} style={{
                      padding: '0.6rem 1rem', borderRadius: 20, fontSize: '0.85rem',
                      background: '#f0fdf4', border: '1px solid #bbf7d0', color: 'var(--primary-dark)',
                      fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                    }} onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 4px 10px rgba(34,197,94,0.1)' }} onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = 'none' }}>
                      {reply.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="fade-in" style={{ alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ padding: '1rem 1.25rem', borderRadius: 24, background: theme.bgBotMsg, border: `1px solid ${theme.border}`, borderBottomLeftRadius: 6, display: 'flex', alignItems: 'center', gap: 6, width: 80, height: 50 }}>
                {[0, 1, 2].map(i => <span key={i} style={{ width: 8, height: 8, background: 'var(--primary)', borderRadius: '50%', animation: `blink 1.4s infinite ${i * 0.2}s` }} />)}
              </div>
              <div style={{ fontSize: '0.75rem', color: theme.textSec, margin: '0 8px', fontStyle: 'italic' }}>{isListening ? (lang === 'te' ? 'వింటున్నాను...' : 'Listening...') : (lang === 'te' ? 'KrishiAI ఆలోచిస్తోంది...' : 'KrishiAI is typing...')}</div>
            </div>
          )}
        </div>

        {/* Language Selector Bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
          background: '#f0fdf4', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0'
        }}>
          <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>{lang === 'te' ? 'భాష:' : 'Language:'}</span>
          <button 
            type="button"
            onClick={() => handleSetLanguage('en')} 
            style={{
              padding: '4px 14px', borderRadius: '20px', 
              border: '1.5px solid #16a34a', 
              background: lang === 'en' ? '#16a34a' : 'white', 
              color: lang === 'en' ? 'white' : '#16a34a', 
              fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: '0.3s'
            }}
          >
            🇬🇧 English
          </button>
          <button 
            type="button"
            onClick={() => handleSetLanguage('te')} 
            style={{
              padding: '4px 14px', borderRadius: '20px', 
              border: '1.5px solid #16a34a', 
              background: lang === 'te' ? '#16a34a' : 'white', 
              color: lang === 'te' ? 'white' : '#16a34a', 
              fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: '0.3s'
            }}
          >
            🇮🇳 తెలుగు
          </button>
        </div>

        {/* Input Area */}
        <div style={{
          padding: '1.25rem 1.5rem', borderTop: `1px solid ${theme.border}`, background: theme.bgCard, display: 'flex', flexDirection: 'column', gap: 12
        }}>
          <form onSubmit={(e) => { e.preventDefault(); handleSend() }} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type="text" 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                placeholder={lang === 'te' ? 'మీ వ్యవసాయ ప్రశ్న టైప్ చేయండి...' : 'Message KrishiAI...'} 
                style={{
                  width: '100%', border: '2px solid #e5e7eb', borderRadius: 24, padding: '1rem 1.25rem', paddingRight: '3.5rem', fontSize: '1rem',
                  background: '#f9fafb', color: theme.textMain, outline: 'none', transition: 'all 0.3s ease',
                }} 
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 4px rgba(34,197,94,0.1)' }} 
                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#f9fafb'; e.target.style.boxShadow = 'none' }} 
              />
              
              <button 
                type="button" 
                onClick={startListening} 
                title={lang === 'te' ? 'తెలుగులో మాట్లాడండి' : 'Voice Dictation'} 
                style={{
                  position: 'absolute', right: 12, border: 'none', background: isListening ? '#fef2f2' : 'transparent',
                  color: isListening ? '#ef4444' : 'var(--text-muted)', cursor: 'pointer',
                  padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: isListening ? 'blink 1.5s infinite' : 'none', transition: '0.3s'
                }} 
                onMouseEnter={e => { if(!isListening) e.target.style.color = 'var(--primary)' }} 
                onMouseLeave={e => { if(!isListening) e.target.style.color = 'var(--text-muted)' }}
              >
                {isListening ? '🔴' : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>}
              </button>
            </div>
            <button type="submit" disabled={!input.trim() || isLoading} style={{
              width: 54, height: 54, borderRadius: '50%', border: 'none', background: '#16a34a',
              color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: !input.trim() || isLoading ? 'default' : 'pointer', flexShrink: 0,
              transition: '0.3s', boxShadow: !input.trim() || isLoading ? 'none' : '0 8px 16px rgba(34,197,94,0.3)'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: theme.textSec, marginTop: 4 }}>
            {lang === 'te' ? 'KrishiAI తప్పులు చేయవచ్చు. ముఖ్యమైన సమాచారాన్ని సరిచూసుకోండి.' : 'KrishiAI can make mistakes. Verify important farming information.'}
          </div>
        </div>
      </div>
    </div>
  )
}
