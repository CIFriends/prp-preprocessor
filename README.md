<div align="center">
<a href="https://github.com/CIFriends">
    <img src="https://raw.githubusercontent.com/CIFriends/brandkit/main/no-bg/cifriends.svg" alt="Logo" width="200px">
</a>

 # {prp-preprocessor}
 
 _A versatile GitHub Action that enables variable replacement in files using a simple_ `{_ variable _}` _syntax._

![Release](https://img.shields.io/github/v/release/CIFriends/prp-preprocessor?include_prereleases&sort=semver&logo=github)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/cifriends/prp-preprocessor/ci.yml?logo=github)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/cifriends/prp-preprocessor?logo=github)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=CIFriends_prp-preprocessor&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=CIFriends_prp-preprocessor)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=CIFriends_prp-preprocessor&metric=coverage)](https://sonarcloud.io/summary/new_code?id=CIFriends_prp-preprocessor)
</div>

## Installation

To install the PRP Preprocessor, you can add it as a step in your GitHub Actions workflow.
Here's an example of how to
use it:

```yml
steps:
  - name: PRP Preprocessor
    uses: CIFriends/prp-preprocessor@v1
    with:
      rootDir: './example'
```

## Inputs

The PRP Preprocessor accepts the following inputs:

| Name             | Description                                                                                                     | Required | Default                                                         |
|------------------|-----------------------------------------------------------------------------------------------------------------|----------|-----------------------------------------------------------------|
| `rootDir`        | The root directory to start searching for files.                                                                | Yes      | .                                                               |
| `extension`      | The extension of the files to process.                                                                          | Yes      | .prp                                                            |
| `includeSubDirs` | Whether to include subdirectories in the search for files.                                                      | No       | false                                                           |
| `ignoredVars`    | A list of variables to ignore.                                                                                  | No       | []                                                              |
| `ignoredDirs`    | A list of directories to ignore, according to the [.gitignore spec 2.22.1.](https://git-scm.com/docs/gitignore) | No       | `["node_modules",".git",".github","__tests__",".vscode",".idea"]` |
| `encodings`      | The encoding to use when reading and writing files.                                                             | No       | utf8                                                            |

## License

This project is licensed under the Apache-2.0 License.
