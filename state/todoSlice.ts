import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, useAppSelector } from './store';

export enum LoadingStatus {
  Uninitialized,
  Loading,
  Loaded,
  Error,
}

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

interface TodoState {
  loadingStatus: LoadingStatus;
  data: Array<Todo> | null;
}

const initialState: TodoState = {
  loadingStatus: LoadingStatus.Uninitialized,
  data: null,
};

export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    updateLoadingStatus: (state, action: PayloadAction<LoadingStatus>) => {
      state.loadingStatus = action.payload;
    },
    updateData: (state, action: PayloadAction<Array<Todo>>) => {
      state.data = action.payload;
    },
  },
});

export const { updateLoadingStatus, updateData } = todoSlice.actions;
export const fetchTodos = () => async (dispatch: AppDispatch) => {
  dispatch(updateLoadingStatus(LoadingStatus.Loading));
  const response = await fetch(
    'https://jsonplaceholder.typicode.com/todos?_start=1&_end=10'
  );
  const data = (await response.json()) as Array<Todo>;
  dispatch(updateLoadingStatus(LoadingStatus.Loaded));
  dispatch(updateData(data));
};

export const useTodos = () => useAppSelector((state) => state.todo);

export default todoSlice.reducer;
