import dayjs from 'dayjs';
import {create} from 'zustand'

export const useFilterStore = create((set) => ({
    startTime       : dayjs().subtract(1,'M'),
    endTime         : dayjs(),
    events          :{
                        view         : true,
                        click        : true,
                        purchase     : true,
                    },
    users           :{
                        newUser      : true,
                        existingUser : true,
                    },
    setStartTime    : (date) => set({startTime  : date}),
    setEndTime      : (date) => set({endTime    : date}),
    setEvents       : (updater) => 
                        set((state) => ({
                            events:
                                typeof updater === 'function'
                                ? updater(state.events)
                                : updater,
                        })),
    setUsers        : (updater) =>
                        set((state) => ({
                            users:
                                typeof updater === 'function'
                                ? updater(state.users)
                                : updater,
                        })),
                    }))