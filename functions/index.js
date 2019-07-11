const functions = require('firebase-functions');
const request = require('request-promise');

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer CBdA3jZc4jI8uXw+6ZY8LsKdlJztDmY/g+bm2WcQuejEhtC50IOaiVdqtkd1QoN99jEBX1rihMApJa0zoYH3XiiRavFjX0RPQO+4YiWFtaUtvC3zTbtay38WTIDvpUXBhG6/18Wzk395aT9o7EkQqwdB04t89/1O/w1cDnyilFU=`
};

exports.webhook = functions.https.onRequest((req, res) => {
  if (req.method === "POST") {
    let event = req.body.events[0]
    if (event.type === "message" && event.message.type === "text") {
      postToDialogflow(req);
    } else {
      reply(req);
    }
  }
  return res.status(200).send(req.method);
});

const reply = req => {
  return request.post({
    uri: `${LINE_MESSAGING_API}/reply`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: [
        {
          type: "text",
          text: JSON.stringify(req.body)
        }
      ]
    })
  });
};

const postToDialogflow = req => {
  req.headers.host = "bots.dialogflow.com";
  return request.post({
    uri: "https://bots.dialogflow.com/line/b5caab72-cf86-4c92-b655-3fa117e3de04/webhook",
    headers: req.headers,
    body: JSON.stringify(req.body)
  });
};