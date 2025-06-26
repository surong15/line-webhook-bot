const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('LINE Bot Webhook Server is running!');
});

app.post('/webhook', (req, res) => {
  const events = req.body.events || [];
  
  events.forEach(event => {
    if (event.source && event.source.userId) {
      console.log('User ID:', event.source.userId);
      // 在這裡處理 User ID
    }
  });
  
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
