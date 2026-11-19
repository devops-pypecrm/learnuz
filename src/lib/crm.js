import dbConnect from './db';
import IntegrationSettings from '../models/IntegrationSettings';

const CRM_TIMEOUT_MS = 10000;

/**
 * Builds a CRM lead from a website form submission.
 * Fields that match the CRM Leads API are sent as-is; every other form field is
 * written into `message` as "Label: answer" lines, using the labels shown on the form.
 *
 * @param {object} p
 * @param {string} p.formName   Name of the website form the lead came from
 * @param {string} p.fullName
 * @param {string} p.email
 * @param {string} p.phone
 * @param {Array<[string, any]>} p.extraFields  [label, answer] pairs for non-matching fields
 */
export function buildCrmLead({ formName, fullName, email, phone, extraFields = [] }) {
  const nameParts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
  const firstName = nameParts.shift() || '';
  const lastName = nameParts.join(' ');

  const lines = [`Form: ${formName}`];
  for (const [label, answer] of extraFields) {
    if (answer === undefined || answer === null || String(answer).trim() === '') continue;
    lines.push(`${label}: ${String(answer).trim()}`);
  }

  const lead = {
    firstName,
    email: email ? String(email).trim() : undefined,
    phone: phone ? String(phone).trim() : undefined,
    message: lines.join('\n'),
    source: 'website',
  };
  if (lastName) lead.lastName = lastName;
  return lead;
}

/**
 * Sends a lead to the CRM configured on the admin Integration page.
 * Never throws: a CRM failure must not affect the website form, which has already saved the lead to the database.
 */
export async function sendLeadToCrm(lead) {
  try {
    await dbConnect();
    const settings = await IntegrationSettings.findOne({}).lean();
    if (!settings?.crmApiKey || !settings?.crmEndpointUrl) {
      return; // CRM not configured yet — the lead is only stored in the database.
    }
    if (!lead.firstName || (!lead.email && !lead.phone)) {
      console.warn('CRM lead skipped: missing first name, or both email and phone.');
      return;
    }

    const res = await fetch(settings.crmEndpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // pypecrm reads the key from the X-API-KEY header (it rejects "Authorization: Bearer").
        'X-API-KEY': settings.crmApiKey,
      },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(CRM_TIMEOUT_MS),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error(`CRM rejected lead (HTTP ${res.status}):`, body.slice(0, 500));
    } else {
      console.log(`Lead sent to CRM (HTTP ${res.status})`);
    }
  } catch (error) {
    console.error('Error sending lead to CRM:', error);
  }
}
