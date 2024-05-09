# PRP Preprocessor

The PRP Preprocessor is a GitHub Action that allows you to replace variables in a text file. The variables are defined
in a map and can be used in the text file with the following syntax: `{_ variable _}`. Spaces are allowed around the
variable name.

## Installation

To install the PRP Preprocessor, you can add it as a step in your GitHub Actions workflow.
Here's an example of how to
use it:

```yaml
steps:
  - name: PRP Preprocessor
    uses: CIFriends/prp-preprocessor@v1
    with:
      rootDir: './example'
      extension: '.prp'
```

## Usage

> [!NOTE]
> TODO

## Inputs

The PRP Preprocessor accepts the following inputs:

| Name             | Description                                                                                                     | Required | Default                                                         |
|------------------|-----------------------------------------------------------------------------------------------------------------|----------|-----------------------------------------------------------------|
| `rootDir`        | The root directory to start searching for files.                                                                | Yes      | .                                                               |
| `extension`      | The extension of the files to process.                                                                          | Yes      | .prp                                                            |
| `includeSubDirs` | Whether to include subdirectories in the search for files.                                                      | No       | false                                                           |
| `ignoredVars`    | A list of variables to ignore.                                                                                  | No       | []                                                              |
| `ignoredDirs`    | A list of directories to ignore, according to the [.gitignore spec 2.22.1.](https://git-scm.com/docs/gitignore) | No       | ["node_modules",".git",".github","__tests__",".vscode",".idea"] |
| `encodings`      | The encoding to use when reading and writing files.                                                             | No       | utf8                                                            |

## Outputs

The PRP Preprocessor does not produce any outputs.

## License

This project is licensed under the Apache-2.0 License.
