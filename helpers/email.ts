import sendgrid from '@sendgrid/mail'; // https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs

const API_KEY = process.env.SENDGRID_API_KEY || '';
const defaultSender = process.env.EMAIL_FROM || '';

sendgrid.setApiKey(API_KEY);

function sendEmailNow(to: string, subject: string, html: string, from = defaultSender) {
  // TODO: Ensure that this is async (i.e. that this SendGrid HTTP request is not blocking).
  try {
    sendgrid.send({
      to,
      from,
      subject,
      html,
    });
  } catch (error) {
    console.error('sendEmailNow failed.', error);
  }
}

export default sendEmailNow;
