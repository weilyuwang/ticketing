export const natsWrapper = {
    // mock NATS client (Stan)
    client: {
        publish: (subject: string, data: string, callback: () => void) => {
            callback();
        },
    },
};
