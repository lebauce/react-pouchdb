import PouchDB from '@craftzdog/pouchdb-core-react-native';
import HttpPouch from 'pouchdb-adapter-http';
import replication from 'pouchdb-replication';
import mapreduce from 'pouchdb-mapreduce';

import SQLite from 'react-native-sqlite-2';
import SQLiteAdapterFactory from 'pouchdb-adapter-react-native-sqlite';

const SQLiteAdapter = SQLiteAdapterFactory(SQLite);

PouchDB.plugin(HttpPouch)
  .plugin(replication)
  .plugin(mapreduce)
  .plugin(SQLiteAdapter);

export default function createPouchDB({
  // Time to wait for suspended component to actually mount and subscribe.
  synchronousAPITemporarySubscriptionCleanupDelay,
  // Limit excessive re-rendering from bulkDocs:
  // Time to wait more changes. Final update is made after this, if there were more updates.
  // Set null to disable debouncing updates.
  debounceUpdatesWait,
  // Limit update frequency.
  debounceUpdatesMaxWait,
  maxListeners,
  ...options
}) {
  const db = new PouchDB(
    // PouchDB constructor modifies the options object. Make sure options is a
    // copy so the original object remains untouched.
    options
  );
  if (maxListeners) {
    db.setMaxListeners(maxListeners);
  }
  return Object.assign(db, {
    reactPouchDBOptions: {
      synchronousAPITemporarySubscriptionCleanupDelay,
      debounceUpdatesWait,
      debounceUpdatesMaxWait
    }
  });
}
