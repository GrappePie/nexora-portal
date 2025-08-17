import { NextRequest, NextResponse } from 'next/server'
import { renameDevice, revokeDevice } from '../../../../lib/devices'

export async function PUT(
  request: NextRequest,
  context: any,
) {
  const { name } = await request.json()
  if (!name) {
    return NextResponse.json({ message: 'Nombre requerido' }, { status: 400 })
  }
  const device = renameDevice(context.params.id, name)
  if (!device) {
    return NextResponse.json({ message: 'No encontrado' }, { status: 404 })
  }
  return NextResponse.json(device)
}

export async function DELETE(
  _request: NextRequest,
  context: any,
) {
  revokeDevice(context.params.id)
  return NextResponse.json({ success: true })
}
