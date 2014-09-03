/**
 * @fileOverview
 * grunt commands for grunt-cli that will make your life better!
 *
 * @author Pieces029
 */
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        watch: {
            livereload: {
                files: ['src/index.html', 'src/slides/*'],
                tasks: 'htmllint',
                options: {
                    livereload: true
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 8888,
                    base: 'src',
                    keepalive: true,
                    hostname: '127.0.0.1',
                    livereload: true
                }
            }
        },
        concurrent: {
            target: {
                tasks: ['connect', 'watch', 'open:connect'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        open: {
            connect: {
                path: 'http://127.0.0.1:8888',
                app: 'google-chrome'
            },
            dev: {
                path: 'src/index.html',
                app: 'google-chrome'
            }
        },
        htmllint: {
            all: ["src/index.html"]
        },
        imagemin: {
            dynamic: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['**/*.{png,jpg,gif}'],
                        dest: 'src/'
                    }
                ]
            }
        },
        clean: {
            build: [
                "dist/css",
                "dist/fonts",
                "dist/images",
                "dist/lib",
                "dist/index.html"
            ]
        },
        copy: {
            release: {
                expand: true,
                cwd: 'src/',
                src: '**',
                dest: 'dist/'
            },
            releaseReplace: { // Done this way instead of with regular copy is it screws up the image files that are being copied over
                src: 'dist/index.html',
                dest: 'dist/index.html',
                options: {
                    process: function (content, srcpath) { // Remove remote from release/gh-pages version
                        return content.replace(
                            "{ src: 'lib/reveal.js/plugin/remotes/remotes.js', async: true, condition: function () { return !!document.body.classList; }}",
                            ""
                        );
                    }
                }
            }
        },
        'gh-pages': {
            target: {
                options: {
                    // The default commit message for the gh-pages branch
                    message: 'pushing updates',
                    base: 'dist'
                },
                // The folder where your gh-pages repo is
                src: '**/*'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-html');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-gh-pages');


    // Default task
    grunt.registerTask('default', ['help']);

    grunt.registerTask('help', 'Prints out the specific details of each command', function () {
        console.log("Available Commands");
        console.log("  dev:\tRuns all dev commands, if your are developing you want this");
        console.log("  release:\tRuns all releases commands putting content in the dist folder");
        console.log("  deploy:\tRuns release, and pushes content to GitHub pages");
        console.log("  watch:\tAuto pushes updates to the browser on save");
        console.log("  connect:\tStart a local server for testing on port 8888");
        console.log("  open:connect\tOpens Google Chrome to the index page on port 8888");
        console.log("  open:dev\tOpens the html file in chrome");
        console.log("  imagemin\tOptimize your images for the web");
    });

    grunt.registerTask('dev', 'Runs all dev commands, if your are developing you want this', 'concurrent:target');

    grunt.registerTask('release', 'Creates the release build and publishes it to github pages',
        [
            'clean:build',
            'imagemin',
            'copy:release',
            'copy:releaseReplace'
        ]
    );

    grunt.registerTask('deploy', ['release', 'gh-pages:target']);
};
