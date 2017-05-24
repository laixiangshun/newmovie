/**
 * Created by lailai on 2017/4/20.
 */
//配置grunt，自启动服务
module.exports=function(grunt){

    grunt.initConfig({
        watch: {
            jade: {
                files: ['views/**'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['public/js/**','models/**/*.js','schemas/**/*.js'],
                //tasks: ['jshint'],
                options: {
                    livereload: true //文件改动，重新启动服务
                }
            }
        },
        nodemon: {
            dev: {
                options: {
                    file: 'app.js',
                    args: [],
                    ignoredFiles: ['README.md','node_modules/**','.DS_Store'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['./'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 3000
                    },
                     cwd: __dirname
                }
            }
        },
        concurrent: {
            tasks: ['nodemon','watch'],
            options: {
                logConcurrentOutput: true
            }
        }
    });
    //加载安装组件
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.option('force',true);
    grunt.registerTask('default',['concurrent']);//grunt默认task
};