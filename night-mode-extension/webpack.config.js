const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    // Точки входа для разных частей расширения
    entry: {
        popup: './src/popup/popup.js',
        content: './src/content/content.js'
    },
    
    // Выходные файлы
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]/[name].js',
        clean: true  // Очищает dist перед сборкой
    },
    
    // Режим разработки
    mode: 'development',
    
    // Отключаем eval (важно для расширений Chrome!)
    devtool: false,
    
    // Правила обработки файлов
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    
    // Плагины
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'src/manifest.json', to: 'manifest.json' },
                { from: 'src/popup/popup.html', to: 'popup/popup.html' },
                { from: 'src/icons', to: 'icons' }
            ]
        })
    ]
};