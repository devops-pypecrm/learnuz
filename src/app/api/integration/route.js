export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import IntegrationSettings from '../../../models/IntegrationSettings';

// The saved API key is never sent back to the browser — only whether one is set and its last 4 characters.
// (The admin API has no server-side login check yet, so returning the key would make it public.)
function toPublic(settings) {
  const key = settings?.crmApiKey || '';
  return {
    crmEndpointUrl: settings?.crmEndpointUrl || '',
    hasApiKey: Boolean(key),
    apiKeyLast4: key ? key.slice(-4) : '',
  };
}

export async function GET() {
  try {
    await dbConnect();
    const settings = await IntegrationSettings.findOne({}).lean();
    return NextResponse.json(toPublic(settings));
  } catch (error) {
    console.error('Error fetching integration settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();

    const endpoint = typeof data.crmEndpointUrl === 'string' ? data.crmEndpointUrl.trim() : undefined;
    if (endpoint) {
      try {
        const u = new URL(endpoint);
        if (u.protocol !== 'https:' && u.protocol !== 'http:') throw new Error();
      } catch {
        return NextResponse.json({ error: 'Please enter a valid CRM endpoint URL.' }, { status: 400 });
      }
    }

    let settings = await IntegrationSettings.findOne({});
    if (!settings) settings = new IntegrationSettings({});

    if (endpoint !== undefined) settings.crmEndpointUrl = endpoint;
    // An empty API key field means "keep the current key".
    if (typeof data.crmApiKey === 'string' && data.crmApiKey.trim()) {
      settings.crmApiKey = data.crmApiKey.trim();
    }

    await settings.save();
    return NextResponse.json(toPublic(settings));
  } catch (error) {
    console.error('Error saving integration settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
