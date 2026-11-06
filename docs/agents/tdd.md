# TDD workflow

Read this before starting any feature, use case, value object or bug fix.

Every feature, use case, value object or bug fix follows this loop. Don't write production code before its test exists and has failed.

1. **Define the behaviour first.** Before you touch `src/`, list in the spec what the feature must do and every edge case it must handle. Write them as `it.todo('...')` entries in the mirrored spec file under `test/`. For a use case, cover at least:
   - the happy path;
   - each invalid input (one case per value object rule: empty, malformed, out of range...);
   - boundary values (min/max length, empty lists, a single element);
   - what the ports return or throw (not found, duplicates, repository errors);
   - what must **not** happen (e.g. `save` is not called when validation fails).

   If the user gave no spec, propose this list to them and get agreement before implementing.
2. **Red.** Turn the `todo`s into real tests, using Object Mothers for the data and mocked ports. Run `npm test` and check that they **fail for the expected reason** (missing behaviour, not a typo or a broken import).
3. **Green.** Write the **minimum** production code that makes the tests pass. Nothing that no test asks for.
4. **Refactor.** Clean up the code and the tests with the suite green, then run the full check (`build`, `test`, `test:e2e`, `lint`).

Repeat the loop per behaviour; don't write every test up front for a big feature. A bug fix starts with a test that reproduces the bug.

How to write the tests: [testing.md](testing.md).
