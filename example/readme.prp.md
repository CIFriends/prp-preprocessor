## Tutorial

This action allows you to replace variables in a text file. The variables are defined in a map and can be used in the
text file with the following syntax: `{_ variable _}`. Spaces are allowed around the variable name.

### Example

Here's an example of how to use:

```typescript
import { processFiles } from 'library';

const variables = new Map<string, string>();
variables.set('EXAMPLE', 'World');
variables.set('what', 'Hello');

processFiles({
  files: ['readme.prp.md'],
  variables: variables,
  encodings: 'utf8',
  extension: '.prp.md'
});
```

### Greetings

{_ what _}, {_ EXAMPLE _}! {_what _} {_ EXAMPLE_}{_what_}

### Complex Variables

This section includes variables with more complex names to test the robustness of the regular expression in
the `replaceVariables` function.

{_ variable with spaces _}
{_ variable_with_underscores _}
{_ variable-with-dashes _}
{_ variable.with.dots _}