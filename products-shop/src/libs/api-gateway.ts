import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

const defaultHeaders = {
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*',
}

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    headers: {
      ...defaultHeaders,
    },
    body: JSON.stringify(response)
  }
}

export const formatInternalError = () => {
  return {
    statusCode: 500,
    headers: {
      ...defaultHeaders,
    },
    body: JSON.stringify({ message: 'Internal server error' })
  }
}

export const formatBadRequest = () => {
  return {
    statusCode: 400,
    headers: {
      ...defaultHeaders,
    },
    body: JSON.stringify({ message: 'Bad request' })
  }
}
