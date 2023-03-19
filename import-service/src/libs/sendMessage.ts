import {formatInternalError} from "@libs/api-gateway";
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

const QueueUrl = 'https://sqs.eu-west-1.amazonaws.com/504799885106/catalogItemsQueue'

export const sendMessageSQS = async (products) => {
    try {
        const sqs = new SQSClient({ region: "eu-west-1" });
        const command = new SendMessageCommand({
            QueueUrl,
            MessageBody: JSON.stringify(products),
        })
        await sqs.send(command);
    } catch (e) {
        return formatInternalError();
    }
}
