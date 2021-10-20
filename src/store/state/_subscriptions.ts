import { ChannelData } from '../../../@types/alltypes';

export interface SubscriptionsState {
    items: ChannelData[];
    nextPageToken: String;
    totalResults: number | null;
    hasNextPage: boolean;
}

export const initialState: SubscriptionsState = {
    items: [],
    nextPageToken: '',
    totalResults: null,
    hasNextPage: true
};
