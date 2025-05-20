import { AdvertisementTypeEnum } from "../../constants/advertisementTypeEnum";
import { PropertyStatusEnum } from "../../constants/propertyStatus";
import { PropertyTypeEnum } from "../../constants/propertyTypeEnum";
import { Mediator } from "./Mediator";
import { PropertyAddress } from "./propertyAddress";
import { PropertyCommodity } from "./propertyCommodity";

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
    propertyTypeEnum: PropertyTypeEnum = PropertyTypeEnum.HOUSE;
    advertisementTypeEnum: AdvertisementTypeEnum = AdvertisementTypeEnum.RENT;
    propertyAddress: PropertyAddress = new PropertyAddress();
    mediator: Mediator = new Mediator();
    commodities: Array<PropertyCommodity> = [];
}

export class PropertyImage {
    fileName: string = '';
    fileCode: string = '';
    downloadUrl?: string;
    file?: File;
    loaded?: boolean;
}

export class PropertyHttpResponse {
    success: boolean = false;
    error?: any;
    content?: any;
}