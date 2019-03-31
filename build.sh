# build.sh - utlities for building and running kurisubot
#
# ./build.sh build - transpile code, and move to the build/ dir
# ./build.sh run - run kurisubot
#

if [ "$1" = "build" ] # transpile the typescript
then
	tsc
	# create dir if not exists then copy transpiled files
	mkdir -p build/data && cp -R src/data build/
elif [ "$1" = "run" ] # run program
then
	# move to bot dir and run bot
	cd build && node bot.js
fi
