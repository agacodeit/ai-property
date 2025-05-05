export interface Message {
    role: string;
    text: string;
    content?: Content;
}

export interface Content {
    images: Array<string>;
    title: string;
    price: number;
    currency: string;
    location: string;
    beds: string;
    description: string;
    varieties: Array<string>;
}