export interface Message {
    role: string;
    text: string;
    content?: Content;
}

export interface Content {
    images: Array<string>;
    
}