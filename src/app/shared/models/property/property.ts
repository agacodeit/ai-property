import { PropertyStatusEnum } from "../../constants/propertyStatus";

export class Property {
    id: string = '';
    title: string = '';
    description: string = '';
    location: string = '';
    price: number = 0;
    bedrooms: number = 0;
    bathrooms: number = 0;
    hasPool: boolean = false;
    hasGourmetBalcony: boolean = false;
    imageUrls: Array<PropertyImage> = [];
    propertyStatusEnum: PropertyStatusEnum = PropertyStatusEnum.CREATED;
}

export class PropertyImage {
    fileName: string = '';
    fileCode: string = '';
    downloadUrl: string = '';
}

export class PropertyHttpResponse {
    success: boolean = false;
    error?: any;
}