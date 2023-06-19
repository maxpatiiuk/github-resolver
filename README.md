# CLI integration with GitHub Web UI

A CLI script for rapidly opening the GitHub webpage for current file/folder on a
correct branch.

It can also do the reverse: given a github URL, open that file locally

- Supports GitHub Enterprise
- Supports repositories cloned with SSH
- Supports multiple git remotes

## Installation

Node.js 16+ is required

Install dependencies:

```
npm install
```

Add this to your shell init file. Change the "dir" variable to the directory
in which this repository is located.

```sh
g() {
  local dir=~/site/javascript/github-resolver
  local output=$(node "${dir}/dist/main.js" $@)
  if [[ "${output}" =~ "^cd " ]]; then
    eval ${output}
  else
    echo "${output}"
  fi
}

```

## Open current directory in GitHub

Open your terminal to any directory inside a clonned repository. Then:

```sh
# Open current folder on current branch in GitHub
g

# Open ./main.js on current branch in GitHub
# All of these varians do the same thing. Pick whichever you like:
g main.js
g ./main.js
g --file ./main.js
g --file=./main.js
g -f./main.js

# Open ../main.js on production in GitHub
g ../main.js production
g production ../main.js
g --branch=production --file=../main.js
g -b=production -f ../main.js

# Open current folder on the production branch on the URL configuered for git remote "origin2"
g production origin2
g --branch production --remote origin2
g origin2 production

# By adding "--dry", you can output the web url, but don't open it
g ./main.js --dry
# Could even write it to file:
g ./main.js --dry > url.txt
# Or pass to a different program:
g ./main.js --dry | less
```

## Open GitHub Webpage in terminal

Navigates to the directory or the file based on GitHub URL.

Before running the script, `cd` to correct repository.

For example, this will navigate to the root directory of current repository:

```sh
g https://github.com/specify/specify7/tree/production/
```

Besides navigation, it would also list files in that directory using `ls`
command. That behaviour can be customized by setting `LIST_FILES` environment
variable to the command you want to run instead

For example:

```sh
# In the init file:
export LIST_FILES="ls -ahl"

# Later:
g https://github.com/specify/specify7/tree/production/
```

And this will open the `README.md` file in your editor:

```sh
g https://github.com/specify/specify7/blob/production/README.md
```

You can customize the used editor by setting an `EDITOR` environment variable:
```sh
# In the init file:
export EDITOR="vim"

# Later:
g https://github.com/specify/specify7/tree/production/
```

By default it would use system's default editor associated with the file
extension of the file you are trying to open.

> Note, this script would not change the current branch as that could lead to
> loss of uncommitted changes
