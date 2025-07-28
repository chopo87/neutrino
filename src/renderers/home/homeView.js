// addEventListener('load', async () => {
//   alert('JS file loaded');
// });

// window.addEventListener('load', (e) => {
//   console.log('Test');
//   console.log(window.rendererApi);
// });

window.rendererApi.onUpdateMessage((event, message) => {
  console.log('message logged in view');
  let elemE = document.getElementById('message');
  elemE.innerHTML = message;
  //alert(message);
});
