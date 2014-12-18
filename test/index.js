var expect = require('chai').expect;
var nth = require('highlandx/nth');
var MMIX = require('../');
var Memory = require('../memory');
var utils = require('../utils');

describe('Load From Memory Operations', function() {
  var memory = new Memory();
  var mmix = new MMIX(memory);
  var tests = [
    //value in $2, value in $3, address, octabyte at the memory address
    ['00000000000003E8', '0000000000000002', '00000000000003EA', '0123456789ABCDEF'],
    ['00000000000003E8', '0000000000000005', '00000000000003ED', '0123456789ABCDEF'],
  ];
  var Y = nth(0);
  var Z = nth(1);
  var address = nth(2);
  var data = nth(3);

  function test(op, answers) {
    describe(op, function() {
      tests.forEach(function(t, i) {
        describe(['$2 = ', Y(t), ', $3 = ', Z(t), ', M_8[', address(t), '] = ', data(t)].join(''), function() {
          before(function() {
            mmix.registers.$2 = Y(t);
            mmix.registers.$3 = Z(t);
            memory.setOcta(data(t), utils.uint64(address(t)));
          });

          describe([op, '$1,$2,$3'].join(' '), function() {
            it(['should set register $1 to', answers[i]].join(' '), function() {
              mmix[op]('$1', '$2', '$3');
              expect(mmix.registers.$1).to.equal(answers[i]);
            });
          });
        });
      });
    });
  }

  test('LDB', [
    '0000000000000045',
    'FFFFFFFFFFFFFFAB'
  ]);

  test('LDW', [
    '0000000000004567',
    'FFFFFFFFFFFF89AB',
  ]);

  test('LDT', [
    '0000000001234567',
    'FFFFFFFF89ABCDEF',
  ]);

  test('LDO', [
    '0123456789ABCDEF',
    '0123456789ABCDEF',
  ]);

  test('LDBU', [
    '0000000000000045',
    '00000000000000AB',
  ]);

  test('LDWU', [
    '0000000000004567',
    '00000000000089AB',
  ]);

  test('LDTU', [
    '0000000001234567',
    '0000000089ABCDEF',
  ]);

  test('LDOU', [
    '0123456789ABCDEF',
    '0123456789ABCDEF',
  ]);

  test('LDTH', [
    '0123456700000000',
    '89ABCDEF00000000',
  ]);
});

describe('Load Address Operation', function() {
  var mmix = new MMIX();
  var $1 = '0000000000000190';
  var $2 = '00000000000000F4';
  var $3 = '000000000000009C';

  describe(['$2 =', $2, '$3 =', $3].join(' '), function() {
    before(function() {
      mmix.registers.$2 = $2;
      mmix.registers.$3 = $3;
    });

    describe('LDA $X, $Y, $Z', function() {
      it(['should set $1 to', $1].join(' '), function() {
        mmix.LDA('$1', '$2', '$3');
        expect(mmix.registers.$1).to.equal($1);
      });
    });
  });
});

