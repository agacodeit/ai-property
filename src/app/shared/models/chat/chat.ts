import { v4 as uuidv4 } from 'uuid';
import { Message } from './message';

export class Chat {
    id: string = uuidv4();
    messages: Array<Message> = [];
    dateHourUpdated: Date = new Date();
    title: string = '';
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
    status: string = '';
}