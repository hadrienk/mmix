var test = require('./templates').$X$Y$Z;

describe('Bytewise Operations', function() {
  test('BDIF', [
    ['000000000000000F', '0000000000000009', '0000000000000006'],
    ['00000000000000FF', '000000000000000F', '00000000000000F0'],
    ['0000000000000104', '0000000000000008', '0000000000000000'],
    ['0000000000000104', '0000000000000002', '0000000000000002'],
    ['0000000000000040', '000000000000007F', '0000000000000000'],
  ]);

  test('WDIF', [
    ['000000000000000F', '0000000000000004', '000000000000000B'],
    ['0000000000000104', '0000000000000008', '00000000000000FC'],
    ['000000000000FFFF', '8888888888888888', '0000000000007777'],
    ['0000000000007777', '0000000000009999', '0000000000000000'],
    ['0000000000000000', '0000000000000000', '0000000000000000'],
  ]);

  test('TDIF', [
    ['000000000000000F', '0000000000000008', '0000000000000007'],
    ['0000000800000004', '0000000000000004', '0000000000000000'],
    ['BBBBBBBBBBBBBBBB', 'AAAAAAAAAAAAAAAA', '0000000011111111'],
    ['AAAAAAAAAAAAAAAA', 'BBBBBBBBBBBBBBBB', '0000000000000000'],
  ]);

  test('ODIF', [
    ['CCCCCCCCCCCCCCCC', 'EEEEEEEEEEEEEEEE', '0000000000000000'],
    ['EEEEEEEEEEEEEEEE', '2222222222222222', 'CCCCCCCCCCCCCCCC'],
  ]);

  test('MOR', [
    ['9E3779B97F4A7C16', '902E7AFBBECBCD78', '0000000000000000'],
    ['FFFFFFFF00000000', '0000000000000000', 'FFFFFFFF00000000'],
    ['00000000FFFFFFFF', 'FFFFFFFFFFFFFFFF', 'FFFFFFFFFFFFFFFF'],
  ]);

  test('MXOR', [
    ['9E3779B97F4A7C16', '902E7AFBBECBCD78', '0000000000000000'],
    ['FFFFFFFF00000000', '0000000000000000', 'FFFFFFFF00000000'],
    ['00000000FFFFFFFF', 'FFFFFFFFFFFFFFFF', 'FFFFFFFF00000000'],
  ]);
});
