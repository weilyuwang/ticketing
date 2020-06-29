export const natsWrapper = {
    // mock NATS client (Stan)
    client: {
        publish: jest
            .fn()
            .mockImplementation(
                (subject: string, data: string, callback: () => void) => {
                    callback();
                }
            ),
    },
};
