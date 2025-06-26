export default function handler(req, res) {
  res.status(200).json({
    message: 'LINE Bot Webhook Server is running!',
    usage: '請將 LINE webhook 指向 /api/webhook'
  });
} 