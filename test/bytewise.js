var test = require('./templates').$X$Y$Z;

describe('Bytewise Operations', function() {
  test('BDIF', [
    ['000000000000000F', '0000000000000009', '0000000000000006'],
    ['00000000000000FF', '000000000000000F', '00000000000000F0'],
    ['0000000000000104', '0000000000000008', '0000000000000000'],
    ['0000000000000104', '0000000000000002', '0000000000000002'],
    ['0000000000000040', '000000000000007F', '0000000000000000'],
  ]);
});
