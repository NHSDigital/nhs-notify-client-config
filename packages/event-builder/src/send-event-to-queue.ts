import { randomUUID } from 'crypto';
import { GetQueueUrlCommand, SendMessageBatchCommand, SQSClient, SQSServiceException } from '@aws-sdk/client-sqs';


const region: string = process.env.AWS_REGION || 'eu-west-2';

const sqsClient = new SQSClient({
  region: region,
  retryMode: 'standard',
  maxAttempts: 5,
});

const buildQueueName = (): string => {
  return `comms-${process.env.ENVIRONMENT}-api-stl-quickstart-queue.fifo`;
}

export const sendSQSBatchMessages = async (
  Items: Record<string, unknown>[],
  MessageGroupId: string | null = 'default-message-group'
) => {
  const queueName = buildQueueName();

  try {
    const { QueueUrl } = await sqsClient.send(new GetQueueUrlCommand({ QueueName: queueName }));

    const command = new SendMessageBatchCommand({
      QueueUrl,
      Entries: Items.map((item, index) => ({
        Id: randomUUID(),
        MessageBody: JSON.stringify(item),
        ...(MessageGroupId && {
            MessageGroupId: MessageGroupId,
            MessageDeduplicationId: `${MessageGroupId}-event#${item.id ?? index}`,
          }),
      })),
    });

    return await sqsClient.send(command);

  } catch (err: any) {
    if(err?.name == "QueueDoesNotExist") {
      throw new Error(`Cannot send to queue ${queueName}: queue does not exist`);
    }

    throw new Error(`Error sending event to queue: ${err?.Error.message}`);
  }
};
