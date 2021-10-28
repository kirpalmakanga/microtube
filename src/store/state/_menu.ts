export type MenuOpener = (
    callbackData: {
        title: string;
        callbackData: object;
        items: MenuItemData[];
    },
    menuTitle: string
) => void;

export interface MenuItemData {
    title: string;
    icon: string;
    onClick: (data: object) => void;
}

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
