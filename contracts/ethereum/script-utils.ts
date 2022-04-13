
import { promisify } from 'util';
import { readFile as readFileCb } from 'fs';

export const readFile = promisify(readFileCb);

export const mustEnv = (env: string): string => {
    const e = process.env[env];
    if (e == undefined) {
        throw new Error(`Env ${env} not set!`);
    }
    return e;
};
