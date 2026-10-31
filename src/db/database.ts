import Dexie, { type EntityTable } from 'dexie';
import type { ThinkingWorkspace } from '../types/thinking';

class ThinkDatabase extends Dexie {
  workspaces!: EntityTable<ThinkingWorkspace, 'id'>;

  constructor() {
    super('think');
    this.version(1).stores({ workspaces: 'id, updatedAt' });
  }
}

export const database = new ThinkDatabase();

export async function loadWorkspace(): Promise<ThinkingWorkspace | undefined> {
  return database.workspaces.get('current');
}

export async function saveWorkspace(workspace: ThinkingWorkspace): Promise<void> {
  await database.workspaces.put(workspace);
}
