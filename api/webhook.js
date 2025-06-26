import { addUserId } from './userStore.js';

export default async function handler(req, res) {
  console.log('收到請求:', req.method);
  
  // 只接受 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    console.log('請求內容:', JSON.stringify(body, null, 2));

    // 檢查是否為 LINE 事件
    if (!body.events) {
      return res.status(200).json({ message: 'No events' });
    }

    // 處理每個事件
    for (const event of body.events) {
      await handleEvent(event);
    }

    res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.error('處理錯誤:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleEvent(event) {
  console.log('處理事件:', event.type);

  // 只處理文字訊息
  if (event.type !== 'message' || event.message.type !== 'text') {
    return;
  }

  const userId = event.source.userId;
  addUserId(userId);
  const messageText = event.message.text;
  const replyToken = event.replyToken;

  console.log(`用戶 ${userId} 說: ${messageText}`);
}