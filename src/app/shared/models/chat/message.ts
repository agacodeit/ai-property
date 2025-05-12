export class Message {
    role: string = '';
    text: string = '';
    content?: Content;
    chatId: string = '';
    error?: boolean = false;
}

export class Content {
    images: Array<string> = [];
    title: string = '';
    price: number = 0;
    currency: string = '';
    location: string = '';
    beds: string = '';
    description: string = '';
    varieties: Array<string> = [];
}