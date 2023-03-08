aws dynamodb put-item \
    --table-name stocks  \
    --item \
        '{"product_id": {"S": "7567ec4b-b10c-48c5-9445-fc73c48a80a2"}, "count": {"N": "5"}}'

aws dynamodb put-item \
    --table-name stocks  \
    --item \
        '{"product_id": {"S": "7567ec4b-b10c-45c5-9345-fc73c48a80a1"}, "count": {"N": "6"}}'
