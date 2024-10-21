
import mongoose from 'mongoose';

export default async function connectToMongoDB(url: string): Promise<void> {
    await mongoose.connect(url);
}

