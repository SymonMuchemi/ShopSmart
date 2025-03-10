import { color } from "console-log-colors";
import { createClient } from "redis";

const STREAMNAME: string = 'shopsmart:mail';

class RedisClient {
    client;
    constructor() {
        this.client = createClient();

        this.client
            .connect()
            .then(() => console.log(color.yellow('Redis connected successfully!')))
            .catch((err) => console.log(color.red.bold(`Error connecting to redis server:  ${err.message}`)));
    }

    isAlive() {
        return this.client.isReady;
    }

    async get(key: string) {
        return this.client.get(key);
    }

    async set(key: string, val: string, exp?: number) {
        if (exp === undefined) exp = 86400000;

        return this.client.set(key, val, { EX: exp });
    }

    async del(key: string) {
        return this.client.del(key);
    }

    async writeMailStream(to: string, subject: string, message: string) {
        return this.client.XADD(
            STREAMNAME, '*',
            {
                'email': to,
                'subject': subject,
                'body': message
            }
        )
    }
}

const redisClient = new RedisClient();

export default redisClient;
