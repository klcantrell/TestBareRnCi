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
import api from '../api';

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
        const cachedTodos = realm.instance.objects<TodoEntity>(
          TodoEntity.schema.name
        );
        if (cachedTodos.length === 0) {
          dispatch(updateLoadingStatus(LoadingStatus.Loading));
          const todos = await api.getTodos();
          dispatch(updateData(todos));
          dispatch(updateLoadingStatus(LoadingStatus.Loaded));
          const randomTodo = todos[Math.floor(Math.random() * todos.length)];
          console.log(`Caching todo with title ${randomTodo.title}`);
          realm.instance.write(() => {
            realm.instance.create<TodoEntity>(TodoEntity.schema.name, {
              _id: randomTodo.id,
              userId: randomTodo.userId,
              title: randomTodo.title,
              completed: randomTodo.completed,
            });
          });
        } else {
          dispatch(updateLoadingStatus(LoadingStatus.Loading));
          const todos: Array<Todo> = cachedTodos.map((c) => ({
            id: c._id,
            userId: c.userId,
            title: c.title,
            completed: c.completed,
          }));
          dispatch(updateData(todos));
          dispatch(updateLoadingStatus(LoadingStatus.Loaded));
        }
      } else {
        dispatch(updateLoadingStatus(LoadingStatus.Loading));
        const todos = await api.getTodos();
        dispatch(updateData(todos));
        dispatch(updateLoadingStatus(LoadingStatus.Loaded));
      }
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
