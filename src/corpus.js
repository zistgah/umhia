/* Copyright © 2026 Abhishek Choudhary. SPDX-License-Identifier: GPL-3.0-or-later */
/** Original demonstration texts. Not redistributed third-party corpora. */
export const FIXTURES = {
  english: {
    language: "en", script: "Latn", license: "CC0-1.0", title: "UMHIA English fixture",
    text: "the keyboard carries letters and the programmer still needs braces parentheses brackets and operators. a good layout keeps punctuation near the hands. the quick brown fox jumps over the lazy dog while functions return values and loops continue."
  },
  kannada: {
    language: "kn", script: "Knda", license: "CC0-1.0", title: "UMHIA Kannada fixture",
    text: "ಕನ್ನಡ ಅಕ್ಷರಗಳು ಕೈಯಿಂದ ಬರೆಯುವ ಭಾಷೆ. ಸರಳ ವಾಕ್ಯಗಳು ಪದಗಳನ್ನು ಜೋಡಿಸುತ್ತವೆ. ಕನ್ನಡದಲ್ಲಿ ಸ್ವರಗಳು ಮತ್ತು ವ್ಯಂಜನಗಳು ಸೇರಿ ಗುಚ್ಛಗಳಾಗುತ್ತವೆ. ಇದು ಪರೀಕ್ಷಾ ಪಠ್ಯ ಮಾತ್ರ."
  },
  hindi: {
    language: "hi", script: "Deva", license: "CC0-1.0", title: "UMHIA Hindi fixture",
    text: "हिन्दी एक भाषा है और देवनागरी उसकी लिपि है। सरल वाक्य शब्दों को जोड़ते हैं। स्वर और व्यंजन मिलकर मात्राएँ बनाते हैं। यह केवल परीक्षण पाठ है।"
  },
  sanskrit: {
    language: "sa", script: "Deva", license: "CC0-1.0", title: "UMHIA Sanskrit fixture",
    text: "संस्कृतभाषायां शब्दाः वाक्यानि रचयन्ति। अकारः इकारः उकारः स्वराः सन्ति। ककारः खकारः गकारः व्यञ्जनानि सन्ति। एषः परीक्षणपाठः एव।"
  },
  bengali: {
    language: "bn", script: "Beng", license: "CC0-1.0", title: "UMHIA Bengali fixture",
    text: "বাংলা একটি ভাষা। সহজ বাক্য শব্দ জোড়ে। স্বর আর ব্যঞ্জন মিলে যুক্তাক্ষর হয়। এটি শুধু পরীক্ষার লেখা।"
  },
  tamil: {
    language: "ta", script: "Taml", license: "CC0-1.0", title: "UMHIA Tamil fixture",
    text: "தமிழ் ஒரு மொழி. எளிய வாக்கியங்கள் சொற்களை இணைக்கும். உயிர் மெய்யுடன் சேர்ந்து உருவாகும். இது சோதனை உரை மட்டும்."
  },
  telugu: {
    language: "te", script: "Telu", license: "CC0-1.0", title: "UMHIA Telugu fixture",
    text: "తెలుగు ఒక భాష. సరళ వాక్యాలు పదాలను కలుపుతాయి. అచ్చులు హల్లులతో కలిసి అక్షరాలు అవుతాయి. ఇది పరీక్షా పాఠం మాత్రమే."
  },
  malayalam: {
    language: "ml", script: "Mlym", license: "CC0-1.0", title: "UMHIA Malayalam fixture",
    text: "മലയാളം ഒരു ഭാഷയാണ്. ലളിത വാക്യങ്ങൾ വാക്കുകൾ ചേർക്കുന്നു. സ്വരങ്ങൾ വ്യഞ്ജനങ്ങളോട് ചേരുന്നു. ഇത് പരീക്ഷണ വാചകം മാത്രം."
  },
  gujarati: {
    language: "gu", script: "Gujr", license: "CC0-1.0", title: "UMHIA Gujarati fixture",
    text: "ગુજરાતી એક ભાષા છે. સરળ વાક્યો શબ્દો જોડે છે. સ્વર અને વ્યંજન મળી અક્ષર બને છે. આ ફક્ત પરીક્ષણ લખાણ છે."
  },
  gurmukhi: {
    language: "pa", script: "Guru", license: "CC0-1.0", title: "UMHIA Gurmukhi fixture",
    text: "ਪੰਜਾਬੀ ਇੱਕ ਭਾਸ਼ਾ ਹੈ। ਸਰਲ ਵਾਕ ਸ਼ਬਦ ਜੋੜਦੇ ਹਨ। ਸਵਰ ਅਤੇ ਵਿਅੰਜਨ ਮਿਲ ਕੇ ਅੱਖਰ ਬਣਦੇ ਹਨ। ਇਹ ਸਿਰਫ਼ ਟੈਸਟ ਲਿਖਤ ਹੈ।"
  },
  arabic: {
    language: "ar", script: "Arab", license: "CC0-1.0", title: "UMHIA Arabic fixture",
    text: "العربية لغة تكتب من اليمين. الجملة البسيطة تجمع الكلمات. هذا نص اختبار فقط وليس مدونة."
  },
  persian: {
    language: "fa", script: "Arab", license: "CC0-1.0", title: "UMHIA Persian fixture",
    text: "فارسی یک زبان است و خط آن عربی‌تبار است. جمله ساده واژه‌ها را کنار هم می‌گذارد. این فقط متن آزمون است."
  },
  urdu: {
    language: "ur", script: "Arab", license: "CC0-1.0", title: "UMHIA Urdu fixture",
    text: "اردو ایک زبان ہے اور اس کا رسم الخط نستعلیق ہے۔ سادہ جملے الفاظ جوڑتے ہیں۔ یہ صرف آزمائشی متن ہے۔"
  },
  greek: {
    language: "el", script: "Grek", license: "CC0-1.0", title: "UMHIA Greek fixture",
    text: "η ελληνικη γλωσσα γραφεται με το ελληνικο αλφαβητο. μια απλη προταση ενωνει λεξεις. αυτο ειναι μονο κειμενο δοκιμης."
  },
  hebrew: {
    language: "he", script: "Hebr", license: "CC0-1.0", title: "UMHIA Hebrew fixture",
    text: "עברית נכתבת מימין לשמאל. משפט פשוט מחבר מילים. זהו טקסט בדיקה בלבד."
  },
  cyrillic: {
    language: "ru", script: "Cyrl", license: "CC0-1.0", title: "UMHIA Cyrillic fixture",
    text: "русский язык использует кириллицу. простое предложение соединяет слова. это только испытательный текст."
  }
};

