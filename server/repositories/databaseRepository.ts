import {loadDb, updateDb} from '../db.ts';
import type {DatabaseShape} from '../types.ts';

export interface DatabaseRepository {
  getSnapshot: () => DatabaseShape;
  update: (mutator: (db: DatabaseShape) => void) => DatabaseShape;
}

export const databaseRepository: DatabaseRepository = {
  getSnapshot: loadDb,
  update: updateDb,
};
