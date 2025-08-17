const DB_NAME = 'nexora-outbox'
const STORE_NAME = 'requests'

export interface OutboxRequest {
  id?: number
  url: string
  method: string
  headers?: [string, string][]
  body?: string
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function addRequest(data: Omit<OutboxRequest, 'id'>) {
  const db = await openDB()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.objectStore(STORE_NAME).add(data)
  })
}

export async function getRequests() {
  const db = await openDB()
  return new Promise<OutboxRequest[]>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).getAll()
    req.onsuccess = () => resolve(req.result as OutboxRequest[])
    req.onerror = () => reject(req.error)
  })
}

export async function removeRequest(id: number) {
  const db = await openDB()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.objectStore(STORE_NAME).delete(id)
  })
}
