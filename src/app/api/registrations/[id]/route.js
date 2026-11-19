import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Registration from '../../../../models/Registration';

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const registration = await Registration.findByIdAndDelete(id);

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    console.error('Error deleting registration:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
