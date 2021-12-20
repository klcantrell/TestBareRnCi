import { ObjectSchema } from 'realm';
import { BaseTodo } from '../types';

export class TodoEntity implements BaseTodo {
  public _id: number = 0;
  public userId: number = 0;
  public title: string = '';
  public completed: boolean = false;

  public static schema: ObjectSchema = {
    name: 'Todo',
    primaryKey: '_id',
    properties: {
      _id: 'int',
      userId: 'int',
      title: 'string',
      completed: 'bool',
    },
  };
}
