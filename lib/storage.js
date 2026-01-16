// lib/storage.js
import { supabase } from './supabase'
import { MOCK_NOTES } from "./mockData"

// ==================== NOTES ====================

export async function getAllNotes() {
  try {
    if (!supabase) return getLocalNotes()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return getLocalNotes()

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching notes:', error)
    return getLocalNotes()
  }
}

export async function getNote(id) {
  try {
    if (!supabase) return getLocalNote(id)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return getLocalNote(id)

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching note:', error)
    return getLocalNote(id)
  }
}

export async function saveNote(note) {
  try {
    if (!supabase) return saveLocalNote(note)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return saveLocalNote(note)

    const noteData = {
      ...note,
      user_id: user.id,
      updated_at: new Date().toISOString()
    }

    if (note.id) {
      const { data, error } = await supabase
        .from('notes')
        .update(noteData)
        .eq('id', note.id)
        .select()
        .single()

      if (error) throw error
      return data
    } else {
      noteData.created_at = new Date().toISOString()
      const { data, error } = await supabase
        .from('notes')
        .insert([noteData])
        .select()
        .single()

      if (error) throw error
      return data
    }
  } catch (error) {
    console.error('Error saving note:', error)
    return saveLocalNote(note)
  }
}

export async function deleteNote(id) {
  try {
    if (!supabase) return deleteLocalNote(id)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return deleteLocalNote(id)

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting note:', error)
    return deleteLocalNote(id)
  }
}

// ==================== COLLECTIONS ====================

export async function getAllCollections() {
  try {
    if (!supabase) return getLocalCollections()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return getLocalCollections()

    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching collections:', error)
    return getLocalCollections()
  }
}

export async function saveCollection(collection) {
  try {
    if (!supabase) return saveLocalCollection(collection)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return saveLocalCollection(collection)

    const collectionData = {
      ...collection,
      user_id: user.id
    }

    if (collection.id) {
      const { data, error } = await supabase
        .from('collections')
        .update(collectionData)
        .eq('id', collection.id)
        .select()
        .single()

      if (error) throw error
      return data
    } else {
      collectionData.created_at = new Date().toISOString()
      const { data, error} = await supabase
        .from('collections')
        .insert([collectionData])
        .select()
        .single()

      if (error) throw error
      return data
    }
  } catch (error) {
    console.error('Error saving collection:', error)
    return saveLocalCollection(collection)
  }
}

export async function deleteCollection(id) {
  try {
    if (!supabase) return deleteLocalCollection(id)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return deleteLocalCollection(id)

    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting collection:', error)
    return deleteLocalCollection(id)
  }
}

// ==================== FAVORITES ====================

export async function getFavorites() {
  try {
    if (!supabase) return getLocalFavorites()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return getLocalFavorites()

    const { data, error } = await supabase
      .from('favorites')
      .select('note_id')

    if (error) throw error
    return data.map(f => f.note_id)
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return getLocalFavorites()
  }
}

export async function toggleFavorite(noteId) {
  try {
    if (!supabase) return toggleLocalFavorite(noteId)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return toggleLocalFavorite(noteId)

    const favorites = await getFavorites()
    const isFavorite = favorites.includes(noteId)

    if (isFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('note_id', noteId)

      if (error) throw error
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert([{ user_id: user.id, note_id: noteId }])

      if (error) throw error
    }

    return !isFavorite
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return toggleLocalFavorite(noteId)
  }
}

// ==================== MIGRATION ====================

export async function migrateLocalToSupabase() {
  try {
    if (!supabase) {
      throw new Error('Cloud features are not available. Please configure Supabase credentials in your environment variables.')
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('You must be logged in to migrate data to the cloud.')
    }

    const localNotes = getLocalNotes()
    const localCollections = getLocalCollections()

    let migratedNotes = 0
    let migratedCollections = 0

    for (const note of localNotes) {
      await saveNote(note)
      migratedNotes++
    }

    for (const collection of localCollections) {
      await saveCollection(collection)
      migratedCollections++
    }

    return { notes: migratedNotes, collections: migratedCollections }
  } catch (error) {
    console.error('Migration error:', error)
    throw error
  }
}

// ==================== LOCAL STORAGE FALLBACK ====================

function getLocalNotes() {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem('dg_notes')
  if (!raw) return []
  const notes = JSON.parse(raw)
  const mockFiltered = MOCK_NOTES.filter(m => !notes.some(l => l.slug === m.slug))
  return [...notes, ...mockFiltered]
}

function getLocalNote(id) {
  const notes = getLocalNotes()
  return notes.find(n => n.id === id) || null
}

