import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { useAppDispatch } from '../state/store';
import { fetchTodos, LoadingStatus, useTodos } from '../state/todoSlice';
import { RootTabScreenProps } from '../types';

export default function QrReadScreen(_props: RootTabScreenProps<'ReadQr'>) {
  const todos = useTodos();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (todos.loadingStatus === LoadingStatus.Uninitialized) {
      dispatch(fetchTodos());
    }
  }, [todos.data, todos.loadingStatus, dispatch]);

  if (todos.loadingStatus === LoadingStatus.Loading) {
    <View style={styles.container}>
      <ActivityIndicator />
    </View>;
  }

  if (todos.loadingStatus === LoadingStatus.Loaded && todos.data !== null) {
    return (
      <View>
        {todos.data.map((todo) => (
          <Text key={todo.id}>{todo.title}</Text>
        ))}
      </View>
    );
  }

  if (todos.loadingStatus === LoadingStatus.Error) {
    return (
      <View style={styles.container}>
        <Text>Something went wrong fetching todos</Text>
      </View>
    );
  }

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  resultContainer: {
    width: '100%',
    alignItems: 'center',
  },
});
