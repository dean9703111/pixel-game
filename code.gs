function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("題目");
  const data = sheet.getDataRange().getValues();
  // Remove header
  data.shift();
  
  // data structure: [id, question, A, B, C, D, answer]
  // We need to map it to object
  const questions = data.map((row, index) => ({
    id: row[0],
    question: row[1],
    options: [row[2], row[3], row[4], row[5]],
    answer: row[6] // Note: In a real secure app, we might not want to send the answer to frontend, but for this simple app it's easier to validate on frontend or we can validate on backend. 
                   // However, the requirement says "成績計算：將作答結果傳送到 Google Apps Script 計算成績", so we should probably NOT send answers and validate on backend.
                   // BUT, for a smoother UI experience without loading states on every answer, sending answers is common in simple games.
                   // Let's stick to the requirement: "將作答結果傳送到 Google Apps Script 計算成績".
                   // So we will NOT send the answer key to the client.
  }));

  // Randomly select N questions
  const N = parseInt(e.parameter.count || 5);
  const shuffled = questions.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, N).map(q => ({
    id: q.id,
    question: q.question,
    options: q.options
  }));

  return ContentService.createTextOutput(JSON.stringify(selected))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const userId = data.userId;
  const userAnswers = data.answers; // { questionId: "A", ... }
  
  const qSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("題目");
  const qData = qSheet.getDataRange().getValues();
  qData.shift(); // remove header
  
  let score = 0;
  let correctCount = 0;
  
  // Create a map for quick lookup
  const answerKey = {};
  qData.forEach(row => {
    answerKey[row[0]] = row[6]; // ID is at index 0, Answer is at index 6
  });
  
  // Calculate score
  for (const [qId, ans] of Object.entries(userAnswers)) {
    if (answerKey[qId] === ans) {
      score += 10; // Assuming 10 points per question, or we can just count correct answers
      correctCount++;
    }
  }
  
  // Record to "回答" sheet
  const aSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("回答");
  const aData = aSheet.getDataRange().getValues();
  let rowIndex = -1;
  
  // Find existing user
  for (let i = 1; i < aData.length; i++) {
    if (aData[i][0] == userId) {
      rowIndex = i + 1; // 1-based index for getRange
      break;
    }
  }
  
  const now = new Date();
  
  if (rowIndex > 0) {
    // Update existing user
    const range = aSheet.getRange(rowIndex, 1, 1, 7);
    const rowValues = range.getValues()[0];
    
    const currentPlayCount = rowValues[1] + 1;
    const currentTotalScore = rowValues[2] + score;
    const currentMaxScore = Math.max(rowValues[3], score);
    const firstClearScore = rowValues[4]; // Don't update
    // "花了幾次通關" - this is ambiguous. Let's assume it means how many tries until first clear? 
    // Or just total tries? The requirement says "若同 ID 已通關過，後續分數不覆蓋，僅在同列增加闖關次數"
    // Let's just update play count.
    
    // Check if passed
    const passThreshold = data.passThreshold || 3; // Default to 3 if not provided
    const passed = correctCount >= passThreshold;
    
    let newFirstClearScore = firstClearScore;
    let triesToClear = rowValues[5];
    
    // If passed and not yet cleared (or firstClearScore is empty/0)
    if (passed && (firstClearScore === "" || firstClearScore === 0)) {
         newFirstClearScore = score;
         triesToClear = currentPlayCount;
    }

    aSheet.getRange(rowIndex, 2, 1, 6).setValues([[
      currentPlayCount,
      currentTotalScore,
      currentMaxScore,
      newFirstClearScore,
      triesToClear,
      now
    ]]);
    
  } else {
    // New user
    // Check if passed for new user too
    const passThreshold = data.passThreshold || 3;
    const passed = correctCount >= passThreshold;
    
    const firstClearScore = passed ? score : "";
    const triesToClear = passed ? 1 : "";

    aSheet.appendRow([
      userId,
      1, // Play count
      score, // Total score
      score, // Max score
      firstClearScore, // First clear score
      triesToClear, // Tries to clear
      now
    ]);
  }
  
  // Prepare details for frontend review
  const details = [];
  for (const [qId, ans] of Object.entries(userAnswers)) {
    details.push({
      id: qId,
      userAnswer: ans,
      correctAnswer: answerKey[qId],
      isCorrect: answerKey[qId] === ans
    });
  }

  return ContentService.createTextOutput(JSON.stringify({
    score: score,
    correctCount: correctCount,
    totalQuestions: Object.keys(userAnswers).length,
    details: details
  })).setMimeType(ContentService.MimeType.JSON);
}
