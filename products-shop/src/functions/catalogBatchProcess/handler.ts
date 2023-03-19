import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import {formatInternalError} from "@libs/api-gateway";
import {middyfy} from "@libs/lambda";

const catalogBatchProcess = async (event) => {
    try {
        if (event?.Records?.length) {
            const data = event?.Records?.map(({ body }) => body);
            const sns = new SNSClient({ region: 'eu-west-1' });
            const params = {
                Message: data.join(', \n'),
                TopicArn: process.env.SNS_ARN
            };
            await sns.send(new PublishCommand (params));
        }
    } catch (error) {
        console.error(error)
        return formatInternalError();
    }
};
export const main = middyfy(catalogBatchProcess);
