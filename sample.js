import PubSubApiClient from 'salesforce-pubsub-api-client';

async function run() {
    try {
        const client = new PubSubApiClient();
        await client.connect();

        // Subscribe to a single incoming account change event
        const eventEmitter = await client.subscribe(
            '/data/AccountChangeEvent',
            1
        );

        // Handle incoming events
        eventEmitter.on('data', (event) => {
            console.log(
                `Handling ${event.payload.ChangeEventHeader.entityName} change event ` +
                    `with ID ${event.replayId} ` +
                    `on channel ${eventEmitter.getTopicName()} ` +
                    `(${eventEmitter.getReceivedEventCount()}/${eventEmitter.getRequestedEventCount()} ` +
                    `events received so far)`
            );
            //console.log(JSON.stringify(event, null, 2));
        });

        // Handle last requested event
        eventEmitter.on('lastevent', () => {
            console.log(
                `Reached last requested event on channel ${eventEmitter.getTopicName()}.`
            );
            // At this point the gRPC client will close automatically
            // unless you re-subscribe to request more events (default Pub/Sub API behavior)
        });
    } catch (error) {
        console.error(error);
    }
}

run();