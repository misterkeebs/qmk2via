const { expect } = require('chai');
const Key = require('../src/Key');
const Kle = require('../src/Kle');

describe('Kle', async () => {
  it('renders key spaces', async () => {
    const keys = [
      Key.build({ x: 13, y: 0, w: 2, label: 'A' }),
      Key.build({ x: 15.5, y: 0, label: 'A' }),
      Key.build({ x: 16.5, y: 0, label: 'B' }),
    ];
    const kle = new Kle(keys);
    const layout = kle.asJson();
    expect(layout[0][0]).to.include({ x: 13, w: 2 });
    expect(layout[0][2]).to.eql({ x: 0.5 });
    expect(layout[0][4]).to.eql('B');
  });

  it('spaces keys', async () => {
    const keys = [
      Key.build({ row: 1, col: 14, w: 1.5, h: 1, x: 13.5, y: 1, label: '|' }),
      Key.build({ row: 1, col: 15, w: 1.25, h: 2, x: 15.5, y: 1, label: 'Enter' }),
    ];
    const kle = new Kle(keys);
    const layout = kle.asJson();
    expect(layout[1][2]).to.eql({ w: 1.25, w2: 1.5, h: 2, h2: 1, x: 0.5, x2: -0.25 });
  });

  it('renders a row', async () => {
    const keys = [
      Key.build({ row: 0, col: 0, w: 1, h: 1, x: 0, y: 0, label: '~' }),
      Key.build({ row: 0, col: 1, w: 1, h: 1, x: 1, y: 0, label: '!' }),
      Key.build({ row: 0, col: 2, w: 1, h: 1, x: 2, y: 0, label: '@' }),
      Key.build({ row: 0, col: 3, w: 1, h: 1, x: 3, y: 0, label: '#' }),
      Key.build({ row: 0, col: 4, w: 1, h: 1, x: 4, y: 0, label: '$' }),
      Key.build({ row: 0, col: 5, w: 1, h: 1, x: 5, y: 0, label: '%' }),
      Key.build({ row: 0, col: 6, w: 1, h: 1, x: 6, y: 0, label: '^' }),
      Key.build({ row: 0, col: 7, w: 1, h: 1, x: 7, y: 0, label: '&' }),
      Key.build({ row: 0, col: 8, w: 1, h: 1, x: 8, y: 0, label: '*' }),
      Key.build({ row: 0, col: 9, w: 1, h: 1, x: 9, y: 0, label: '(' }),
      Key.build({ row: 0, col: 10, w: 1, h: 1, x: 10, y: 0, label: ')' }),
      Key.build({ row: 0, col: 11, w: 1, h: 1, x: 11, y: 0, label: '_' }),
      Key.build({ row: 0, col: 12, w: 1, h: 1, x: 12, y: 0, label: '+' }),
      Key.build({ row: 0, col: 13, w: 2, h: 1, x: 13, y: 0, label: 'Backspace' }),
      Key.build({ row: 0, col: 13, w: 1, h: 1, x: 15.5, y: 0, label: '' }),
      Key.build({ row: 0, col: 14, w: 1, h: 1, x: 16.5, y: 0, label: '' }),
      Key.build({ row: 1, col: 0, w: 1.5, h: 1, x: 0, y: 1, label: 'Tab' }),
      Key.build({ row: 1, col: 1, w: 1, h: 1, x: 1.5, y: 1, label: 'Q' }),
      Key.build({ row: 1, col: 2, w: 1, h: 1, x: 2.5, y: 1, label: 'W' }),
      Key.build({ row: 1, col: 3, w: 1, h: 1, x: 3.5, y: 1, label: 'E' }),
      Key.build({ row: 1, col: 4, w: 1, h: 1, x: 4.5, y: 1, label: 'R' }),
      Key.build({ row: 1, col: 5, w: 1, h: 1, x: 5.5, y: 1, label: 'T' }),
      Key.build({ row: 1, col: 6, w: 1, h: 1, x: 6.5, y: 1, label: 'Y' }),
      Key.build({ row: 1, col: 7, w: 1, h: 1, x: 7.5, y: 1, label: 'U' }),
      Key.build({ row: 1, col: 8, w: 1, h: 1, x: 8.5, y: 1, label: 'I' }),
      Key.build({ row: 1, col: 9, w: 1, h: 1, x: 9.5, y: 1, label: 'O' }),
      Key.build({ row: 1, col: 10, w: 1, h: 1, x: 10.5, y: 1, label: 'P' }),
      Key.build({ row: 1, col: 11, w: 1, h: 1, x: 11.5, y: 1, label: '{' }),
      Key.build({ row: 1, col: 12, w: 1, h: 1, x: 12.5, y: 1, label: '}' }),
      Key.build({ row: 1, col: 14, w: 1.5, h: 1, x: 13.5, y: 1, label: '|' }),
      Key.build({ row: 2, col: 0, w: 1.25, h: 2, x: 15.5, y: 1, label: 'Enter' }),
    ];
    const kle = new Kle(keys);
    const layout = kle.asJson();
    expect(layout[1][16]).to.eql({ w: 1.25, w2: 1.5, h: 2, h2: 1, x: 0.5, x2: -0.25 });
  });


  it('renders a row', async () => {
    const keys = [
      Key.build({ row: 0, col: 0, w: 1, h: 1, x: 0, y: 0, label: '~' }),
      Key.build({ row: 0, col: 1, w: 1, h: 1, x: 1, y: 0, label: '!' }),
      Key.build({ row: 0, col: 2, w: 1, h: 1, x: 2, y: 0, label: '@' }),
      Key.build({ row: 0, col: 3, w: 1, h: 1, x: 3, y: 0, label: '#' }),
      Key.build({ row: 0, col: 4, w: 1, h: 1, x: 4, y: 0, label: '$' }),
      Key.build({ row: 0, col: 5, w: 1, h: 1, x: 5, y: 0, label: '%' }),
      Key.build({ row: 0, col: 6, w: 1, h: 1, x: 6, y: 0, label: '^' }),
      Key.build({ row: 0, col: 7, w: 1, h: 1, x: 7, y: 0, label: '&' }),
      Key.build({ row: 0, col: 8, w: 1, h: 1, x: 8, y: 0, label: '*' }),
      Key.build({ row: 0, col: 9, w: 1, h: 1, x: 9, y: 0, label: '(' }),
      Key.build({ row: 0, col: 10, w: 1, h: 1, x: 10, y: 0, label: ')' }),
      Key.build({ row: 0, col: 11, w: 1, h: 1, x: 11, y: 0, label: '_' }),
      Key.build({ row: 0, col: 12, w: 1, h: 1, x: 12, y: 0, label: '+' }),
      Key.build({ row: 0, col: 13, w: 2, h: 1, x: 13, y: 0, label: 'Backspace' }),
      Key.build({ row: 0, col: 13, w: 1, h: 1, x: 15.5, y: 0, label: '`' }),
      Key.build({ row: 0, col: 14, w: 1, h: 1, x: 16.5, y: 0, label: '&larr;' }),
      Key.build({ row: 1, col: 0, w: 1.5, h: 1, x: 0, y: 1, label: 'Tab' }),
      Key.build({ row: 1, col: 1, w: 1, h: 1, x: 1.5, y: 1, label: '<' }),
      Key.build({ row: 1, col: 2, w: 1, h: 1, x: 2.5, y: 1, label: '>' }),
      Key.build({ row: 1, col: 3, w: 1, h: 1, x: 3.5, y: 1, label: 'Nam\nE' }),
      Key.build({ row: 1, col: 4, w: 1, h: 1, x: 4.5, y: 1, label: 'R' }),
      Key.build({ row: 1, col: 5, w: 1, h: 1, x: 5.5, y: 1, label: 'T' }),
      Key.build({ row: 1, col: 6, w: 1, h: 1, x: 6.5, y: 1, label: 'Y' }),
      Key.build({ row: 1, col: 7, w: 1, h: 1, x: 7.5, y: 1, label: 'U' }),
      Key.build({ row: 1, col: 8, w: 1, h: 1, x: 8.5, y: 1, label: 'I' }),
      Key.build({ row: 1, col: 9, w: 1, h: 1, x: 9.5, y: 1, label: 'O' }),
      Key.build({ row: 1, col: 10, w: 1, h: 1, x: 10.5, y: 1, label: 'P' }),
      Key.build({ row: 1, col: 11, w: 1, h: 1, x: 11.5, y: 1, label: '{' }),
      Key.build({ row: 1, col: 12, w: 1, h: 1, x: 12.5, y: 1, label: '}' }),
      Key.build({ row: 1, col: 14, w: 1.5, h: 1, x: 13.5, y: 1, label: '|' }),
      Key.build({ row: 2, col: 0, w: 1.25, h: 2, x: 15.5, y: 1, label: 'Enter' }),
    ];
    const kle = new Kle(keys);
    const link = kle.toPermalink();
    expect(link).to.eql('http://www.keyboard-layout-editor.com##@@_c=#cccccc;&=~&=!&=/@&=#&=$&=%25&=%5E&=/&&=*&=(&=)&=/_&=+&_w:2;&=Backspace&_x:0.5;&=%60&=/&larr/;;&@_w:1.5;&=Tab&=%3C&=%3E&=Nam%0AE&=R&=T&=Y&=U&=I&=O&=P&=%7B&=%7D&_w:1.5;&=%7C&_w:1.25&h:2&x:0.5&w2:1.5&h2:1&x2:-0.25;&=Enter');
  });
});

