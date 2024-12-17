import { Server } from './minecraft/server';
import { Whitelist } from './minecraft/whitelist';

export const CommandMap = {
  "whitelist": Whitelist,
  "server": Server,
}