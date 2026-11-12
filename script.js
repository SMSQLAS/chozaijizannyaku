"use strict";

const QUIZ_TITLE = "調剤時残薬調整加算クイズ";
const SHEET_NAME = "調剤時残薬";
// 以前の自家製剤加算クイズで使用されていたウェブアプリURL。
// 現在の運用先と異なる場合は、実際に使用しているURLに変更してください。
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxCGQdVIRdGYjocIAdfrMA_gUYtxovXCQBj4IDBKXuUZTP7BKx5z0YVRRHIheUsRTI/exec";

const yesNo = () => [
  { value: "yes", label: "算定できる" },
  { value: "no", label: "算定できない" }
];

// ユーザー提供のWord「クイズ【調剤時残薬調整加算】」の順序・正解・解説に準拠。
// 医療制度に関する説明の校訂・最新通知との照合は別途実施してください。
const QUESTIONS = [
  {
    category: "算定可否／2択",
    text: "疑義照会の結果、8種類の内服薬各30日分の内、3種類を処方削除した場合。\n\n調剤時残薬調整加算を算定できるか？",
    options: yesNo(), answer: "yes",
    explanation: "減数調剤を行うときに、調剤する医薬品の調剤日数または数量を「0」にすることはできません。つまり処方そのものを完全に削除する対応は、本加算は認められません。ただし、疑義照会を行い、医師の確認・指示により処方削除が行われた場合は算定できる。"
  },
  {
    category: "算定可否／2択",
    text: "タグリッソ錠80mg（がん治療薬：資料記載の薬価18,540円/錠）\n14日分 → 10日分に疑義照会して変更した場合。\n\n調剤時残薬調整加算を算定できるか？",
    options: yesNo(), answer: "yes",
    explanation: "経済的負担の軽減：「がん化学療法薬等の高額な医薬品の患者負担軽減のため」。"
  },
  {
    category: "算定可否／2択",
    text: "ロスバスタチン錠2.5mg　隔日服用\n30日分 → 25日分に疑義照会して変更した場合。\n\n調剤時残薬調整加算を算定できるか？",
    options: yesNo(), answer: "no",
    explanation: "隔日投与等の場合は、実際の服用日数で判断します。"
  },
  {
    category: "算定可否／2択",
    text: "ブロチゾラム錠0.25mg　不眠時（1日1回まで）\n20回分 → 10回分に疑義照会して変更した場合。\n\n調剤時残薬調整加算を算定できるか？",
    options: yesNo(), answer: "yes",
    explanation: "頓服薬については、実際に服薬する日数で換算し、7回分以上減らした場合に「7日分以上相当」として算定可能です。"
  },
  {
    category: "算定可否／2択",
    text: "マンジャロ皮下注5mgアテオス0.5mL　週1回1キットを皮下注\n3キット → 2キットに疑義照会して変更した場合。\n\n調剤時残薬調整加算を算定できるか？",
    options: yesNo(), answer: "yes",
    explanation: "注射薬については、処方箋で指示されている1日使用量に鑑みて、7日分以上の使用量に相当する残薬で判断する為、算定可能です。"
  },
  {
    category: "算定可否／2択",
    text: "センノシド錠12mg　透析日（月・水・金）寝る前\n12日分 → 8日分に疑義照会して変更した場合。\n\n調剤時残薬調整加算を算定できるか？",
    options: yesNo(), answer: "no",
    explanation: "内服薬の場合は、実際の服用日数で判断します。"
  },
  {
    category: "算定可否／2択",
    text: "アレンドロン酸錠35mg「サワイ」　週1回・起床時服用\n4日分 → 2日分に疑義照会して変更した場合。\n\n調剤時残薬調整加算を算定できるか？",
    options: yesNo(), answer: "yes",
    explanation: "6日分以下相当の残薬調整をしたときは、その理由を摘要欄に記載することとされており、記載できる理由の1つに「投与間隔が長い薬剤のため」があります。この「投与間隔が長い」の具体的な基準が「6日間以上」と疑義解釈で示されています。週1回投与＝投与間隔7日は、この6日間以上に該当します。したがって、算定可能です。"
  },
  {
    category: "算定可否／2択",
    text: "以下の3剤を疑義照会して変更した場合。\n\nアムロジピンOD(5)　朝食後　30日分 → 24日分\nエチゾラム(0.5)　朝夕食後　30日分 → 25日分\nフルスルチアミン(25)　毎食後　30日分 → 21日分\n\n調剤時残薬調整加算を算定できるか？",
    options: yesNo(), answer: "yes",
    explanation: "アムロジピン・エチゾラムは6日分以下ですが、フルスルチアミンが7日分以上の調剤日数の変更に該当するため、算定できる。"
  },
  {
    category: "算定可否／2択",
    text: "A病院からアムロジピン(10)が30日分処方された。\nしかし、B病院からも処方されていることが判明し、A病院に疑義照会を行い、処方日数が30日分から5日分に変更となった。\n\nこの場合、調剤時残薬調整加算は算定できるか？",
    options: yesNo(), answer: "no",
    explanation: "残薬調整を目的とした変更ではなく、重複投薬の防止を目的とした処方変更であるため。"
  },
  {
    category: "調剤管理料との組み合わせ／4択",
    text: "処方日数21日分を、残薬調整により14日分に変更した。\n\n調剤時残薬調整加算は算定できる？ 調剤管理料はどの区分？",
    options: [
      { value: "A", label: "算定可／調剤管理料1のロ" },
      { value: "B", label: "算定不可／調剤管理料1のロ" },
      { value: "C", label: "算定可／調剤管理料1のイ" },
      { value: "D", label: "算定不可／調剤管理料1のイ" }
    ], answer: "A",
    explanation: "算定可（7日分以上の変更）／調剤管理料1のロ（10点）。\n理由：変更後も27日以下であり、28日以上の区分には該当しない。"
  },
  {
    category: "調剤管理料との組み合わせ／4択",
    text: "処方日数28日分を、残薬調整により25日分に変更した。\n\n調剤時残薬調整加算は算定できる？ 調剤管理料はどの区分？",
    options: [
      { value: "A", label: "算定可／調剤管理料1のロ" },
      { value: "B", label: "算定不可／調剤管理料1のロ" },
      { value: "C", label: "算定可／調剤管理料1のイ" },
      { value: "D", label: "算定不可／調剤管理料1のイ" }
    ], answer: "D",
    explanation: "算定不可（6日分以下の変更）／調剤管理料1のイ（60点）。\n理由：調剤時残薬調整加算は原則7日分以上の変更が必要。ただし、6日分以下の特例を満たせば算定可能。調剤管理料は調整前の28日分を基準にする。"
  },
  {
    category: "調剤管理料との組み合わせ／4択",
    text: "処方日数35日分を、残薬調整により25日分に変更した。\n\n調剤時残薬調整加算は算定できる？ 調剤管理料はどの区分？",
    options: [
      { value: "A", label: "算定可／調剤管理料1のロ" },
      { value: "B", label: "算定不可／調剤管理料1のロ" },
      { value: "C", label: "算定可／調剤管理料1のイ" },
      { value: "D", label: "算定不可／調剤管理料1のイ" }
    ], answer: "C",
    explanation: "算定可（10日分の変更）／調剤管理料1のイ（60点）。\n理由：調剤管理料は調整前の35日分を基準にする。"
  },
  {
    category: "加算区分／3択",
    text: "「調剤時残薬調整加算」で30点算定できるのはどんなとき？",
    options: [
      { value: "A", label: "在宅患者の場合" },
      { value: "B", label: "かかりつけ薬剤師が対応した場合" },
      { value: "C", label: "外来の患者で、かかりつけ薬剤師ではない薬剤師が対応した場合" }
    ], answer: "C",
    explanation: "外来の患者で、かかりつけ薬剤師ではない薬剤師が対応した場合。"
  },
  {
    category: "調剤管理料／2択",
    text: "残薬調整により処方日数が28日から14日になった場合、調剤管理料は？\n\n【処方例】\nRp1）マグミット錠330mg　3錠\n　分3　毎食後　28日分\n　↓ 残薬調整で14日分に変更\nRp1）マグミット錠330mg　3錠\n　分3　毎食後　14日分",
    options: [
      { value: "A", label: "1のイ　28日分以上（60点）" },
      { value: "B", label: "1のロ　それ以外（10点）" }
    ], answer: "A",
    explanation: "元々の処方は28日分ですが、残薬調整を行ったことで14日分になり、14日分であれば1のロ（10点）を算定するところです。ただし残薬調整によって日数が変わった場合は、残薬調整前の日数で算定します。残薬調整前は28日分だったため、調剤管理料1のイ（60点）を算定できます。"
  },
  {
    category: "併算定／4択",
    text: "「調剤する薬剤を減量した上で保険医療機関に情報提供」の欄にその旨の記載がある処方箋を受け付け、減数調剤を行った。\n残薬が生じている理由を薬学的に分析した上で、処方箋を発行した保険医療機関に対して文書により情報提供を行った。\n\n服薬情報等提供料1と調剤時残薬調整加算は、どちらを算定できるか？",
    options: [
      { value: "A", label: "服薬情報等提供料1のみ算定できる" },
      { value: "B", label: "調剤時残薬調整加算のみ算定できる" },
      { value: "C", label: "両方算定できる" },
      { value: "D", label: "いずれも算定できない" }
    ], answer: "C",
    explanation: "両方算定できる。\n出典：厚生労働省「疑義解釈資料の送付について（その2）」問10。回答は『いずれも可能』。"
  }
];

