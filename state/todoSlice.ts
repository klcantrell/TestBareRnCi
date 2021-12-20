import { useCallback, useEffect } from 'react';
import {
  AnyAction,
  createSlice,
  PayloadAction,
  ThunkAction,
} from '@reduxjs/toolkit';

import { RootState, useAppDispatch, useAppSelector } from './store';
import { Todo } from '../types';
import { RealmInstance, RealmStatus, useRealm } from './realmContext';
import { TodoEntity } from '../state/realmSchema';

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

const fetchTodosWithCache: (
  realm: RealmInstance
) => ThunkAction<void, RootState, unknown, AnyAction> =
  (realm: RealmInstance) => async (dispatch, getState) => {
    const {
      todo: { loadingStatus },
    } = getState();
    if (
      loadingStatus === LoadingStatus.Uninitialized ||
      loadingStatus === LoadingStatus.Loaded ||
      loadingStatus === LoadingStatus.Error
    ) {
      if (realm.status === RealmStatus.Initialized) {
        const cachedTodos = realm.instance.objects(TodoEntity);
        if (cachedTodos.length === 0) {
          console.log('CACHE IS EMPTY');
        }
      }
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
  retriggerFetchTodos: () => void;
}

export const useTodos: () => UseTodos = () => {
  const todos = useAppSelector((state) => state.todo);
  const realm = useRealm();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTodosWithCache(realm));
  }, [dispatch, realm]);

  const retriggerFetchTodos = useCallback(
    () => dispatch(fetchTodosWithCache(realm)),
    [realm, dispatch]
  );

  return {
    ...todos,
    retriggerFetchTodos,
  };
};

export default todoSlice.reducer;
