# FLOW3 Development Helper

## Features

* Monitor class files for changes, and trigger compilation automatically
* Log Viewer (Security and Main Log)

## Setup Mac

* add the following to your /etc/sudoers
> sebastian ALL = NOPASSWD:/Applications/fseventer/fseventer.app/Contents/Resources/fetool
> sebastian ALL = NOPASSWD:/usr/bin/killall fetool

* Use the following config
> {
> 	'FLOW3Instances': {
> 		'Conference': '/Users/sebastian/htdocs/Conference/',
> 		'Base': '/Users/sebastian/htdocs/FLOW3Base/',
> 		'Blog': '/Users/sebastian/htdocs/BlogExample/'
> 	},
> 	'Programs': {
> 		'FileSystemEvents': ['sudo', '/Applications/fseventer/fseventer.app/Contents/Resources/fetool']
> 	}
> }