export const SIZE_DEFAULT = 'default';
export const SIZE_MEDIUM = 'medium';
export const SIZE_HIGH = 'high';

export interface File {
    url: string;
}
export interface ThumbnailsData {
    [key: string]: File;
    [SIZE_DEFAULT]: File;
    [SIZE_MEDIUM]: File;
    [SIZE_HIGH]: File;
}

export type GenericObject = { [key: string]: any };
