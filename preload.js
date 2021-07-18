window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    console.log('selector', selector);
    const element = document.getElementById(selector);
    console.log('element', element);
    if (element) element.innerText = text;
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});
