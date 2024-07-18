// config.validation.ts
import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  KEYCLOAK_BASE_URL: Joi.string().uri().required(),
  KEYCLOAK_REALM: Joi.string().required(),
  KEYCLOAK_CLIENT_SECRET: Joi.string().required(),
  KEYCLOAK_CLIENT_ID: Joi.string().required(),
});
