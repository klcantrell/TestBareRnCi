import React, { createContext, useContext, useEffect, useState } from 'react';
import Realm from 'realm';
import { TodoEntity } from './realmSchema';

export enum RealmStatus {
  Uninitialized,
  Initialized,
  FailedToInitialize,
}

type RealmUnitialized = {
  status: RealmStatus.Uninitialized;
  instance: null;
};

type RealmInitialized = {
  status: RealmStatus.Initialized;
  instance: Realm;
};

type RealmFailedToInitialize = {
  status: RealmStatus.FailedToInitialize;
  instance: null;
};

export type RealmInstance =
  | RealmUnitialized
  | RealmInitialized
  | RealmFailedToInitialize;

interface Props {
  children: React.ReactElement;
}

const realmContextDefaultValue: RealmInstance = {
  status: RealmStatus.Uninitialized,
  instance: null,
};

const RealmContext = createContext<RealmInstance>(realmContextDefaultValue);

export function RealmProvider({ children }: Props): React.ReactElement {
  const [realm, setRealm] = useState<RealmInstance>(realmContextDefaultValue);

  useEffect(() => {
    async function initializeRealm() {
      const instance = await Realm.open({
        path: 'testrealm',
        schema: [TodoEntity],
      });
      setRealm({ instance, status: RealmStatus.Initialized });
    }

    if (realm.status === RealmStatus.Uninitialized) {
      initializeRealm();
    }

    return () => {
      realm?.instance?.close();
    };
  }, [realm.status, realm.instance]);

  return (
    <RealmContext.Provider value={realm}>{children}</RealmContext.Provider>
  );
}

export function useRealm(): RealmInstance {
  const context = useContext(RealmContext);
  if (!context) {
    throw new Error('useRealm must be used within a RealmContext');
  }
  return context;
}
