import { create } from 'zustand'
import { scripts } from '../utils/api'
import { Script } from '../utils/types'

interface ScriptsState {
  scripts: Script[]
  loading: boolean
  fetch: () => Promise<void>
  create: (data: Partial<Script>) => Promise<void>
  update: (id: string, data: Partial<Script>) => Promise<void>
  remove: (id: string) => Promise<void>
}

export const useScripts = create<ScriptsState>((set) => ({
  scripts: [],
  loading: false,

  async fetch() {
    set({ loading: true })
    const { data } = await scripts.list()
    set({ scripts: data, loading: false })
  },

  async create(data) {
    await scripts.create(data)
    await useScripts.getState().fetch()
  },

  async update(id, data) {
    await scripts.update(id, data)
    await useScripts.getState().fetch()
  },

  async remove(id) {
    await scripts.delete(id)
    await useScripts.getState().fetch()
  }
}))
