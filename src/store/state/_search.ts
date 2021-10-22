export interface SearchState {
    items: object[];
    nextPageToken: string;
    hasNextPage: boolean;
    forMine: number;
    totalResults: number | null;
}

export const initialState = (): SearchState => ({
    items: [],
    nextPageToken: '',
    hasNextPage: true,
    forMine: 0,
    totalResults: null
});
