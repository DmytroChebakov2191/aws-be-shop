import * as AWS from 'aws-sdk';
import csv from 'csv-parser';

import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';


const importFileParser = async (event) => {
    const parseCsvStreamData = (stream) => {
        stream
            .pipe(csv())
            .on('data', (data) => {
                console.log(data);
            })
            .on('error', (e) => {
                console.log('error', e);
            })
    }
    try {
        const s3 = new AWS.S3({ region: 'eu-west-1' });
        const bucketName = 'import-files-aws-s3';
        for (const record of event.Records) {
            const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
            const params = {
                Bucket: bucketName,
                Key: key
            }
            const s3Stream = s3.getObject(params).createReadStream();
            parseCsvStreamData(s3Stream);
            await s3.copyObject({
                Bucket: bucketName,
                CopySource: bucketName + '/' + record.s3.object.key,
                Key: record.s3.object.key.replace('uploaded', 'parsed')
            }).promise();

            await s3
                .deleteObject({ Bucket: bucketName, Key: key })
                .promise();
        }
        // @ts-ignore
        return formatJSONResponse();
    } catch (e) {
        return "Error"
    }
};

export const main = middyfy(importFileParser);
