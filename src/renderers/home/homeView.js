// addEventListener('load', async () => {
//   alert('JS file loaded');
// });

// window.addEventListener('load', (e) => {
//   console.log('Test');
//   console.log(window.rendererApi);
// });

window.rendererApi.onUpdateMessage((event, message) => {
  console.log('message logged in view');
  let messageE = document.getElementById('message');
  const now = new Date();
  messageE.innerHTML += '\n' + now.toISOString() + ': ' + message;
});
