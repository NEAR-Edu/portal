import { PrismaClient } from '@prisma/client';
import sendgrid from '@sendgrid/mail'; // https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs
import { getNowUtc } from './time';
import { ScheduledEmailWithRecipient } from './types';

const API_KEY = process.env.SENDGRID_API_KEY || '';
export const defaultSender = process.env.EMAIL_FROM || '';
const techTeamEmailAddress = process.env.TECH_TEAM_EMAIL_ADDRESS || '';

sendgrid.setApiKey(API_KEY);

export function sendEmailNow(to: string, subject: string, html: string, from = defaultSender) {
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

function sendErrorReport(subject: string, html: string) {
  return sendgrid.send({
    to: techTeamEmailAddress,
    from: defaultSender,
    subject,
    html,
  });
}

function fillPlaceholders(originalValue: string, placeholders: { [key: string]: string }): string {
  return originalValue; // ONEDAY
}

async function markEmailsAsSent(scheduledEmailIds: string[], actualSendTimeUtc: string) {
  const prisma = new PrismaClient();
  const result = await prisma.scheduledEmail.updateMany({
    // https://www.prisma.io/docs/concepts/components/prisma-client/crud#update-multiple-records
    where: {
      id: { in: scheduledEmailIds }, // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#in
    },
    data: { actualSendTimeUtc },
  });
  console.log('markEmailsAsSent saved', { result });
}

// eslint-disable-next-line max-lines-per-function
export function sendEmailsNow(scheduledEmailsWithRecipient: ScheduledEmailWithRecipient[]): string | null {
  const successes: string[] = [];
  const errors = {} as { [key: string]: string };
  scheduledEmailsWithRecipient.forEach(async (scheduledEmailWithRecipient: ScheduledEmailWithRecipient) => {
    const { id, user, subject, html, scheduledSendTimeUtc } = scheduledEmailWithRecipient;
    const subjectPlaceholders = {}; // ONEDAY
    const filledSubject = fillPlaceholders(subject, subjectPlaceholders);
    const bodyPlaceholders = {}; // ONEDAY
    const filledHtml = fillPlaceholders(html, bodyPlaceholders);
    const to = user.email as string;
    try {
      sendgrid.send({
        to,
        from: defaultSender,
        subject: filledSubject,
        html: filledHtml,
      });
      successes.push(id);
    } catch (error) {
      const errorMsg = `Error when trying to send email with subject "${subject}" to ${to} at ${scheduledSendTimeUtc}: ${error}`;
      console.error(errorMsg);
      errors[id] = errorMsg;
    }
  });
  markEmailsAsSent(successes, getNowUtc());
  const numErrors = Object.keys(errors).length;
  if (numErrors > 0) {
    const subject = 'Errors during sendEmailsNow';
    sendErrorReport(subject, JSON.stringify(errors));
    return `${numErrors} errors occurred while sending emails. ${techTeamEmailAddress} received an email with details.`;
  } else {
    return null;
  }
}

export async function scheduleEmail(scheduledSendTimeUtc: string, userId: string, subject: string, html: string, from: string) {
  const prisma = new PrismaClient();
  const data = {
    scheduledSendTimeUtc,
    userId,
    subject,
    html,
    from,
  };
  const result = await prisma.scheduledEmail.create({ data });
  return result;
}
