import App from './app';

const port: number = parseInt(process.env.PORT as string) || 8080;

new App().start(port)
