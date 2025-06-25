// api/webhook.js - Vercel API 端點
export default async function handler(req, res) {
  // 只接受 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const events = req.body.events || [];
    console.log('收到 LINE 事件:', JSON.stringify(events, null, 2));

    // 處理每個事件
    for (const event of events) {
      await handleEvent(event);
    }

    res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.error('處理 webhook 錯誤:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// 處理 LINE 事件
async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return;
  }

  const userId = event.source.userId;
  const messageText = event.message.text;
  const replyToken = event.replyToken;

  console.log(`用戶 ${userId} 說: ${messageText}`);

  // 根據用戶訊息回覆
  let replyMessage;

  switch (messageText) {
    case '查詢我的用戶ID':
      replyMessage = createUserIDMessage(userId);
      break;
    case '查看我的個人資料':
      replyMessage = await createProfileMessage(userId);
      break;
    case '還有其他推薦嗎？':
      replyMessage = createMoreFoodMessage();
      break;
    case '幫助說明':
      replyMessage = createHelpMessage();
      break;
    default:
      replyMessage = createDefaultMessage();
  }

  // 發送回覆
  await replyToUser(replyToken, replyMessage);
}

// 建立用戶ID回覆訊息
function createUserIDMessage(userId) {
  return {
    type: 'flex',
    altText: '你的 LINE 用戶ID 資訊',
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [{
          type: 'text',
          text: '🆔 你的用戶資訊',
          weight: 'bold',
          color: '#ffffff',
          size: 'lg'
        }],
        paddingAll: '15px',
        backgroundColor: '#4F46E5'
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '以下是你的 LINE 用戶資訊：',
            color: '#666666',
            size: 'md',
            margin: 'md'
          },
          {
            type: 'separator',
            margin: 'xl'
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'xl',
            spacing: 'lg',
            contents: [
              {
                type: 'box',
                layout: 'vertical',
                spacing: 'sm',
                contents: [
                  {
                    type: 'text',
                    text: '🆔 用戶ID',
                    color: '#3B82F6',
                    weight: 'bold',
                    size: 'sm'
                  },
                  {
                    type: 'text',
                    text: userId,
                    wrap: true,
                    color: '#333333',
                    size: 'xs'
                  }
                ]
              }
            ]
          },
          {
            type: 'text',
            text: '請安全保存你的用戶ID，勿分享給不明人士 🔒',
            wrap: true,
            color: '#EF4444',
            size: 'xs',
            margin: 'xl'
          }
        ]
      }
    }
  };
}

// 建立個人資料回覆訊息
async function createProfileMessage(userId) {
  try {
    // 這裡你需要呼叫 LINE API 取得用戶資料
    // 實際使用時需要設定 LINE Channel Access Token
    const profile = {
      displayName: '用戶',
      userId: userId,
      language: 'zh-Hant'
    };

    return {
      type: 'flex',
      altText: '你的個人資料',
      contents: {
        type: 'bubble',
        header: {
          type: 'box',
          layout: 'vertical',
          contents: [{
            type: 'text',
            text: '📊 個人資料',
            weight: 'bold',
            color: '#ffffff'
          }],
          backgroundColor: '#10B981'
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: `顯示名稱: ${profile.displayName}`,
              margin: 'md'
            },
            {
              type: 'text',
              text: `用戶ID: ${profile.userId}`,
              wrap: true,
              margin: 'md'
            },
            {
              type: 'text',
              text: `語言: ${profile.language}`,
              margin: 'md'
            }
          ]
        }
      }
    };
  } catch (error) {
    console.error('取得用戶資料錯誤:', error);
    return createErrorMessage();
  }
}

// 建立更多美食推薦訊息
function createMoreFoodMessage() {
  return {
    type: 'flex',
    altText: '更多美食選擇推薦',
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [{
          type: 'text',
          text: '🍽️ 更多美食推薦',
          weight: 'bold',
          color: '#ffffff'
        }],
        backgroundColor: '#4CAF50'
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '更多美味選擇給你！🎉',
            color: '#666666',
            margin: 'md'
          },
          {
            type: 'separator',
            margin: 'lg'
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            spacing: 'md',
            contents: [
              {
                type: 'box',
                layout: 'baseline',
                spacing: 'sm',
                contents: [
                  { type: 'text', text: '🍣', size: 'xl', flex: 1 },
                  { type: 'text', text: '壽司 - 新鮮美味', size: 'md', flex: 4, color: '#333333' }
                ]
              },
              {
                type: 'box',
                layout: 'baseline',
                spacing: 'sm',
                contents: [
                  { type: 'text', text: '🌲', size: 'xl', flex: 1 },
                  { type: 'text', text: '燒烤 - 香噴噴烤肉', size: 'md', flex: 4, color: '#333333' }
                ]
              },
              {
                type: 'box',
                layout: 'baseline',
                spacing: 'sm',
                contents: [
                  { type: 'text', text: '🍛', size: 'xl', flex: 1 },
                  { type: 'text', text: '咖哩 - 家常好滋味', size: 'md', flex: 4, color: '#333333' }
                ]
              }
            ]
          }
        ]
      }
    }
  };
}

// 建立幫助訊息
function createHelpMessage() {
  return {
    type: 'text',
    text: `🤖 LINE Bot 使用說明

可用指令：
• 查詢我的用戶ID - 取得你的用戶ID
• 查看我的個人資料 - 查看個人資訊
• 還有其他推薦嗎？ - 獲得更多推薦
• 幫助說明 - 顯示此說明

直接輸入任何文字都會收到回覆！`
  };
}

// 建立預設回覆訊息
function createDefaultMessage() {
  return {
    type: 'text',
    text: `你好！我收到了你的訊息 😊

試試這些指令：
• 查詢我的用戶ID
• 查看我的個人資料
• 幫助說明

或者直接跟我聊天！`
  };
}

// 建立錯誤訊息
function createErrorMessage() {
  return {
    type: 'text',
    text: '抱歉，處理你的請求時發生錯誤，請稍後再試 😅'
  };
}

// 回覆用戶訊息
async function replyToUser(replyToken, message) {
  const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  
  if (!LINE_CHANNEL_ACCESS_TOKEN) {
    console.error('缺少 LINE Channel Access Token');
    return;
  }

  try {
    const response = await fetch('https://api.line.me/v2/bot/message/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        replyToken: replyToken,
        messages: [message]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('LINE API 錯誤:', error);
    } else {
      console.log('成功回覆用戶');
    }
  } catch (error) {
    console.error('發送訊息錯誤:', error);
  }
}
