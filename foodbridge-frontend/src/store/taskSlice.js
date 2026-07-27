import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  activeTask: null,
  liveCoordinates: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    setActiveTask: (state, action) => {
      state.activeTask = action.payload;
    },
    setLiveCoordinates: (state, action) => {
      state.liveCoordinates = action.payload;
    },
  },
});

export const { setTasks, setActiveTask, setLiveCoordinates } = taskSlice.actions;
export default taskSlice.reducer;
