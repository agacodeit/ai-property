import { BehaviorSubject } from "rxjs";

export interface Menu {
    state: BehaviorSubject<boolean>;
    menuItems: Array<MenuItem>;
}

export interface MenuItem {
    label: string;
    route: string;
    dateHourIncluded: any;
    id: string;
}