function saveLocalNote(note) {
  const notes = getLocalNotes().filter(n => !MOCK_NOTES.some(m => m.id === n.id))
  const now = new Date().toISOString()
  
  if (note.id) {
    const index = notes.findIndex(n => n.id === note.id)
    if (index !== -1) {
      notes[index] = { ...note, updated_at: now }
    }
  } else {
    note.id = Date.now() + Math.random()
    note.created_at = now
    note.updated_at = now
    notes.push(note)
  }
  
  localStorage.setItem('dg_notes', JSON.stringify(notes))
  return note
}

function deleteLocalNote(id) {
  const notes = getLocalNotes().filter(n => !MOCK_NOTES.some(m => m.id === n.id))
  const filtered = notes.filter(n => n.id !== id)
  localStorage.setItem('dg_notes', JSON.stringify(filtered))
  return true
}

function getLocalCollections() {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem('dg_collections')
  return raw ? JSON.parse(raw) : []
}

function saveLocalCollection(collection) {
  const collections = getLocalCollections()
  
  if (collection.id) {
    const index = collections.findIndex(c => c.id === collection.id)
    if (index !== -1) {
      collections[index] = collection
    }
  } else {
    collection.id = Date.now() + Math.random()
    collection.created_at = new Date().toISOString()
    collections.push(collection)
  }
  
  localStorage.setItem('dg_collections', JSON.stringify(collections))
  return collection
}

function deleteLocalCollection(id) {
  const collections = getLocalCollections()
  const filtered = collections.filter(c => c.id !== id)
  localStorage.setItem('dg_collections', JSON.stringify(filtered))
  return true
}

function getLocalFavorites() {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem('dg_favorites')
  return raw ? JSON.parse(raw) : []
}

function toggleLocalFavorite(noteId) {
  const favorites = getLocalFavorites()
  const index = favorites.indexOf(noteId)
  
  if (index > -1) {
    favorites.splice(index, 1)
  } else {
    favorites.push(noteId)
  }
  
  localStorage.setItem('dg_favorites', JSON.stringify(favorites))
  return index === -1
}

// ==================== LEGACY FUNCTIONS (for backward compatibility) ====================

export function findBySlug(slug) {
  const all = getLocalNotes()
  return all.find(n => n.slug === slug) || null
}

export function updateNoteById(id, patch = {}) {
  const notes = getLocalNotes().filter(n => !MOCK_NOTES.some(m => m.id === n.id))
  const idx = notes.findIndex(n => n.id === id)
  if (idx === -1) return null
  
  const updated = {
    ...notes[idx],
    ...patch,
    updated_at: new Date().toISOString()
  }
  notes[idx] = updated
  localStorage.setItem('dg_notes', JSON.stringify(notes))
  return updated
}

export function deleteNoteById(id) {
  return deleteLocalNote(id)
}

// Share tokens
const SHARE_KEY = "dg_shares"

function _readShares() {
  try {
    const raw = localStorage.getItem(SHARE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function _writeShares(obj) {
  try {
    localStorage.setItem(SHARE_KEY, JSON.stringify(obj))
  } catch {}
}

export function createShareToken(slug, options = { expiresAt: null }) {
  const shares = _readShares()
  const token = Math.random().toString(36).slice(2, 10)
  shares[token] = { slug, ...options, createdAt: new Date().toISOString() }
  _writeShares(shares)
  return token
}

export function resolveShareToken(token) {
  const shares = _readShares()
  const meta = shares[token]
  if (!meta) return null
  if (meta.expiresAt && new Date(meta.expiresAt) < new Date()) return null
  return meta.slug
}

// ==================== VERSION HISTORY ====================

const HISTORY_KEY = 'dg_history'
const MAX_VERSIONS = 10

function _readHistory() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function _writeHistory(obj) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(obj))
  } catch {}
}

export function saveVersion(noteId, title, content) {
  const history = _readHistory()
  if (!history[noteId]) history[noteId] = []
  
  history[noteId].unshift({
    title,
    content,
    at: new Date().toISOString()
  })
  
  if (history[noteId].length > MAX_VERSIONS) {
    history[noteId] = history[noteId].slice(0, MAX_VERSIONS)
  }
  
  _writeHistory(history)
}

export function getHistory(noteId) {
  const history = _readHistory()
  return history[noteId] || []
}

export function revertToVersion(noteId, versionIndex) {
  const history = _readHistory()
  const versions = history[noteId]
  if (!versions || !versions[versionIndex]) return null
  
  const version = versions[versionIndex]
  updateNoteById(noteId, {
    title: version.title,
    content: version.content
  })
  
  return version
}