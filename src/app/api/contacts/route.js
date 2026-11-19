export const dynamic = 'force-dynamic';
import { NextResponse, after } from 'next/server';
import dbConnect from '../../../lib/db';
import Contact from '../../../models/Contact';
import { buildCrmLead, sendLeadToCrm } from '../../../lib/crm';

export async function GET() {
  try {
    await dbConnect();
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    if (!data.fullName || !data.email || !data.phone || !data.message || !data.subject) {
      return NextResponse.json({ error: 'Please provide all required fields.' }, { status: 400 });
    }
    
    const contact = new Contact(data);
    await contact.save();

    // Also send the lead to the CRM, after the response is returned to the visitor.
    // Used by the Contact page form, the Contact popup and the Course Finder.
    after(() => sendLeadToCrm(buildCrmLead({
      formName: contact.subject === 'Course Finder Inquiry' ? 'Course Finder' : 'Contact Form',
      fullName: contact.fullName,
      email: contact.email,
      phone: contact.phone,
      extraFields: [
        ['Query Category', contact.interestCategory],
        ['Subject', contact.subject],
        ['Message Details', contact.message],
      ],
    })));

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error('Error saving contact:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
