const { SMTPServer } = require("smtp-server");
const { MailParser } = require("mailparser");

const SMTP_PORT = process.env.SMTP_PORT || '9425';
const SMTP_USER = process.env.SMTP_USER || 'dev';
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || 'test123';
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3000';

const onParserData = async (data, session) => {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      body: JSON.stringify({
        data,
        session,
      }),
    });

    console.log('onParserData', response);
  } catch (error) {
    console.error('onParserData', error);
  }
}

const onAuth = (auth, session, callback) => {
  if (auth.method !== 'PLAIN') {
    console.log('auth', auth);
    return callback(new Error("Invalid authentication method"));
  }

  if (auth.username !== SMTP_USER || auth.password !== SMTP_PASSWORD) {
    console.log('auth', auth);
    return callback(new Error("Invalid username or password"));
  }

  callback(null, { user: auth.username });
}

const onData = (stream, session, callback) => {
  const parser = new MailParser();

  parser.on('data', (data) => onParserData(data, session));
  stream.pipe(parser);

  stream.on('end', () => {
    callback();
  });
}

const port = parseInt(SMTP_PORT);
const options = {
  onAuth,
  onData,
  logger: true,
  secure: false, // Disable TLS/SSL
  allowInsecureAuth: true, // Allow authentication without TLS
}
const server = new SMTPServer(options);

server.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
