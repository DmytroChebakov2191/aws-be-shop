export const scanData = async (tableName, dynamoDBClient) => {
    try {
        const params = {
            TableName: tableName
        };
        const dbItems = await dynamoDBClient.scan(params).promise();
        return dbItems.Items;
    } catch (error) {
        return error
    }
}
