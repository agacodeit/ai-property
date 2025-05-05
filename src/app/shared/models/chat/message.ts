export class Message {
    role: string = '';
    text: string = '';
    content?: Content;
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