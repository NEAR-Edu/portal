import { PrismaClient } from '@prisma/client';
import sendgrid from '@sendgrid/mail'; // https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs
import { getNowUtc } from './time';
import { KeyValueStringPairs, ScheduledPopulatedEmail } from './types';

export const SESSION_URL_PLACEHOLDER = 'SESSION_URL_PLACEHOLDER';
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

function fillPlaceholders(originalValue: string, placeholders: KeyValueStringPairs): string {
  let cleaned = originalValue;
  Object.keys(placeholders).forEach((key) => {
    cleaned = cleaned.replaceAll(key, placeholders[key]);
  });
  return cleaned;
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

function populateSubjectAndBody(subject: string, html: string, scheduledPopulatedEmail: ScheduledPopulatedEmail) {
  const subjectPlaceholders: KeyValueStringPairs = {}; // ONEDAY
  const filledSubject = fillPlaceholders(subject, subjectPlaceholders);
  const bodyPlaceholders: KeyValueStringPairs = {};
  if (scheduledPopulatedEmail.sessionUrl) {
    // ONEDAY: If sessionUrl is not set, is there a Zoom API endpoint available for generating one? Then we would want to save it to the Airtable record too. https://marketplace.zoom.us/docs/api-reference/zoom-api/methods#operation/meetingCreate
    bodyPlaceholders[SESSION_URL_PLACEHOLDER] = scheduledPopulatedEmail.sessionUrl;
  }
  let filledHtml = fillPlaceholders(html, bodyPlaceholders);
  if (scheduledPopulatedEmail.surveyUrl) {
    const url = `${scheduledPopulatedEmail.surveyUrl}?user_email=${scheduledPopulatedEmail.user.email}`; // user_email is a special Slido parameter.
    filledHtml += `<p>Important: <strong><a href="${url}">answer our survey</a></strong> during the session.</p>`;
  }
  return { filledSubject, filledHtml };
}

export function sendEmailsNow(scheduledPopulatedEmails: ScheduledPopulatedEmail[]): string | null {
  const successes: string[] = [];
  const errors: KeyValueStringPairs = {};
  scheduledPopulatedEmails.forEach(async (scheduledPopulatedEmail: ScheduledPopulatedEmail) => {
    // ONEDAY: https://docs.sendgrid.com/for-developers/sending-email/substitution-tags from https://stackoverflow.com/a/35040850/470749
    const { id, user, subject, html, scheduledSendTimeUtc } = scheduledPopulatedEmail;
    const { filledSubject, filledHtml } = populateSubjectAndBody(subject, html, scheduledPopulatedEmail);
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
      const errorMsg = `Error when trying to send email with subject "${filledSubject}" to ${to} at ${scheduledSendTimeUtc}: ${error}`;
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
  }
  return null;
}

export async function scheduleEmail(scheduledSendTimeUtc: string, userId: string, subject: string, html: string, from: string, scheduleId: string) {
  const prisma = new PrismaClient();
  const data = {
    scheduledSendTimeUtc,
    userId,
    subject,
    html,
    from,
    scheduleId,
  };
  const result = await prisma.scheduledEmail.create({ data });
  return result;
}
