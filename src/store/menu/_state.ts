export interface MenuItemData {
    title: string;
    icon: string;
    onClick: (...args: any[]) => void;
}

export type MenuOpener = (data: {
    title: string;
    callbackData: object;
    items: MenuItemData[];
}) => void;

export interface MenuState {
    items: MenuItemData[];
    isOpen: boolean;
    menuTitle: string;
    callbackData: object;
}

export const initialState = (): MenuState => ({
    items: [],
    isOpen: false,
    menuTitle: '',
    callbackData: {}
});
