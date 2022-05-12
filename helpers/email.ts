import sendgrid from '@sendgrid/mail'; // https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs

const API_KEY = process.env.SENDGRID_API_KEY || '';
const defaultSender = process.env.EMAIL_FROM || '';

sendgrid.setApiKey(API_KEY);

async function sendEmailNow(to: string, subject: string, html: string, from = defaultSender) {
  try {
    await sendgrid.send({
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
