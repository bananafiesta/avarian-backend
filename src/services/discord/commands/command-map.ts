import { Server } from './minecraft/server';
import { Whitelist } from './minecraft/whitelist';
import { Test } from './utility/test';

export const CommandMap = {
  "test": Test,
  "whitelist": Whitelist,
  "server": Server,
}