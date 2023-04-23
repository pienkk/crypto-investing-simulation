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
