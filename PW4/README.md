# Dijkstra algorithm: implement by test

## Install the dependencies
```bash
npm install
```

## Code coverage

### VSCode

If you use vscode, install the "Code Coverage" extension

### vim

If you use vim, use the [musinux/coverage.vim](https://github.com/Musinux/coverage.vim) extension


## Running the tests

Then, for a one-time test:
```bash
npm test
```

When you want to update your tests at any modification:
```bash
npm run test-watch
```

The lines of your code not covered by the tests should appear in your text editor (vim=red circles at the start of the line, vscode=underlined lines)

## Implement The Shortest Path First

Go to the file `dijkstra.js` and code the function