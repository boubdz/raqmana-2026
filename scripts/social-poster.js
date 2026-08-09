const https = require('https');

async function postToFacebook(message, link) {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!pageId || !token) {
    console.log('Skipping Facebook post: FACEBOOK_PAGE_ID or FACEBOOK_PAGE_ACCESS_TOKEN not set.');
    return false;
  }
  
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      message: message,
      link: link
    });
    
    const options = {
      hostname: 'graph.facebook.com',
      path: `/v20.0/${pageId}/feed`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`Facebook response code: ${res.statusCode}`);
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode === 200 || res.statusCode === 201) {
            console.log('Successfully posted to Facebook Page!');
            resolve(true);
          } else {
            console.error('Facebook Graph API error:', parsed.error?.message || data);
            resolve(false);
          }
        } catch (e) {
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      console.error('Facebook network request failed:', err.message);
      resolve(false);
    });
    
    req.write(payload);
    req.end();
  });
}

async function postToTelegram(text) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) {
    console.log('Skipping Telegram post: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set.');
    return false;
  }
  
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown',
      disable_web_page_preview: false
    });
    
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${botToken}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`Telegram response code: ${res.statusCode}`);
        if (res.statusCode === 200) {
          console.log('Successfully posted to Telegram Channel!');
          resolve(true);
        } else {
          console.error('Telegram API error:', data);
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      console.error('Telegram network request failed:', err.message);
      resolve(false);
    });
    
    req.write(payload);
    req.end();
  });
}

async function shareArticleOnSocials(slug, title, introduction) {
  console.log(`\n📢 Preparing social media shares for: "${title}"...`);
  const articleUrl = `https://www.raqmanadz.com/articles/${slug}`;
  
  // Format message for Facebook
  const fbMessage = `🔥 دليل خدمات جديد على منصة رقمنة الجزائر 🇩🇿\n\n📌 "${title}"\n\n💡 ${introduction.substring(0, 180)}...\n\n👇 تصفح الدليل الشامل والروابط الرسمية مباشرة من هنا:`;
  
  // Format message for Telegram
  const tgText = `🔥 *دليل خدمات جديد على منصة رقمنة الجزائر 🇩🇿*\n\n📌 *${title}*\n\n💡 ${introduction.substring(0, 180)}...\n\n👉 *[اضغط هنا لقراءة الدليل والروابط الرسمية المباشرة](${articleUrl})*`;
  
  await postToFacebook(fbMessage, articleUrl);
  await postToTelegram(tgText);
}

module.exports = { shareArticleOnSocials };
