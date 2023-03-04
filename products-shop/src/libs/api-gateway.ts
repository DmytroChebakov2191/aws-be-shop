import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (response: Record<string, unknown>) => {
  const defaultHeaders = {
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Origin': '*',
  }
  return {
    statusCode: 200,
    headers: {
      ...defaultHeaders,
    },
    body: JSON.stringify(response)
  }
}
