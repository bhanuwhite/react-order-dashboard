/**
 * This file contains all the schema definitions used in the code base. If you need
 * a schema validator, there's a high chance to find it here.
 *
 * Schemas defined in this file that refers to a MAS api omit the `/mas/v2` prefix
 *
 */

import { newValidator, IGNORE } from 'typesafe-schema';

// Schema to ignore the entire result.
export const ignoreSchema = newValidator(IGNORE);

export * from './mas-api';
export * from './acs-api';
export * from './cm-api';
export * from './groups-api';
export * from './enroll-api';
export * from './self-api';
export * from './vff-api';