let current = 0;
let score = 0;
let answered = false;
let startedAt = 0;
const answerLog = [];
const $ = (id) => document.getElementById(id);

function showScreen(screenId) {
  for (const screen of document.querySelectorAll(".screen")) {
    const active = screen.id === screenId;
    screen.classList.toggle("active", active);
    screen.setAttribute("aria-hidden", String(!active));
  }
  window.scrollTo({ top: 0, behavior: "instant" });
}

function startQuiz() {
  current = 0;
  score = 0;
  answered = false;
  startedAt = Date.now();
  answerLog.length = 0;
  showScreen("quizScreen");
  renderQuestion();
}

function renderQuestion() {
  answered = false;
  const q = QUESTIONS[current];
  $("questionHeading").textContent = `問題${current + 1}`;
  $("questionText").textContent = q.text;
  $("questionCategory").textContent = q.category;
  $("progressText").textContent = `問題${current + 1} / ${QUESTIONS.length}`;
  $("scoreText").textContent = `正解 ${score}`;
  $("progressBar").style.width = `${(current / QUESTIONS.length) * 100}%`;
  $("progressBar").parentElement.setAttribute("aria-valuenow", String(current));
  $("feedback").className = "feedback hidden";
  $("feedback").textContent = "";
  $("nextButton").classList.add("hidden");
  const container = $("answerButtons");
  container.replaceChildren();
  q.options.forEach((option, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "answer-button";
    const symbol = document.createElement("span");
    symbol.className = "answer-letter";
    symbol.textContent = q.options.length === 2 && q.options[0].value === "yes" ? (idx === 0 ? "○" : "×") : String.fromCharCode(65 + idx);
    const label = document.createElement("span");
    label.textContent = option.label;
    btn.append(symbol, label);
    btn.addEventListener("click", () => answerQuestion(option.value));
    container.append(btn);
  });
}

