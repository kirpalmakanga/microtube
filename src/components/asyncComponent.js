import React, { Component } from 'react';

const asyncComponent = (importComponent) =>
    class extends Component {
        state = {
            component: null
        };

        async componentDidMount() {
            const { default: component } = await importComponent();

            this.setState({ component });
        }

        render() {
            const {
                props,
                state: { component: C }
            } = this;

            return C ? <C {...props} /> : null;
        }
    };

export default asyncComponent;
