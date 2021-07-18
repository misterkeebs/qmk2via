const { ipcRenderer, shell } = require('electron');
(function () {
  const $ = selector => document.querySelector(selector);

  const hide = selector => document.querySelectorAll(selector).forEach(el => el.style.display = 'none');
  const show = selector => document.querySelectorAll(selector).forEach(el => el.style.display = 'block');

  const kb = {
    manufacturer: $('#keyboard-manufacturer'),
    model: $('#keyboard-model'),
    layouts: $('#keyboard-layouts'),
    reset: function () {
      this.manufacturer.innerText = '';
      this.model.innerText = '';
      this.layouts.innerText = '';
    },
  };

  $('#picker').addEventListener('click', evt => {
    evt.preventDefault();
    const res = ipcRenderer.send('select-keyboard');
  });

  $('#convert').addEventListener('click', evt => {
    evt.preventDefault();
    const res = ipcRenderer.send('convert-keyboard');
  });

  const restart = evt => {
    evt.preventDefault();
    kb.reset();
    showOnly('main');
  };

  document.querySelectorAll('.restart').forEach(el => {
    el.addEventListener('click', restart);
  });

  const showOnly = id => {
    document.querySelectorAll('.panel').forEach(el => el.style.display = 'none');
    show(`#${id}`);
  };

  ipcRenderer.on('error', (evt, err) => {
    console.error(err);
    console.error(err.stack);
    $('#error-message').innerText = `${err.stack}`;
    showOnly('error');
  });

  ipcRenderer.on('keyboard-selected', (event, { config, layouts }) => {
    kb.manufacturer.innerText = config.manufacturer;
    kb.model.innerText = config.product;
    kb.layouts.innerHTML = `<ul>${layouts.map(l => `<li>${l}</li>`).join('')}</ul>`;

    showOnly('keyboard-data');
  });

  ipcRenderer.on('keyboard-converted', async (event, file) => {
    console.log('file', file);
    console.log('#via-file', $('#via-file'));
    console.log('#via-file', $('#via-file').innerHTML);
    $('#via-file').innerHTML = `<a href="${file}">${file}</a>`;
    $('#via-file').addEventListener('click', evt => {
      evt.preventDefault();
      shell.openExternal(`file://${file}`);
    });
    showOnly('success');
  });
})();
