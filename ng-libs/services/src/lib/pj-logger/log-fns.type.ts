export type LogFns = Pick<
  typeof console,
  | 'log'
  | 'warn'
  | 'error'
  | 'info'
  | 'debug'
  | 'table'
  | 'trace'
  | 'group'
  | 'groupCollapsed'
  | 'groupEnd'
  | 'clear'
  | 'count'
  | 'countReset'
>;
