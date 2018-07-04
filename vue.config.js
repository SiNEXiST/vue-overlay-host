if (process.env.npm_lifecycle_event === 'build:docs') {
    module.exports = {
        baseUrl: `/${process.env.npm_package_name}/`,
    };
} else {
    module.exports = {};
}
