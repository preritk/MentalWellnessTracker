// English/Hindi string dictionaries and the translation helpers/hook.
import { useStore, type Language, type Mood } from './storage'

type Dict = Record<string, string>

const en: Dict = {
  'app.name': 'MindMitra',
  'app.tagline': 'a calm companion for your exam journey',

  // nav
  'nav.today': 'Today',
  'nav.journal': 'Quiet Page',
  'nav.patterns': 'Patterns',
  'nav.toolkit': 'Toolkit',
  'nav.settings': 'You & Privacy',
  'nav.help': 'I need help now',

  // common
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.continue': 'Continue',
  'common.back': 'Back',
  'common.done': 'Done',
  'common.skip': 'Skip',
  'common.close': 'Close',
  'common.optional': 'optional',

  // moods
  'mood.Drained': 'Drained',
  'mood.Low': 'Low',
  'mood.Okay': 'Okay',
  'mood.Steady': 'Steady',
  'mood.Bright': 'Bright',

  // phases (banner)
  'phase.general': 'Your space',
  'phase.prep': 'Preparation phase',
  'phase.exam-week': 'Exam week — be gentle with yourself',
  'phase.result-wait': 'Waiting for results',
  'phase.result-day': 'Result day — you’re not alone',

  // today
  'today.greeting': 'Hi {name}',
  'today.greetingPlain': 'Hi there',
  'today.checkInPrompt': 'Long day? Quick check-in.',
  'today.checkedIn': 'Checked in. Thank you for showing up for yourself.',
  'today.rightNow': 'Right now',
  'today.helpful': 'Did that help?',
  'today.yes': 'Yes',
  'today.no': 'Not really',
  'today.insight': 'A gentle pattern',
  'today.openExamMode': 'Open Exam Mode',
  'today.openResultMode': 'Open Result Mode',

  // check-in
  'checkin.title': 'How are you, really?',
  'checkin.about': 'What’s it about?',
  'checkin.intensity': 'How strong is it?',
  'checkin.note': 'Anything you want to add?',
  'checkin.notePlaceholder': 'A word or two, only if you want…',
  'checkin.same': 'Same as yesterday?',
  'checkin.sameBetter': 'A bit better',
  'checkin.sameSame': 'About the same',
  'checkin.sameWorse': 'A bit worse',
  'checkin.log': 'Log how I feel',

  // journal
  'journal.title': 'The Quiet Page',
  'journal.subtitle': 'A private space. This stays on your device.',
  'journal.guided': 'Guided',
  'journal.free': 'Free write',
  'journal.placeholder': 'Let it out…',
  'journal.keep': 'Keep this',
  'journal.burn': 'Let it go',
  'journal.burned': 'Let go. Nothing was saved.',
  'journal.saved': 'Saved to your private page.',
  'journal.letterTitle': 'A letter to result-day you',
  'journal.letterHint': 'Write something kind your future self can open on result day.',
  'journal.letterSeal': 'Seal until result day',
  'journal.letterPlaceholder': 'Dear future me…',
  'journal.history': 'Earlier entries',

  // patterns
  'patterns.title': 'Patterns',
  'patterns.subtitle': 'Noticing, not judging.',
  'patterns.river': 'Your mood over time',
  'patterns.triggers': 'What tends to set you off',
  'patterns.digest': 'This week',
  'patterns.empty': 'A few check-ins and your patterns will appear here.',
  'patterns.checkInDays': 'days you checked in',
  'patterns.bounceBack': 'avg days to bounce back',
  'patterns.trend.up': 'Trending a little brighter than last week.',
  'patterns.trend.down': 'A heavier week than last. That’s allowed.',
  'patterns.trend.flat': 'Holding steady this week.',
  'patterns.trend.new': 'Just getting started — no pressure.',

  // toolkit
  'toolkit.title': 'Toolkit',
  'toolkit.subtitle': 'Small things that help, sized for hard days.',
  'toolkit.breathe': 'Breathe with me',
  'toolkit.breatheIn': 'Breathe in',
  'toolkit.hold': 'Hold',
  'toolkit.breatheOut': 'Breathe out',
  'toolkit.start': 'Start',
  'toolkit.stop': 'Stop',
  'toolkit.minutes': 'min',

  // exam mode
  'exam.title': 'Exam Mode',
  'exam.subtitle': 'No ranks. No analysis. Just you, and the next breath.',
  'exam.anchor': 'You’ve prepared. Now you just show up.',
  'exam.between': 'Between papers reset',
  'exam.tonight': 'Tonight’s only job is rest.',

  // result mode
  'result.title': 'Result Mode',
  'result.before': 'Today might be big. You don’t have to face it alone.',
  'result.letter': 'Open your letter',
  'result.reveal': 'Ready to look?',
  'result.truth': 'What’s true regardless of this number?',
  'result.next24': 'The next 24 hours',
  'result.celebrate': 'However it landed — be gentle with yourself.',

  // settings
  'settings.title': 'You & Privacy',
  'settings.language': 'Language',
  'settings.darkMode': 'Dark mode',
  'settings.reducedMotion': 'Reduce motion',
  'settings.sharing': 'Share encouragement signals',
  'settings.sharingHint':
    'Off by default. Even when on, only “you checked in this week” — never your moods or journal.',
  'settings.seed': 'Load sample data (for demo)',
  'settings.seedClear': 'Clear sample data',
  'settings.export': 'Export my data (JSON)',
  'settings.delete': 'Delete everything',
  'settings.deleteConfirm':
    'This erases all your data on this device. This cannot be undone. Continue?',
  'settings.signout': 'Clear this device',
  'settings.privacyNote':
    'Everything you write lives only in this tab and is wiped when you close it. We have no server and no account.',

  // crisis
  'crisis.title': 'You deserve real support',
  'crisis.body':
    'If things feel like too much, please reach a person who can help. These lines are free, confidential, and open now.',
  'crisis.call': 'Call',
  'crisis.disclaimer':
    'MindMitra is a companion, not a doctor or a crisis service. In an emergency, call 112.',

  // onboarding
  'onb.welcome': 'Welcome',
  'onb.intro': 'A calm, private space to track how you feel through prep, exams, and results.',
  'onb.name': 'What should we call you?',
  'onb.namePlaceholder': 'First name or a nickname',
  'onb.exam': 'Which exam are you preparing for?',
  'onb.examDate': 'When is your exam? (optional)',
  'onb.resultDate': 'Result date, if you know it (optional)',
  'onb.isnt': 'What this is — and isn’t',
  'onb.isnt.private':
    'Private by default. No account, no server — your words stay in this tab and clear when you close it.',
  'onb.isnt.notParent': 'Not a parent or coaching dashboard. Nobody is watching you here.',
  'onb.isnt.notTherapy':
    'Not therapy or a diagnosis. A companion that helps you reflect and points you to real help when you need it.',
  'onb.tryFirst': 'Try a check-in',
  'onb.finish': 'Enter MindMitra',
}

