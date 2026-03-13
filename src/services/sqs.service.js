const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const sqs = new SQSClient({
  region: process.env.AWS_REGION
});

exports.sendPaymentEvent = async (event) => {

  const params = {
QueueUrl: process.env.SQS_QUEUE_URL,
MessageBody: JSON.stringify(event)
};

  const command = new SendMessageCommand(params);

  return await sqs.send(command);
};
