import {z} from 'zod';
import {idRef} from '../helpers/id-ref';
import {$Client} from './client';
import {$Environment, ConfigBase} from './common';

export const $ClientSubscriptionBase = ConfigBase('ClientSubscription').extend({
  clientId: idRef($Client),
  environment: $Environment,
  type: z.enum(['messageStatus', 'channelStatus']).meta({
    description: `The type of events the client is subscribing to.
    - messageStatus: events related to the status of individual messages (e.g. delivered, failed)
    - channelStatus: events related to the status of communication channels (e.g. email, sms)`,
  }),
}).meta({
  title: 'ClientSubscriptionBase',
  description:
    `Base schema for client subscriptions, defining identifying fields.`,
})

export const $ClientSubscription = $ClientSubscriptionBase.extend({
  callbackUrl: z.url().meta({
    description: `The URL to which event callbacks should be sent.`
  }),
  callbackSecret: z.string().meta({
    description:
      `Secret used to sign event payloads sent to the callbackUrl.
      This will not be published as part of an event, but can be fetched directly from the client configuration domain via API call`,
  }).optional(),
  subscribedEvents: z.array(z.string()).meta({
    description: `List of event types the client is subscribed to.`
  }),
}).meta({
  title: 'ClientSubscription',
  description:
    `A client subscription indicates which events a client should be sent callbacks for.`
});

export type ClientSubscription = z.infer<typeof $ClientSubscription>;
