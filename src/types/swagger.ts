import { getSchemaPath } from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const responseObjectSchema = (responseDto: any): SchemaObject => {
  return {
    type: 'object',
    properties: {
      isSuccess: {
        type: 'boolean',
        example: true,
      },
      data: {
        type: 'object',
        anyOf: [{ $ref: getSchemaPath(responseDto) }],
      },
    },
  };
};

export const responseBooleanSchema = (): SchemaObject => {
  return {
    type: 'object',
    properties: {
      isSuccess: {
        type: 'boolean',
        example: true,
      },
      data: {
        type: 'boolean',
        example: true,
      },
    },
  };
};

export const responseArraySchema = (responseDto: any): SchemaObject => {
  return {
    type: 'object',
    properties: {
      isSuccess: {
        type: 'boolean',
        example: true,
      },
      data: {
        type: 'array',
        items: {
          anyOf: [{ $ref: getSchemaPath(responseDto) }],
        },
      },
    },
  };
};

export const responseErrorSchema = (message: string): SchemaObject => {
  return {
    type: 'object',
    properties: {
      isSuccess: {
        type: 'boolean',
        example: false,
      },
      message: {
        type: 'string',
        example: message,
      },
      code: {
        type: 'string',
        example: 'HttpException',
      },
      path: {
        type: 'string',
        example: '/community',
      },
      timestamp: {
        type: 'date',
        example: '2021-03-01T00:00:00.000Z',
      },
    },
  };
};
