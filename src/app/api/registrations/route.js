export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Registration from '../../../models/Registration';

export async function GET() {
  try {
    await dbConnect();
    const registrations = await Registration.find({}).sort({ createdAt: -1 });
    return NextResponse.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    if (!data.fullName || !data.email || !data.phone || !data.program || !data.degreeLevel) {
      return NextResponse.json({ error: 'Please provide all required fields.' }, { status: 400 });
    }

    // Only one registration is allowed per email address and per phone number.
    const email = String(data.email).trim();
    const phoneDigits = String(data.phone).replace(/\D/g, '');
    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const duplicateConditions = [{ email: new RegExp(`^\\s*${escapeRegex(email)}\\s*$`, 'i') }];
    if (phoneDigits) {
      // Match the same digits regardless of spaces, dashes, brackets or a leading "+".
      duplicateConditions.push({ phone: new RegExp(`^\\D*${phoneDigits.split('').join('\\D*')}\\D*$`) });
    }
    const existing = await Registration.findOne({ $or: duplicateConditions }).lean();
    if (existing) {
      return NextResponse.json(
        { error: 'You have already registered with this email or phone number.', alreadyRegistered: true },
        { status: 409 }
      );
    }

    const registration = new Registration(data);
    await registration.save();
    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error('Error saving registration:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
