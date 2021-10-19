import { State } from '../helpers';
import { ChannelData } from '../../../@types/alltypes';

export interface SubscriptionsState extends State {
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