export const WIKI = {
  en: "en", kn: "kn", hi: "hi", sa: "sa", bn: "bn", ta: "ta", te: "te", ml: "ml",
  gu: "gu", pa: "pa", ar: "ar", fa: "fa", ur: "ur", el: "el", he: "he", ru: "ru"
};

export function fixtureRecord(name) {
  const row = FIXTURES[name];
  if (!row) throw new Error(`no fixture: ${name}`);
  return {
    provider: "fixture",
    url: `fixture://${name}`,
    repository: "umhia-fixtures",
    title: row.title,
    language: row.language,
    script: row.script,
    dateAccessed: "2026-10-06",
    license: row.license,
    domain: "demonstration",
    provenance: "Original text written for this project. Not a third-party corpus.",
    text: row.text,
    redistribution: "allowed"
  };
}

/** Phase 1 live provider. Other catalogs are named plugins, not required implementations. */
export async function wikipediaSearch(languageCode, query) {
  const host = WIKI[languageCode] || languageCode;
  const url = `https://${host}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=5&format=json&origin=*`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`wikipedia search failed: ${res.status}`);
  const data = await res.json();
  return (data.query?.search || []).map((hit) => ({
    provider: "wikipedia",
    url: `https://${host}.wikipedia.org/wiki/${encodeURIComponent(hit.title.replace(/ /g, "_"))}`,
    title: hit.title,
    language: languageCode,
    script: null,
    license: "CC BY-SA 4.0",
    redistribution: "forbidden-in-repo",
    provenance: "Wikimedia API search hit. Extracts may be fetched locally. Do not commit article text.",
    snippetIsNotCorpus: true,
    snippet: hit.snippet?.replace(/<[^>]+>/g, "") || ""
  }));
}

export async function wikipediaExtract(languageCode, title) {
  const host = WIKI[languageCode] || languageCode;
  const url = `https://${host}.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&titles=${encodeURIComponent(title)}&format=json&origin=*`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`wikipedia extract failed: ${res.status}`);
  const data = await res.json();
  const pages = Object.values(data.query?.pages || {});
  const page = pages[0];
  return {
    provider: "wikipedia",
    url: `https://${host}.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`,
    title,
    language: languageCode,
    license: "CC BY-SA 4.0",
    redistribution: "forbidden-in-repo",
    provenance: "Local analysis only. Article text must not be packaged.",
    text: (page?.extract || "").slice(0, 8000),
    dateAccessed: new Date().toISOString().slice(0, 10)
  };
}

export const OPTIONAL_PROVIDERS = [
  "wikisource", "gutenberg", "internet-archive", "opus", "leipzig",
  "universal-dependencies", "oscar", "common-voice-metadata", "huggingface", "cldr"
];
