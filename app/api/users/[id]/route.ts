import { NextRequest, NextResponse } from 'next/server'
import { removeInvite } from '../../../../lib/users'

export async function DELETE(
  _request: NextRequest,
  context: any,
) {
  removeInvite(context.params.id)
  return NextResponse.json({ success: true })
}
