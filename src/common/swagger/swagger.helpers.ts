import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiParam,
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

/** Name of the Bearer security scheme registered in main.ts */
export const BEARER_AUTH_NAME = 'access-token';

/** A realistic MongoDB ObjectId used in examples */
export const EXAMPLE_OBJECT_ID = '6a8b2469abf9629023788337';

type SchemaLike = Record<string, any>;

//?=======================================
//* Shared response models
//?=======================================

/** Fields Mongoose adds to every document (timestamps: true) */
export class BaseDocumentDto {
  @ApiProperty({ example: EXAMPLE_OBJECT_ID, description: 'MongoDB ObjectId' })
  _id!: string;

  @ApiProperty({ example: '2026-11-03T10:15:30.000Z', type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-11-03T10:15:30.000Z', type: String, format: 'date-time' })
  updatedAt!: Date;
}

export class PaginationDto {
  @ApiProperty({ example: 42, description: 'Total documents matching the filter' })
  total!: number;

  @ApiProperty({ example: 10, description: 'Page size used' })
  limit!: number;

  @ApiProperty({ example: 0, description: 'Number of documents skipped' })
  skip!: number;

  @ApiProperty({ example: 10, description: 'Number of documents in this response' })
  returned!: number;
}

/** Shape of every error thrown through Nest exceptions */
export class ErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    example: 'Validation failed',
    description:
      'A single message, or an array of messages when class-validator rejects the body/query',
  })
  message!: string | string[];

  @ApiPropertyOptional({ example: 'Bad Request' })
  error?: string;
}

/** Envelope without a data payload */
export class MessageResponseDto {
  @ApiProperty({ example: 200 })
  status!: number;

  @ApiProperty({ example: 'Done successfully' })
  message!: string;
}

//?=======================================
//* Decorators
//?=======================================

export interface EnvelopeOptions {
  /** Real HTTP status code (POST defaults to 201 in Nest, others 200) */
  status?: number;
  /** The numeric `status` field written in the JSON body by the service */
  bodyStatus?: number;
  description: string;
  /** Example of the `message` field */
  message: string;
  /** data = <model> */
  model?: Type<unknown>;
  /** data = { <key>: <model> } */
  wrap?: { key: string; model: Type<unknown> };
  /** data = { <key>: <model>[], pagination } */
  list?: { key: string; model: Type<unknown> };
  /** data = custom schema */
  data?: SchemaLike;
  /** extra top-level properties next to status/message/data (e.g. access_token) */
  extra?: Record<string, SchemaLike>;
  /** Do not output a `status` property (some endpoints return only message) */
  noStatus?: boolean;
}

/**
 * Documents the `{ status, message, data }` envelope used by this API.
 */
export function ApiEnvelopeResponse(options: EnvelopeOptions) {
  const httpStatus = options.status ?? 200;
  const bodyStatus = options.bodyStatus ?? httpStatus;
  const models: Type<unknown>[] = [];

  let data: SchemaLike | undefined;
  if (options.model) {
    models.push(options.model);
    data = { $ref: getSchemaPath(options.model) };
  } else if (options.wrap) {
    models.push(options.wrap.model);
    data = {
      type: 'object',
      properties: {
        [options.wrap.key]: { $ref: getSchemaPath(options.wrap.model) },
      },
    };
  } else if (options.list) {
    models.push(options.list.model, PaginationDto);
    data = {
      type: 'object',
      properties: {
        [options.list.key]: {
          type: 'array',
          items: { $ref: getSchemaPath(options.list.model) },
        },
        pagination: { $ref: getSchemaPath(PaginationDto) },
      },
    };
  } else if (options.data) {
    data = options.data;
  }

  const properties: Record<string, SchemaLike> = {};
  if (!options.noStatus) {
    properties.status = { type: 'number', example: bodyStatus };
  }
  properties.message = { type: 'string', example: options.message };
  if (data) properties.data = data;
  Object.assign(properties, options.extra ?? {});

  return applyDecorators(
    ApiExtraModels(...models),
    ApiResponse({
      status: httpStatus,
      description: options.description,
      schema: { type: 'object', properties },
    }),
  );
}

const DEFAULT_ERROR_DESCRIPTIONS: Record<number, string> = {
  400: 'Bad Request – validation failed, malformed ObjectId, or a business rule was violated',
  401: 'Unauthorized – missing/invalid/expired Bearer token, or the role is not allowed',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict – the resource already exists',
  500: 'Internal Server Error',
};

/**
 * Adds error responses (all use ErrorResponseDto).
 * Pass a code, or [code, description] to override the default description.
 */
export function ApiErrors(...errors: Array<number | [number, string]>) {
  return applyDecorators(
    ApiExtraModels(ErrorResponseDto),
    ...errors.map((e) => {
      const [code, description] = Array.isArray(e)
        ? e
        : [e, DEFAULT_ERROR_DESCRIPTIONS[e] ?? 'Error'];
      return ApiResponse({ status: code, description, type: ErrorResponseDto });
    }),
  );
}

/**
 * Marks an endpoint as protected by AuthGuard (+ RolesGuard).
 * NOTE: RolesGuard throws 401 (not 403) when the role is not allowed.
 */
export function ApiPrivate(...roles: Array<'user' | 'admin'>) {
  const who = roles.length ? ` Allowed roles: ${roles.join(', ')}.` : '';
  return applyDecorators(
    ApiBearerAuth(BEARER_AUTH_NAME),
    ApiResponse({
      status: 401,
      description: `Unauthorized – missing/invalid/expired Bearer token, or the role is not allowed.${who}`,
      type: ErrorResponseDto,
    }),
  );
}

/** Path parameter holding a MongoDB ObjectId */
export function ApiMongoIdParam(name = 'id', description = 'MongoDB ObjectId') {
  return ApiParam({
    name,
    description,
    type: String,
    example: EXAMPLE_OBJECT_ID,
  });
}
