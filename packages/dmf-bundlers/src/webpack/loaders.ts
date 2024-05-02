const fs = require('fs');

/** Minimal configuration for css loader */
const cssLoader = (hasCssModules = false) => {
    const cssLoaderConfig = {
        loader: 'css-loader',
        options: {
            sourceMap: true,
        },
    };
    if (hasCssModules) {
        //@ts-ignore
        cssLoaderConfig.options.modules = true;
        //@ts-ignore
        cssLoaderConfig.options.importLoaders = 2;
    }
    return cssLoaderConfig;
};

/** Minimal configuration for postcss loader */
const postCssLoader = {
    loader: 'postcss-loader',
    options: { sourceMap: true },
};

/** Minimal configuration for sass loader */
const sassLoader = {
    loader: 'sass-loader',
    options: {
        sassOptions: { quietDeps: true },
        sourceMap: true,
    },
};

/** Main environment variable loader */
const envLoader = () => {
    const filePath = '../../host/.env';
    if (fs.existsSync(filePath) && process.env.NODE_ENV === 'development') {
        require('dotenv').config({ path: filePath });
    } else {
        require('dotenv').config();
    }
}

export default {
    cssLoader,
    postCssLoader,
    sassLoader,
    envLoader
}