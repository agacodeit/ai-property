import { Property } from "../property/property";
import { PropertyAddress } from "../property/propertyAddress";
import { PropertyCommodity } from "../property/propertyCommodity";

export class Message {
    role: string = '';
    text: string = '';
    content?: any;
    chatId: string = '';
    error?: boolean = false;
}