import Vue from 'vue'
import Vuex, { ActionContext } from 'vuex'

import {
  RoomEntry,
  RoomSettings,
  RoomsApi,
} from '@/api/index.ts'

import { state, State } from './state'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations: {
    ROOMS_SET(state: State, roomEntries: RoomEntry[]) {
      Vue.set(state, 'rooms', roomEntries)
    },
    ROOMS_ADD(state: State, roomEntry: RoomEntry) {
      Vue.set(state, 'rooms', [...state.rooms, roomEntry])
    },
    ROOMS_PUT(state: State, roomEntry: RoomEntry) {
      const roomEntries = state.rooms.filter((room) => {
        if (room.id == roomEntry.id) {
          return { ...room, ...roomEntry }
        } else {
          return room
        }
      })
      Vue.set(state, 'rooms', roomEntries)
    },
    ROOMS_DEL(state: State, roomId: string) {
      const roomEntries = state.rooms.filter(({ id }) => id != roomId)
      Vue.set(state, 'rooms', roomEntries)
    },
  },
  actions: {
    async ROOMS_LOAD({ commit }: ActionContext<State, State>) {
      const api = new RoomsApi()
      const res = await api.roomsList()
      commit('ROOMS_SET', res.data);
    },
    async ROOMS_CREATE({ commit }: ActionContext<State, State>, roomSettings: RoomSettings) {
      const api = new RoomsApi()
      const res = await api.roomCreate(roomSettings)
      commit('ROOMS_ADD', res.data);
    },
    async ROOMS_GET(_: ActionContext<State, State>, roomId: string): Promise<RoomSettings> {
      const api = new RoomsApi()
      const res = await api.roomGet(roomId)
      return res.data
    },
    async ROOMS_REMOVE({ commit }: ActionContext<State, State>, roomId: string) {
      const api = new RoomsApi()
      await api.roomRemove(roomId)
      commit('ROOMS_DEL', roomId);
    },
    async ROOMS_START({ commit }: ActionContext<State, State>, roomId: string) {
      const api = new RoomsApi()
      await api.roomStart(roomId)
      commit('ROOMS_PUT', {
        id: roomId,
        running: true,
      });
    },
    async ROOMS_STOP({ commit }: ActionContext<State, State>, roomId: string) {
      const api = new RoomsApi()
      await api.roomStop(roomId)
      commit('ROOMS_PUT', {
        id: roomId,
        running: false,
      });
    },
    async ROOMS_RESTART(_: ActionContext<State, State>, roomId: string) {
      const api = new RoomsApi()
      await api.roomRestart(roomId)
    },
  },
  modules: {
  }
})
