import { MongoClient, Db } from "mongodb";

require('dotenv').config();

class DbConnection {
    private readonly client: MongoClient;
    private readonly db: Db;

    constructor() {
        const { MONGO_URI = 'mongodb+srv://review-admin:review-admin@review-summariser.mwavc.mongodb.net/?retryWrites=true&w=majority&appName=review-summariser' } = process.env;
        this.client = new MongoClient(MONGO_URI);
        this.db = this.client.db();
    }

    public async connect() {
        try {
            await this.client.connect();
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
        }
    }

    public getDb() {
        return this.db;
    }

    public async close() {
        try {
            await this.client.close();
            console.log("Closed MongoDB connection");
        } catch (error) {
            console.error("Error closing MongoDB connection:", error);
        }
    }
}

export default DbConnection;
