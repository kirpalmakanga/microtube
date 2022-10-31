import { defineConfig } from 'windicss/helpers';

export default defineConfig({
    theme: {
        extend: {
            colors: {
                primary: {
                    900: '#21222c',
                    800: '#333544',
                    700: '#46485d',
                    600: '#585b76',
                    500: '#6b6e8e',
                    400: '#8386a2',
                    300: '#9c9eb4',
                    200: '#b4b6c7',
                    100: '#cdced9'
                }
            },
            fontFamily: {
                open: '"Open Sans", sans-serif',
                montserrat: '"Montserrat", sans-serif'
            },
            cursor: {
                grab: 'grab',
                grabbing: 'grabbing'
            }
        }
    },
    plugins: [require('@windicss/plugin-scrollbar')]
});
