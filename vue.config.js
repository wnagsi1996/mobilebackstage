const path = require("path");
const resolve = function(dir) {
  return path.join(__dirname, dir);
};

const webpack=require('webpack')
module.exports={
	publicPath: process.env.NODE_ENV === "production" ? "/mmain" : "./",
	//publicPath:'./',
	productionSourceMap: false,
	outputDir: 'mmain',
	devServer:{
		// host:'192.168.111.1',
		// port:8080,
		proxy:{
			'/Handler':{
				target:'http://192.168.123.121',
				changeOrigin:true,
				pathRewrite:{
					'^/Handler':''
				}
			}
		}
	},
	css: {
		loaderOptions: {
			css: {
				// options here will be passed to css-loader
			},
			postcss: {
				// options here will be passed to postcss-loader
				plugins: [require('postcss-px2rem')({
					remUnit: 37.5  //设计稿的尺寸是750px 就需要除2，这里是375px
				})]
			}
		}
	},
	configureWebpack: (config)=>{
	    if(process.env.NODE_ENV === 'production'){
	      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
	    }
	  }
}