function answerQuestion(value) {
  if (answered) return;
  answered = true;
  const q = QUESTIONS[current];
  const correct = value === q.answer;
  const chosen = q.options.find(o => o.value === value);
  const right = q.options.find(o => o.value === q.answer);
  if (correct) score++;
  answerLog.push({
    number: current + 1,
    selectedValue: value,
    selected: chosen.label,
    correct: right.label,
    isCorrect: correct
  });
  for (const [index, btn] of [...$("answerButtons").children].entries()) {
    btn.disabled = true;
    const option = q.options[index];
    if (option.value === q.answer) btn.classList.add("correct-choice");
    if (option.value === value && !correct) btn.classList.add("wrong-choice");
  }
  $("scoreText").textContent = `正解 ${score}`;
  $("progressBar").style.width = `${((current + 1) / QUESTIONS.length) * 100}%`;
  $("progressBar").parentElement.setAttribute("aria-valuenow", String(current + 1));
  const fb = $("feedback");
  fb.className = `feedback ${correct ? "correct" : "incorrect"}`;
  fb.replaceChildren();
  const title = document.createElement("div");
  title.className = "feedback-title";
  title.textContent = correct ? "⭕ 正解！" : "❌ 不正解";
  const answerLabel = document.createElement("div");
  answerLabel.className = "correct-answer";
  answerLabel.textContent = `正解：${right.label}`;
  const explanation = document.createElement("div");
  explanation.textContent = q.explanation;
  fb.append(title, answerLabel, explanation);
  $("nextButton").textContent = current === QUESTIONS.length - 1 ? "結果を見る" : "次の問題へ";
  $("nextButton").classList.remove("hidden");
}

