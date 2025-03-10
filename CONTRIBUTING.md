# Contributing

Contributions are always welcome, no matter how large or small!

## Developing

_Node_: Check that Node is [installed](https://nodejs.org/en/download/) with version `>= 22`. You can check this with `node -v`.

_pnpm_: Make sure that pnpm is available. You can use `corepack enable` to automatically setup pnpm.

### Setup

To setup the project, run:

```sh
pnpm install
```

### Building

To build the projects, run:

```sh
pnpm build # An alias for `tsc --build`
```

The project is managed using TypeScript's [Project Reference](https://www.typescriptlang.org/docs/handbook/project-references.html#handbook-content).

So running `tsc --build` at the repository root can build all projects.

Also, the repository can also be built with [`turborepo`]. Running:

```sh
pnpm turbo build
```

will built all the projects and it's dependencies recursively with cache enabled.

#### Build with Watching

To build the projects and incrementally build files on change, run:

```sh
pnpm build --watch
```

### Running linting/tests

#### Lint

```sh
pnpm eslint .
```

- You can run eslint's auto-fix via:

```sh
pnpm eslint --fix .
```

#### Tests for all packages via [`vitest`](https://vitest.dev/):

```sh
pnpm test
```

#### Run tests for a specific package

When working on an issue, you will most likely want to focus on a particular packages. Using `--project` will only run tests for that specific package.

```sh
pnpm run test --project websocket
```

#### Run tests for a group of packages

You may also run tests of multiple projects together.

```sh
pnpm run test --project 'webpack/*'
```

#### Run a subset of tests

Pass the name of test suite to `pnpm test` to run a subset of tests by name:

```sh
pnpm run test server
```

<details>
  <summary>More options</summary>
  You can also use <code>describe.only</code> or <code>test.only</code> to select suites and tests.

```diff
-  test('run with webpack-dev-server', async () => {
+  test.only('run with webpack-dev-server', async () => {
```

</details>
<br>

#### Run test with Node debugger

Quick way to debug tests in VS Code is via `JavaScript Debug Terminal`.
Open a new `JavaScript Debug Terminal` and run `pnpm vitest`.
_This works with any code ran in Node, so will work with most JS testing frameworks._

See [Debugging Vitest](https://vitest.dev/guide/debugging.html) for more details.

You can combine debug with `--project` or `.only` to debug a subset of tests. If you plan to stay long in the debugger (which you'll likely do!), you may increase the test timeout by setting `--test-timeout`.

To overwrite any test fixtures when fixing a bug or anything, add the `--update`

```sh
pnpm run test --project websocket --update
```

#### Test coverage

To test the code coverage, use `--coverage`:

```sh
pnpm run test --coverage
```

### Writing API References

Each package should have its own API reference documentation.
It is generated by the comments of the public APIs using [API Extractor].

#### Update API References

To update the API reference, just run:

```bash
turbo api-extractor -- --local
```

This will update the `<projectFolder>/etc` which describe all the public APIs.
You should always commit the change to git.

## Submitting

### Generating changesets

We use [🦋 Changesets](https://github.com/changesets/changesets?tab=readme-ov-file) to manage versioning and changelogs.
Usually, you need to generate changeset(s) for your changes.

Just run:

```sh
pnpm changeset
```

Then select the correct packages with desired versions.
See [Adding a changeset](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md) for details.

Then commit the generated `.md` file in `.changeset/` and submit a PR on GitHub.

[API Extractor]: https://api-extractor.com/
[`turborepo`]: https://turbo.build/repo
