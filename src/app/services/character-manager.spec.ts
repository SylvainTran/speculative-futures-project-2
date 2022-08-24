import { CharacterDatabaseService } from './character-database.service';
import { CharacterManager } from './character-manager';

describe('CharacterManager', () => {
  it('should create an instance', () => {
    expect(new CharacterManager(new CharacterDatabaseService())).toBeTruthy();
  });
});
