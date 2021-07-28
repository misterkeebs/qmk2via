const { ipcRenderer, shell } = require('electron');
(function () {
  const $ = selector => document.querySelector(selector);

  const hide = selector => document.querySelectorAll(selector).forEach(el => el.classList.add('hidden'));
  const show = selector => document.querySelectorAll(selector).forEach(el => el.classList.remove('hidden'));

  const history = ['main'];

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
    ipcRenderer.send('select-keyboard');
  });

  $('#convert').addEventListener('click', evt => {
    evt.preventDefault();
    ipcRenderer.send('convert-keyboard');
  });

  $('#preview').addEventListener('click', evt => {
    evt.preventDefault();
    ipcRenderer.send('load-via-preview');
  });

  const restart = evt => {
    evt.preventDefault();
    kb.reset();
    showOnly('main');
  };

  const showOnly = (id, skipHistory) => {
    document.querySelectorAll('.panel').forEach(el => el.classList.add('hidden'));
    show(`#${id}`);
    if (!skipHistory) history.push(id);
  };

  const back = () => {
    console.log('back', history);
    const removed = history.pop();
    console.log('removed', removed);
    const id = history[history.length - 1];
    console.log('going to', id);
    console.log('back', history);
    if (id) {
      showOnly(id, true);
      console.log('new history', history);
    }
  };

  document.querySelectorAll('.restart').forEach(el => {
    el.addEventListener('click', restart);
  });

  document.querySelectorAll('.back').forEach(el => {
    console.log('el', el);
    el.addEventListener('click', back);
  });

  ipcRenderer.on('error', (evt, { message, error, details }) => {
    console.log('message, error', message, error);
    $('#error-message').innerText = message || 'An unexpected error ocurred:';
    if (error) {
      console.error(error);
      if (error.message && error.details) {
        $('#error-message').innerText = error.message;
        $('#error-details').innerText = error.details;
      } else {
        $('#error-details').innerText = `${error.stack}`;
      }
      show('#error-details');
    } else {
      if (details) {
        $('#error-details').innerText = `${details}`;
      } else {
        hide('#error-details');
      }
    }
    showOnly('error');
  });

  ipcRenderer.on('keyboard-selected', (event, { config, layouts, images }) => {
    console.log('images', images);
    console.log('layouts', layouts.map(l => l.name));
    const layoutLinks = layouts.map(l => `
      <div class="layout">
        <img class="layout-kle-link" src="data:image/jpg;base64,${images[l]}" data-layout="${l}" />
        <br/>
        ${l}
      </div>
    `).join('');
    console.log('layoutLinks', layoutLinks);

    kb.manufacturer.innerText = config.manufacturer;
    kb.model.innerText = config.product;
    kb.layouts.innerHTML = `${layoutLinks}`;

    document.querySelectorAll('.layout-link').forEach(el => {
      el.addEventListener('click', evt => {
        evt.preventDefault();
        ipcRenderer.send('load-layout', el.getAttribute('data-layout'));
      });
    });

    document.querySelectorAll('.layout-kle-link').forEach(el => {
      el.addEventListener('click', evt => {
        console.log('clicked');
        ipcRenderer.send('load-kle-permalink', el.getAttribute('data-layout'));
      });
    });

    showOnly('keyboard-data');
  });

  ipcRenderer.on('layout-loaded', (event, layout) => {
    $('#layout-contents').innerText = layout;
    showOnly('layout');
  });

  ipcRenderer.on('kle-permalink-loaded', (event, url) => {
    console.log('url', url);
    shell.openExternal(url);
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

  ipcRenderer.send('select-keyboard');
})();
