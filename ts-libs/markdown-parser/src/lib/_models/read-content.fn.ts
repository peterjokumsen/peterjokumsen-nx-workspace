import { ReadResult } from './read-result';

export type ReadContentFn = (lines: string[], start: number) => ReadResult;
