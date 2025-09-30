import { randomUUID } from "node:crypto";
import {
  GetQueueUrlCommand,
  SQSClient,
  SendMessageBatchCommand,
} from "@aws-sdk/client-sqs";
import { EventMetadata } from "@nhsdigital/nhs-notify-client-config-schemas/src/events/base-metadata-schemas";

const region: string = process.env.AWS_REGION || "eu-west-2";

const sqsClient = new SQSClient({
  region,
  retryMode: "standard",
  maxAttempts: 5,
});

const buildQueueName = (env: string): string => {
  return `comms-${env}-api-stl-quickstart-queue.fifo`;
};

const sendSQSBatchMessages = async <T extends EventMetadata>(
  Items: T[],
  environment: string,
) => {
  const queueName = buildQueueName(environment);

  try {
    const { QueueUrl } = await sqsClient.send(
      new GetQueueUrlCommand({ QueueName: queueName }),
    );

    const command = new SendMessageBatchCommand({
      QueueUrl,
      Entries: Items.map((item) => ({
        Id: randomUUID(),
        MessageBody: JSON.stringify(item),
        MessageGroupId: item.subject,
        MessageDeduplicationId: item.subject,
      })),
    });

    return await sqsClient.send(command);
  } catch (error: any) {
    if (error?.name === "QueueDoesNotExist") {
      throw new Error(
        `Cannot send to queue ${queueName}: queue does not exist`,
      );
    }

    throw new Error(`Error sending event to queue: ${error?.Error.message}`);
  }
};

export default sendSQSBatchMessages;
