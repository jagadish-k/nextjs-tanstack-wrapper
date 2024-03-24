## A Wrapper on Tanstack Table

In this experiment, I am trying to build a wrapper on [Tanstack Table v8](https://tanstack.com/table/v8) that gives me the following capabilities.

- Should work in Next.js
- Should support custom Types (using Generics)
- Should allow [row selection](https://tanstack.com/table/v8/docs/guide/row-selection) in `single` and `multiple` mode.
- Should show a radio button in the first column if in `single` mode.
- Should show a checkbox in first column including the select all checkbox when in `multiple` mode.

## Problems encountered.

When I tried to put a prop `onRowSelect` on the wrapper component that would be called when `rowSelectionState` changes inside the wrapper, I ran into an infinite render situation.

### Where can I see.

```
> npm i
> npm run dev
```

Open [localhost](http://localhost:3000). You will see 3 versions of the table.

- Static version with pagination.
- Single Selection.
- Multiple Selection.

The idea is to be able to use this with the reducer pattern so that the component can be used in a complex application.
