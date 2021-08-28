import { newValidator } from 'typesafe-schema';
import { STRING, Obj, NUMBER } from 'typesafe-schema';

const stringSchema = newValidator(STRING);

// Schema for POST /cm/containers
export const containerManagementTokenSchema = stringSchema;

// Schema for GET /cm/containers/:token/status
export const applicationUploadStatusResponse = newValidator(Obj({
  state: NUMBER,
  name: STRING,
}));