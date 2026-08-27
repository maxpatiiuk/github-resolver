import '../__mocks__/child_process.js';
import { vi } from 'vitest';

vi.stubEnv('LIST_FILES', 'ls');
vi.stubEnv('EDITOR', 'open');
