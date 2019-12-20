import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    searchVideos,
    clearSearch,
    editPlaylistItem,
    queueItem,
    playItem
} from '../actions/youtube';

import List from '../components/List';

import VideoCard from '../components/cards/VideoCard';
import Placeholder from '../components/Placeholder';

import MenuWrapper from '../components/menu/MenuWrapper';

class Search extends Component {
    state = {
        mountGrid: true
    };

    reloadQuery = () => {
        const { clearSearch } = this.props;

        this.setState({ mountGrid: false }, () => {
            clearSearch();

            this.setState({ mountGrid: true });
        });
    };

    componentWillUnmount() {
        this.props.clearSearch();
    }

    componentDidUpdate({ query, forMine }) {
        const {
            props: { query: newQuery, forMine: newForMine },
            reloadQuery
        } = this;

        if (newQuery !== query || newForMine !== forMine) {
            reloadQuery();
        }
    }

    render() {
        const {
            props: {
                query,
                items,
                totalResults,
                searchVideos,
                playItem,
                queueItem,
                editPlaylistItem
            },
            state: { mountGrid }
        } = this;

        return query && mountGrid ? (
            totalResults === 0 ? (
                <Placeholder icon="empty" text="No results found." />
            ) : (
                <MenuWrapper
                    menuItems={[
                        {
                            title: `Add to queue`,
                            icon: 'queue',
                            onClick: queueItem
                        },
                        {
                            title: `Add to playlist`,
                            icon: 'playlist-add',
                            onClick: ({ id }) => editPlaylistItem(id)
                        }
                    ]}
                >
                    {(openMenu) => (
                        <List
                            items={items}
                            itemKey={(index, data) => data[index].id}
                            loadMoreItems={() => searchVideos({ query })}
                            renderItem={({ data }) => (
                                <VideoCard
                                    {...data}
                                    onClick={() => playItem(data)}
                                    onClickMenu={() =>
                                        openMenu(data, data.title)
                                    }
                                />
                            )}
                        />
                    )}
                </MenuWrapper>
            )
        ) : null;
    }
}

const mapStateToProps = (
    { search: { items, forMine, totalResults } },
    {
        match: {
            params: { query = '' }
        }
    }
) => ({
    query,
    forMine,
    items,
    totalResults
});

const mapDispatchToProps = {
    searchVideos,
    clearSearch,
    queueItem,
    playItem,
    editPlaylistItem
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
