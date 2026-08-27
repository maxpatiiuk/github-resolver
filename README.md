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

Add this to your shell init file. Change the "dir" variable to the directory in
which this repository is located.

```sh
gu() {
  local dir=~/s/javascript/github-resolver
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
gu

# Open ./main.js on current branch in GitHub
# All of these varians do the same thing. Pick whichever you like:
gu main.js
gu ./main.js
gu --file ./main.js
gu --file=./main.js
gu -f./main.js

# Open ../main.js on production in GitHub
gu ../main.js production
gu production ../main.js
gu --branch=production --file=../main.js
gu -b=production -f ../main.js

# Open current folder on the production branch on the URL configuered for git remote "origin2"
gu production origin2
gu --branch production --remote origin2
gu origin2 production

# Open the pull request for the current branch, if one exists.
# Otherwise, open the repository pull requests page. Requires the GitHub CLI
# (`gh`) to detect an existing pull request.
gu --pr

# By adding "--dry", you can output the web url, but don't open it
gu ./main.js --dry
# Could even write it to file:
gu ./main.js --dry > url.txt
# Or pass to a different program:
gu ./main.js --dry | less
```

## Open GitHub Webpage in terminal

Navigates to the directory or the file based on GitHub URL.

Before running the script, `cd` to correct repository.

For example, this will navigate to the root directory of current repository:

```sh
gu https://github.com/specify/specify7/tree/production/
```

Besides navigation, it would also list files in that directory using `ls`
command. That behaviour can be customized by setting `LIST_FILES` environment
variable to the command you want to run instead

For example:

```sh
# In the init file:
export LIST_FILES="ls -ahl"

# Later:
gu https://github.com/specify/specify7/tree/production/
```

And this will open the `README.md` file in your editor:

```sh
gu https://github.com/specify/specify7/blob/production/README.md
```

You can customize the used editor by setting an `EDITOR` environment variable:

```sh
# In the init file:
export EDITOR="vim"

# Later:
gu https://github.com/specify/specify7/tree/production/
```

By default it would use system's default editor associated with the file
extension of the file you are trying to open.

> Note, this script would not change the current branch as that could lead to
> loss of uncommitted changes