function goNext() {
  if (!answered) return;
  if (current + 1 < QUESTIONS.length) {
    current++;
    renderQuestion();
    window.scrollTo({top:0,behavior:"instant"});
  } else {
    showResult();
  }
}

function showResult() {
  showScreen("resultScreen");
  const wrong = answerLog.filter(x => !x.isCorrect).map(x => `問題${x.number}`);
  $("resultScore").textContent = `${score} / ${QUESTIONS.length} 点`;
  $("resultDetail").textContent = wrong.length ? `不正解：${wrong.join("・")}` : "全問正解！";
  $("resultForm").reset();
  $("formError").classList.add("hidden");
  $("sendStatus").classList.add("hidden");
  $("sendStatus").textContent = "";
  $("sendButton").disabled = false;
  $("sendButton").textContent = "結果を送信する";
  $("retryButton").disabled = true;
}

function buildPayload() {
  const wrong = answerLog.filter(x => !x.isCorrect).map(x => `問題${x.number}`);
  const difficulty = document.querySelector('input[name="difficulty"]:checked')?.value || "";
  const storeName = $("storeName").value.trim();
  const name = $("userName").value.trim();
  return {
    timestamp: new Date().toISOString(),
    quizTitle: QUIZ_TITLE,
    quizName: QUIZ_TITLE,
    quiz: QUIZ_TITLE,
    sheetName: SHEET_NAME,
    storeName,
    store: storeName,
    name,
    userName: name,
    difficulty,
    score: `${score}/${QUESTIONS.length}`,
    scoreNumber: score,
    total: QUESTIONS.length,
    percent: Math.round((score / QUESTIONS.length) * 100),
    answers: wrong.length ? wrong.join("、") : "なし",
    wrongAnswers: wrong.length ? wrong.join("、") : "なし",
    answerDetail: answerLog.map(x => `問題${x.number}:${x.selected}（${x.isCorrect ? "正解" : "不正解"}）`).join("｜"),
    elapsedSeconds: Math.round((Date.now() - startedAt) / 1000)
  };
}

async function submitResult(event) {
  event.preventDefault();
  const data = buildPayload();
  const formError = $("formError");
  if (!data.storeName || !data.name || !data.difficulty) {
    formError.textContent = "店舗名・名前・難易度をすべて入力してください。";
    formError.classList.remove("hidden");
    return;
  }
  formError.classList.add("hidden");
  if (!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(WEB_APP_URL)) {
    $("sendStatus").textContent = "送信先URLが未設定です。script.js の WEB_APP_URL を確認してください。";
    $("sendStatus").classList.remove("hidden");
    return;
  }
  $("sendButton").disabled = true;
  $("sendButton").textContent = "送信中…";
  $("retryButton").disabled = true;
  $("sendStatus").textContent = "送信処理中です…";
  $("sendStatus").classList.remove("hidden");
  try {
    // GASのWebアプリへのクロスオリジンPOST。no-corsでは応答本文を確認できません。
    await fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {"Content-Type":"text/plain;charset=utf-8"},
      body: JSON.stringify(data)
    });
    $("sendStatus").textContent = "✅ 送信リクエストが完了しました。記録の反映はスプレッドシートの「調剤時残薬」タブで確認してください。";
    $("sendButton").textContent = "送信処理済み";
    $("retryButton").disabled = false;
  } catch (error) {
    console.error("Quiz result submission failed", error);
    $("sendStatus").textContent = "送信に失敗しました。通信状況とApps ScriptのURL・公開設定をご確認ください。";
    $("sendButton").disabled = false;
    $("sendButton").textContent = "結果を再送信する";
    $("retryButton").disabled = true;
  }
}

$("startButton").addEventListener("click", startQuiz);
$("nextButton").addEventListener("click", goNext);
$("resultForm").addEventListener("submit", submitResult);
$("retryButton").addEventListener("click", startQuiz);
