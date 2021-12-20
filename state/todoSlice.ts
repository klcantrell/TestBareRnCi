import {
  AnyAction,
  createSlice,
  PayloadAction,
  ThunkAction,
} from '@reduxjs/toolkit';
import { RootState, useAppSelector } from './store';
import { Todo } from '../types';
import { RealmInstance, RealmStatus, useRealm } from './realmContext';

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

const { updateLoadingStatus, updateData } = todoSlice.actions;

type CreateFetchTodosActionWithCacheType = (
  realm: RealmInstance
) => () => ThunkAction<void, RootState, unknown, AnyAction>;

const createFetchTodosActionWithCache: CreateFetchTodosActionWithCacheType =
  (realm: RealmInstance) => () => async (dispatch, getState) => {
    if (realm.status === RealmStatus.Initialized) {
      console.log(realm.instance.path);
    }
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

interface UseTodos extends TodoState {
  fetchTodos: () => ThunkAction<void, RootState, unknown, AnyAction>;
}

export const useTodos: () => UseTodos = () => {
  const todos = useAppSelector((state) => state.todo);
  const realm = useRealm();
  return {
    ...todos,
    fetchTodos: createFetchTodosActionWithCache(realm),
  };
};

export default todoSlice.reducer;
