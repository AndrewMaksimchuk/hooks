Hooks


Git  
If you want use git hooks, then save in 'hooks' directory in project and  
when they needed just copy to '.git/hooks' directory, like in example.  
- commit-msg  
```cp ./commit-msg ./.git/hooks```



Application  
Example of usage from 'Makefile':
```
release:
	# run tests before all commands, if tests faul exit with error message
	git log master..dev --oneline | sort | node hooks/version.js && node hooks/tag.js
	git log master..dev --oneline | sort | node hooks/changelog.js
	node hooks/release.js
	git checkout master
	git merge dev
	git push origin master && git ftp push
```