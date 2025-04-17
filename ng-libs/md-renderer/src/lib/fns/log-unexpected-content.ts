import { LogFns } from '@peterjokumsen/ng-services';
import { HasContentBase } from '../has-content';

/**
 * Logs a warning when unexpected content is provided.
 * Function to have a standard format for unexpected content logs.
 * @param component
 * @param object
 * @param log
 */
export function logUnexpectedContent(
  component: string,
  object: HasContentBase['content'],
  log?: LogFns,
): void {
  const notation: string = typeof object === 'string' ? '"%s"' : '%o';
  log?.warn(`${component}: Unexpected content received ${notation}`, object);
}
