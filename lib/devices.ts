export interface Device {
  id: string
  name: string
}

let devices: Device[] = [
  { id: 'dev1', name: 'Teléfono' },
  { id: 'dev2', name: 'Portátil' },
]

export function listDevices() {
  return devices
}

export function renameDevice(id: string, name: string) {
  const device = devices.find((d) => d.id === id)
  if (device) {
    device.name = name
  }
  return device
}

export function revokeDevice(id: string) {
  devices = devices.filter((d) => d.id !== id)
}
