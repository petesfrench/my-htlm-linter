## My HTML parser

This is a simple linter that I built to catch some small bugs and mistakes in HTML that I sometimes miss. It doesn't work all the time and it catches wierdly specific things (things that aren't being caught in other linters)

## Making it executable from anywhere (linux)

You don't have to do this but it makes it a hell of a lot more useable

1. Make the file executable (if it's not already)
```
$ chmod +x /path/to/the/script/index.js
```

2. Make a symbolic link (I called it 'plint')
```
$ sudo ln -s /path/to/the/script/index.js /usr/local/bin/plint
```

3. Execute from anywhere!
```
plint templates/folder/file.html
```