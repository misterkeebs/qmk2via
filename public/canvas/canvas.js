function drawRect(ctx, x, y, w, h, radius) {
  const r = x + w;
  const b = y + h;

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(r - radius, y);
  ctx.quadraticCurveTo(r, y, r, y + radius);
  ctx.lineTo(r, y + h - radius);
  ctx.quadraticCurveTo(r, b, r - radius, b);
  ctx.lineTo(x + radius, b);
  ctx.quadraticCurveTo(x, b, x, b - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
}

function strokeRoundRect(ctx, x, y, w, h, radius) {
  drawRect(ctx, x, y, w, h, radius);
  ctx.stroke();
}

function fillRoundRect(ctx, x, y, w, h, radius) {
  drawRect(ctx, x, y, w, h, radius);
  ctx.fill();
}

function draw() {
  const canvas = document.getElementById('layout');
  console.log('canvas', canvas);
  const ctx = canvas.getContext('2d');
  ctx.translate(0.5, 0.5);

  const KW = 50;
  const KH = 50;

  layout.forEach(key => {
    const x0 = key.x * KW + 1;
    const x1 = (key.w * KW) - 1;
    const y0 = key.y * KH + 1;
    const y1 = (key.h * KH) - 1;

    ctx.strokeStyle = '#000';
    strokeRoundRect(ctx, x0, y0, x1, y1, 3);

    ctx.fillStyle = '#ddd';
    ctx.lineWidth = 5;
    fillRoundRect(ctx, x0 + 1, y0 + 1, x1 - 2, y1 - 2, 3);

    const d = 3;
    const d2 = parseInt(d + (d / 2)) + 1;
    ctx.fillStyle = '#fff';
    fillRoundRect(ctx, x0 + d2, y0 + d2 - 1, x1 - (d2 * 2), y1 - (d * 4) + 1, 3);
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 1;
    strokeRoundRect(ctx, x0 + d2, y0 + d2 - 1, x1 - (d2 * 2), y1 - (d * 4) + 1, 3);


    const d3 = d2 + 4;
    ctx.fillStyle = '#000';
    ctx.font = '12px "Helvetica","Arial",sans-serif';
    ctx.textAlign = 'top';
    ctx.fillText(key.label, x0 + d2 + 4, y0 + 12 + d2 + 2);
  });
}

const layout = [
  { row: 0, col: 0, w: 1, h: 1, x: 0, y: 0, label: '~' },
  { row: 0, col: 1, w: 1, h: 1, x: 1, y: 0, label: '!' },
  { row: 0, col: 2, w: 1, h: 1, x: 2, y: 0, label: '@' },
  { row: 0, col: 3, w: 1, h: 1, x: 3, y: 0, label: '#' },
  { row: 0, col: 4, w: 1, h: 1, x: 4, y: 0, label: '$' },
  { row: 0, col: 5, w: 1, h: 1, x: 5, y: 0, label: '%' },
  { row: 0, col: 6, w: 1, h: 1, x: 6, y: 0, label: '^' },
  { row: 0, col: 7, w: 1, h: 1, x: 7, y: 0, label: '&' },
  { row: 0, col: 8, w: 1, h: 1, x: 8, y: 0, label: '*' },
  { row: 0, col: 9, w: 1, h: 1, x: 9, y: 0, label: '(' },
  { row: 0, col: 10, w: 1, h: 1, x: 10, y: 0, label: ')' },
  { row: 0, col: 11, w: 1, h: 1, x: 11, y: 0, label: '_' },
  { row: 0, col: 12, w: 1, h: 1, x: 12, y: 0, label: '+' },
  { row: 0, col: 13, w: 2, h: 1, x: 13, y: 0, label: 'Backspace' },
  { row: 1, col: 0, w: 1.5, h: 1, x: 0, y: 1, label: 'Tab' },
  { row: 1, col: 1, w: 1, h: 1, x: 1.5, y: 1, label: 'Q' },
  { row: 1, col: 2, w: 1, h: 1, x: 2.5, y: 1, label: 'W' },
  { row: 1, col: 3, w: 1, h: 1, x: 3.5, y: 1, label: 'E' },
  { row: 1, col: 4, w: 1, h: 1, x: 4.5, y: 1, label: 'R' },
  { row: 1, col: 5, w: 1, h: 1, x: 5.5, y: 1, label: 'T' },
  { row: 1, col: 6, w: 1, h: 1, x: 6.5, y: 1, label: 'Y' },
  { row: 1, col: 7, w: 1, h: 1, x: 7.5, y: 1, label: 'U' },
  { row: 1, col: 8, w: 1, h: 1, x: 8.5, y: 1, label: 'I' },
  { row: 1, col: 9, w: 1, h: 1, x: 9.5, y: 1, label: 'O' },
  { row: 1, col: 10, w: 1, h: 1, x: 10.5, y: 1, label: 'P' },
  { row: 1, col: 11, w: 1, h: 1, x: 11.5, y: 1, label: '{' },
  { row: 1, col: 12, w: 1, h: 1, x: 12.5, y: 1, label: '}' },
  { row: 1, col: 14, w: 1.5, h: 1, x: 13.5, y: 1, label: '|' },
];
