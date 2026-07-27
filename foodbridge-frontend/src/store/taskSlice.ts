import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../types';

interface TaskState {
  tasks: Task[];
  activeTask: Task | null;
  liveCoordinates: { latitude: number; longitude: number; speed?: number; eta_minutes?: number } | null;
}

const initialState: TaskState = {
  tasks: [],
  activeTask: null,
  liveCoordinates: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    setActiveTask: (state, action: PayloadAction<Task | null>) => {
      state.activeTask = action.payload;
    },
    setLiveCoordinates: (state, action: PayloadAction<TaskState['liveCoordinates']>) => {
      state.liveCoordinates = action.payload;
    },
  },
});

export const { setTasks, setActiveTask, setLiveCoordinates } = taskSlice.actions;
export default taskSlice.reducer;
