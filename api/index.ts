import { Todo } from '../types';

async function getTodos() {
  const response = await fetch(
    'https://jsonplaceholder.typicode.com/todos?_start=1&_end=10'
  );
  const data: Array<Todo> = await response.json();
  return data;
}

export default {
  getTodos,
};
