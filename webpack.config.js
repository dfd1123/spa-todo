/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */


const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const webpackMode = process.env.NODE_ENV || 'development';

module.exports = {
	mode: webpackMode,
	entry: {
		main: './src/main.ts',
	},
	resolve: {
		extensions: [".ts", ".js"],
		alias: {
			'@': path.resolve(__dirname, './src'),
            '@styles': path.resolve(__dirname, './src/styles'),
			'@components': path.resolve(__dirname, './src/views/components'),
			'@pages': path.resolve(__dirname, './src/views/pages'),
		},
	},
	output: {
		path: path.resolve('./dist'),
		publicPath: '/',
		filename: '[name].min.js'
	},
	devServer: {
		// contentBase: path.join(__dirname, "./public"),
		hot: true,
		port: 9000,
		historyApiFallback: true,
	},
	optimization: {
		minimizer: webpackMode === 'production' ? [
			new TerserPlugin({
				terserOptions: {
					compress: {
						drop_console: true
					}
				}
			})
		] : [],
		splitChunks: {
			chunks: 'all'
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(ts|js)?$/,
				enforce: 'pre',
				use: ['source-map-loader'],
			},
			{
				test: /\.(ts|js)?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							sourceMap: true,
							importLoaders: 1,
						},
					},
					{
						loader: "sass-loader",
						options: {
							additionalData: `@import "@/styles/style.scss";`,
							sourceMap: true,
						},
					},
				],
			},
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './public/index.html',
			minify: process.env.NODE_ENV === 'production' ? {
				collapseWhitespace: true,
				removeComments: true,
			} : false
		}),
		new MiniCssExtractPlugin({
			filename: "styles.css",
		}),
	]
};