describe('Store Operations', function() {
  var memory = new Memory();
  var mmix = new MMIX(memory);
  var tests = [
    //$1 data, $2 data, $3 data, address, octa at address
    ['FFFFFFFFFFFF0000', '00000000000003E8', '0000000000000002', '00000000000003EA', '0123456789ABCDEF'],
  ];
  var $1 = nth(0);
  var $2 = nth(1);
  var $3 = nth(2);
  var addr = nth(3);
  var memOcta = nth(4);

  function test(op, answers) {
    describe(op, function() {
      tests.forEach(function(t, i) {
        describe(['$1 = ', $1(t), ', $2 = ', $2(t), ', $3 = ', $3(t), ', M_8[', addr(t), '] = ', memOcta(t)].join(''), function() {
          before(function() {
            memory.setOcta(memOcta(t), utils.uint64(addr(t)));
            mmix.registers.$1 = $1(t);
            mmix.registers.$2 = $2(t);
            mmix.registers.$3 = $3(t);
          });

          describe([op, '$1,$2,$3'].join(' '), function() {
            it(['should set the octabyte at M_8[', addr(t), '] to ', answers[i]].join(''), function() {
              mmix[op]('$1', '$2', '$3');
              var octa = memory.getOcta(utils.uint64(addr(t)));
              expect(octa).to.equal(answers[i]);
            });
          });
        });
      });
    });
  }

  test('STB', [
    '0123006789ABCDEF'
  ]);

  test('STW', [
    '0123000089ABCDEF'
  ]);

  test('STT', [
    'FFFF000089ABCDEF'
  ]);

  test('STO', [
    'FFFFFFFFFFFF0000'
  ]);

  test('STBU', [
    '0123006789ABCDEF'
  ]);

  test('STWU', [
    '0123000089ABCDEF'
  ]);

  test('STTU', [
    'FFFF000089ABCDEF'
  ]);

  test('STOU', [
    'FFFFFFFFFFFF0000'
  ]);

  test('STHT', [
    'FFFFFFFF89ABCDEF'
  ]);

  describe('STCO', function() {
    before(function() {
      memory.setOcta('0123456789ABCDEF', utils.uint64('00000000000003EA'));
      mmix.registers.$2 = '00000000000003EA';
      mmix.registers.$3 = '0000000000000002';
    });

    it('should store an unsigned byte in a memory octabyte.', function() {
      mmix.STCO('88', '$2', '$3');
      var octa = memory.getOcta(utils.uint64('00000000000003E8'));
      expect(octa).to.equal('0000000000000088');
    });
  });
});

describe('Arithmetic Operations', function() {
  var mmix = new MMIX();
  var tests = [
    //Y, Z
    ['0000000000000001', '0000000000000001'],
    ['0000000000000002', 'FFFFFFFFFFFFFFFE'],
    ['FFFFFFFFFFFFFFFF', 'FFFFFFFFFFFFFFFF'],
    ['FFFFFFFFFFFFFFFF', '0000000000000002'],
    ['0000000000000003', '0000000000000000'],
  ];
  var Y = nth(0);
  var Z = nth(1);

  var test = function(op, answers) {
    tests.forEach(function(t, i) {
      describe(['$2 ==', Y(t), '&& $3 ==', Z(t)].join(' '), function() {
        before(function() {
          mmix.registers.$2 = Y(t);
          mmix.registers.$3 = Z(t);
        });

        describe([op, '$1,$2,$3'].join(' '), function() {
          it(['should set $1 to', answers[i][0]].join(' '), function() {
            mmix[op]('$1', '$2', '$3');
            expect(mmix.registers.$1).to.equal(answers[i][0]);
          });

          if (op === 'DIV') {
            it(['should set the remainder register to', answers[i][1]].join(' '), function() {
              expect(mmix.registers.rR).to.equal(answers[i][1]);
            });
          }
        });
      });
    });
  };

  test('ADD', [
    ['0000000000000002'],
    ['0000000000000000'],
    ['FFFFFFFFFFFFFFFE'],
    ['0000000000000001'],
    ['0000000000000003'],
  ]);

  test('SUB', [
    ['0000000000000000'],
    ['0000000000000004'],
    ['0000000000000000'],
    ['FFFFFFFFFFFFFFFD'],
    ['0000000000000003'],
  ]);

  test('MUL', [
    ['0000000000000001'],
    ['FFFFFFFFFFFFFFFC'],
    ['0000000000000001'],
    ['FFFFFFFFFFFFFFFE'],
    ['0000000000000000'],
  ]);

  test('DIV', [
    ['0000000000000001', '0000000000000000'],
    ['FFFFFFFFFFFFFFFF', '0000000000000000'],
    ['0000000000000001', '0000000000000000'],
    ['0000000000000000', 'FFFFFFFFFFFFFFFF'],
    ['0000000000000000', '0000000000000003'],
  ]);

  test('ADDU', [
    ['0000000000000002'],
    ['0000000000000000'],
    ['FFFFFFFFFFFFFFFE'],
    ['0000000000000001'],
    ['0000000000000003'],
  ]);

  test('SUBU', [
    ['0000000000000000'],
    ['0000000000000004'],
    ['0000000000000000'],
    ['FFFFFFFFFFFFFFFD'],
    ['0000000000000003'],
  ]);
});