const hi: Dict = {
  'app.name': 'MindMitra',
  'app.tagline': 'आपकी परीक्षा यात्रा का एक शांत साथी',

  'nav.today': 'आज',
  'nav.journal': 'शांत पन्ना',
  'nav.patterns': 'पैटर्न',
  'nav.toolkit': 'टूलकिट',
  'nav.settings': 'आप और निजता',
  'nav.help': 'मुझे अभी मदद चाहिए',

  'common.save': 'सेव करें',
  'common.cancel': 'रद्द करें',
  'common.continue': 'आगे बढ़ें',
  'common.back': 'पीछे',
  'common.done': 'हो गया',
  'common.skip': 'छोड़ें',
  'common.close': 'बंद करें',
  'common.optional': 'वैकल्पिक',

  'mood.Drained': 'थका हुआ',
  'mood.Low': 'उदास',
  'mood.Okay': 'ठीक-ठाक',
  'mood.Steady': 'स्थिर',
  'mood.Bright': 'खुशनुमा',

  'phase.general': 'आपकी जगह',
  'phase.prep': 'तैयारी का दौर',
  'phase.exam-week': 'परीक्षा सप्ताह — ख़ुद पर नरम रहें',
  'phase.result-wait': 'परिणाम का इंतज़ार',
  'phase.result-day': 'रिज़ल्ट का दिन — आप अकेले नहीं हैं',

  'today.greeting': 'नमस्ते {name}',
  'today.greetingPlain': 'नमस्ते',
  'today.checkInPrompt': 'लंबा दिन रहा? एक छोटा चेक-इन।',
  'today.checkedIn': 'चेक-इन हो गया। ख़ुद के लिए समय निकालने का शुक्रिया।',
  'today.rightNow': 'अभी के लिए',
  'today.helpful': 'क्या इससे मदद मिली?',
  'today.yes': 'हाँ',
  'today.no': 'ज़्यादा नहीं',
  'today.insight': 'एक नरम पैटर्न',
  'today.openExamMode': 'एग्ज़ाम मोड खोलें',
  'today.openResultMode': 'रिज़ल्ट मोड खोलें',

  'checkin.title': 'सच में, आप कैसे हैं?',
  'checkin.about': 'किस बारे में है?',
  'checkin.intensity': 'यह कितना तीव्र है?',
  'checkin.note': 'कुछ जोड़ना चाहेंगे?',
  'checkin.notePlaceholder': 'एक-दो शब्द, सिर्फ़ अगर आप चाहें…',
  'checkin.same': 'कल जैसा ही?',
  'checkin.sameBetter': 'थोड़ा बेहतर',
  'checkin.sameSame': 'लगभग वैसा ही',
  'checkin.sameWorse': 'थोड़ा ख़राब',
  'checkin.log': 'मैं कैसा महसूस कर रहा/रही हूँ, दर्ज करें',

  'journal.title': 'शांत पन्ना',
  'journal.subtitle': 'एक निजी जगह। यह आपके डिवाइस पर ही रहता है।',
  'journal.guided': 'मार्गदर्शित',
  'journal.free': 'खुलकर लिखें',
  'journal.placeholder': 'दिल की बात कहें…',
  'journal.keep': 'इसे रखें',
  'journal.burn': 'इसे जाने दें',
  'journal.burned': 'जाने दिया। कुछ भी सेव नहीं हुआ।',
  'journal.saved': 'आपके निजी पन्ने पर सेव हुआ।',
  'journal.letterTitle': 'रिज़ल्ट वाले आप के नाम एक चिट्ठी',
  'journal.letterHint': 'कुछ नरम लिखें जिसे आपका भविष्य रिज़ल्ट के दिन खोल सके।',
  'journal.letterSeal': 'रिज़ल्ट के दिन तक सील करें',
  'journal.letterPlaceholder': 'प्रिय भविष्य के मैं…',
  'journal.history': 'पुरानी प्रविष्टियाँ',

  'patterns.title': 'पैटर्न',
  'patterns.subtitle': 'देखना, आँकना नहीं।',
  'patterns.river': 'समय के साथ आपका मूड',
  'patterns.triggers': 'क्या चीज़ें आपको परेशान करती हैं',
  'patterns.digest': 'इस हफ़्ते',
  'patterns.empty': 'कुछ चेक-इन के बाद आपके पैटर्न यहाँ दिखेंगे।',
  'patterns.checkInDays': 'दिन आपने चेक-इन किया',
  'patterns.bounceBack': 'संभलने में औसत दिन',
  'patterns.trend.up': 'पिछले हफ़्ते से थोड़ा बेहतर।',
  'patterns.trend.down': 'पिछले हफ़्ते से भारी हफ़्ता। यह ठीक है।',
  'patterns.trend.flat': 'इस हफ़्ते स्थिर बने रहे।',
  'patterns.trend.new': 'अभी शुरुआत है — कोई दबाव नहीं।',

  'toolkit.title': 'टूलकिट',
  'toolkit.subtitle': 'छोटी चीज़ें जो मदद करती हैं, मुश्किल दिनों के लिए।',
  'toolkit.breathe': 'मेरे साथ साँस लें',
  'toolkit.breatheIn': 'साँस लें',
  'toolkit.hold': 'रोकें',
  'toolkit.breatheOut': 'साँस छोड़ें',
  'toolkit.start': 'शुरू करें',
  'toolkit.stop': 'रोकें',
  'toolkit.minutes': 'मिनट',

  'exam.title': 'एग्ज़ाम मोड',
  'exam.subtitle': 'कोई रैंक नहीं। कोई विश्लेषण नहीं। बस आप, और अगली साँस।',
  'exam.anchor': 'आपने तैयारी की है। अब बस पहुँच जाइए।',
  'exam.between': 'पेपरों के बीच रीसेट',
  'exam.tonight': 'आज रात का काम बस आराम है।',

  'result.title': 'रिज़ल्ट मोड',
  'result.before': 'आज बड़ा दिन हो सकता है। आपको अकेले इसका सामना नहीं करना।',
  'result.letter': 'अपनी चिट्ठी खोलें',
  'result.reveal': 'देखने के लिए तैयार?',
  'result.truth': 'इस अंक से परे क्या सच है?',
  'result.next24': 'अगले 24 घंटे',
  'result.celebrate': 'जो भी हुआ — ख़ुद पर नरम रहें।',

  'settings.title': 'आप और निजता',
  'settings.language': 'भाषा',
  'settings.darkMode': 'डार्क मोड',
  'settings.reducedMotion': 'एनिमेशन कम करें',
  'settings.sharing': 'प्रोत्साहन संकेत साझा करें',
  'settings.sharingHint':
    'डिफ़ॉल्ट रूप से बंद। चालू होने पर भी सिर्फ़ “इस हफ़्ते चेक-इन किया” — कभी आपका मूड या जर्नल नहीं।',
  'settings.seed': 'सैंपल डेटा लोड करें (डेमो के लिए)',
  'settings.seedClear': 'सैंपल डेटा हटाएँ',
  'settings.export': 'मेरा डेटा एक्सपोर्ट करें (JSON)',
  'settings.delete': 'सब कुछ हटाएँ',
  'settings.deleteConfirm':
    'यह इस डिवाइस का सारा डेटा मिटा देगा। इसे वापस नहीं लाया जा सकता। जारी रखें?',
  'settings.signout': 'यह डिवाइस साफ़ करें',
  'settings.privacyNote':
    'आप जो भी लिखते हैं वह सिर्फ़ इसी टैब में रहता है और टैब बंद करते ही मिट जाता है। न कोई सर्वर, न कोई अकाउंट।',

  'crisis.title': 'आप असली सहारे के हक़दार हैं',
  'crisis.body':
    'अगर सब कुछ बहुत ज़्यादा लग रहा है, तो किसी ऐसे इंसान से बात करें जो मदद कर सके। ये लाइनें मुफ़्त, गोपनीय और अभी उपलब्ध हैं।',
  'crisis.call': 'कॉल करें',
  'crisis.disclaimer':
    'MindMitra एक साथी है, डॉक्टर या क्राइसिस सेवा नहीं। आपात स्थिति में 112 पर कॉल करें।',

  'onb.welcome': 'स्वागत है',
  'onb.intro': 'तैयारी, परीक्षा और परिणाम के दौरान अपनी भावनाओं को सहेजने की एक शांत, निजी जगह।',
  'onb.name': 'हम आपको क्या कहकर बुलाएँ?',
  'onb.namePlaceholder': 'पहला नाम या उपनाम',
  'onb.exam': 'आप किस परीक्षा की तैयारी कर रहे हैं?',
  'onb.examDate': 'आपकी परीक्षा कब है? (वैकल्पिक)',
  'onb.resultDate': 'रिज़ल्ट की तारीख़, अगर पता हो (वैकल्पिक)',
  'onb.isnt': 'यह क्या है — और क्या नहीं',
  'onb.isnt.private':
    'डिफ़ॉल्ट रूप से निजी। न अकाउंट, न सर्वर — आपके शब्द इसी टैब में रहते हैं और बंद करते ही मिट जाते हैं।',
  'onb.isnt.notParent': 'न माता-पिता, न कोचिंग का डैशबोर्ड। यहाँ कोई आप पर नज़र नहीं रखता।',
  'onb.isnt.notTherapy':
    'न थेरेपी, न निदान। एक साथी जो सोचने में मदद करता है और ज़रूरत पर असली मदद की ओर इशारा करता है।',
  'onb.tryFirst': 'एक चेक-इन आज़माएँ',
  'onb.finish': 'MindMitra में प्रवेश करें',
}

const DICTS: Record<Language, Dict> = { en, hi }

/** Translate a key; interpolate {name}-style params; fall back to English then the key. */
export function translate(lang: Language, key: string, params?: Record<string, string>): string {
  let s = DICTS[lang][key] ?? DICTS.en[key] ?? key
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
    }
  }
  return s
}

/** A bound translation function: takes a key and optional interpolation params. */
export type TFn = (key: string, params?: Record<string, string>) => string

/** Hook bound to the current language in the store. */
export function useT(): { t: TFn; lang: Language } {
  const [store] = useStore()
  const lang = store.profile.language
  const t: TFn = (key, params) => translate(lang, key, params)
  return { t, lang }
}

/** Localized display label for a mood. */
export function moodLabel(lang: Language, mood: Mood): string {
  return translate(lang, `mood.${mood}`)
}
