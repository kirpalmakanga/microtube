import { connect } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';

import SearchForm from '../components/SearchForm';
import Icon from '../components/Icon';

import DropDown from '../components/DropDown';

import { setSearchTarget } from '../actions/youtube';

const SearchHeader = ({ isSignedIn, forMine, setSearchTarget }) => {
    const navigate = useNavigate();
    const { query } = useParams();

    const handleFormSubmit = (query) =>
        navigate(`/search/${query}`, { replace: true });

    const handleDropDownSelect = (value) => setSearchTarget(parseInt(value));

    return (
        <div className="layout__header-row">
            <Link
                className="layout__back-button icon-button"
                to="/"
                aria-label="Close search"
            >
                <Icon name="arrow-left" />
            </Link>

            <SearchForm query={query} onSubmit={handleFormSubmit} />

            {isSignedIn ? (
                <nav className="navigation">
                    <DropDown
                        currentValue={forMine}
                        options={[
                            { label: 'All videos', value: 0 },
                            { label: 'My Videos', value: 1 }
                        ]}
                        onSelect={handleDropDownSelect}
                    />
                </nav>
            ) : null}
        </div>
    );
};

const mapStateToProps = ({ auth: { isSignedIn }, search: { forMine } }) => ({
    isSignedIn,
    forMine
});

const mapDispatchToProps = {
    setSearchTarget
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchHeader);
