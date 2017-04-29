/* Created by Aquariuslt on 15/04/2017.*/
import gulp from 'gulp';
import gutil from 'gulp-util';
import sequence from 'gulp-sequence';

import webpack from 'webpack';

import config from './config/base.config';
import webpackProdConfig from './config/webpack.prod.config.babel';
import logger from './util/logger';

gulp.task('build:prod', sequence(['clean'], ['build'], ['webpack'], ['sitemap'], ['pwa'], ['cname'], ['move']));

gulp.task('build', sequence(['properties'], ['posts']));

gulp.task('webpack', function (done) {
  logger.info('Webpack building.');
  webpack(webpackProdConfig, function (error, stats) {
    if (error) {
      throw new gutil.PluginError('webpack', error);
    }
    gutil.log(stats.toString(webpackProdConfig.stats));
    logger.info('Webpack build done');
    done();
  });
});

gulp.task('move', function () {
  logger.info('Moving build dir files into dist folder');
  gulp.src(config.dir.build + '/**/*')
    .pipe(gulp.dest(config.dir.dist));
  logger.info('Move done');
});




