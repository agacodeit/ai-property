export interface OptionContainer {
    title?: string;
    options: Option[];
}

export interface Option {
    icon: string;
    label: string;
    id: number;
    color?: string;
}