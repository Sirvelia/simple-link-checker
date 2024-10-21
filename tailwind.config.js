module.exports = {
    content: ['./resources/**/*.{php,js}', './Functionality/**/*.php', './Components/**/*.php'],
    theme: {
        extend: {
            colors: {},
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
    important: true,
    prefix: 'slc-',
    corePlugins: {
        preflight: false,
    }
};