import {
  AnyAction,
  createSlice,
  PayloadAction,
  ThunkAction,
} from '@reduxjs/toolkit';
import { RootState, useAppSelector } from './store';
import { Todo } from '../types';

export enum LoadingStatus {
  Uninitialized,
  Loading,
  Loaded,
  Error,
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

export const fetchTodos: () => ThunkAction<
  void,
  RootState,
  unknown,
  AnyAction
> = () => async (dispatch, getState) => {
  const {
    todo: { loadingStatus },
  } = getState();
  if (
    loadingStatus === LoadingStatus.Uninitialized ||
    loadingStatus === LoadingStatus.Loaded ||
    loadingStatus === LoadingStatus.Error
  ) {
    dispatch(updateLoadingStatus(LoadingStatus.Loading));
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/todos?_start=1&_end=10'
    );
    const data = (await response.json()) as Array<Todo>;
    dispatch(updateData(data));
    dispatch(updateLoadingStatus(LoadingStatus.Loaded));
  }
};

export const useTodos = () => useAppSelector((state) => state.todo);

export default todoSlice.reducer;
