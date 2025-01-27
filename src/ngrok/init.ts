import { color } from "console-log-colors";
import ngrok from '@ngrok/ngrok';
import dotenv from 'dotenv';

dotenv.config();

let connectionUrl: string | null;

export const initializeNgrok = async () => {
    const port = process.env.PORT || 3000;
    const authtoken = process.env.NGROK_AUTH;

    try {
        if (!authtoken) {
            throw new Error('Ngrok authtoken is not set in the environment variables');
        }

        await ngrok.authtoken(authtoken);

        const listener = await ngrok.forward({ addr: port });

        const url = listener.url();
        connectionUrl = url;
    
        console.log(color.cyan(`Ngrok: Listening on url ${url}`));

        return url;
    } catch (error: any) {
        console.log(color.red.bold(`ngrok: ${error.message}`));
    }
}

export const getNgrokUrl = () =>  {
    return connectionUrl;
}
