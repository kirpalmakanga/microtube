export interface SubscriptionsState {
    items: ChannelData[];
    nextPageToken: string;
    totalResults: number | null;
    hasNextPage: boolean;
}

export const initialState = (): SubscriptionsState => ({
    items: [],
    nextPageToken: '',
    totalResults: null,
    hasNextPage: true
});
