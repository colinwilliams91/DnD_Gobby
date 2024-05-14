// TODO: this file should be where event handlers are registered to event listeners (triggered events)

export const configure = (server) => {
    server
        .use(json())
        .use(urlencoded({ extended: true }));
};

/**
 * @summary handle "PING" POST from discord w 200
 * @param {*} server
 */
export const registerRoutes = (server) => {
    server.post("/", (req, res) => {
        if (req.json["type"] === 1) {
            res.sendStatus(200);
        }
    });
};