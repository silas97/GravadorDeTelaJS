// Configurar variáveis ​​básicas para o aplicativo

const btnGravar = document.querySelector('.button-gravar');
const btnParar = document.querySelector('.button-parar');
const videoClip = document.querySelector('.galeria');

// Desativar o botão de parada enquanto não estiver gravando

btnParar.disabled = true;

// Bloco principal para fazer a gravação de áudio

if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia suportado!');

  const constraints = { video: { cursor: "always" }, audio: true };
  let chunks = [];

  let onSuccess = function (stream) {
    const mediaRecorder = new MediaRecorder(stream);

    btnGravar.onclick = function () {
      mediaRecorder.start();
      /* console.log(mediaRecorder.state) */
      console.log("Gravação Iniciada!");
      btnGravar.style.background = "red";

      btnParar.disabled = false;
      btnGravar.disabled = true;
    }

    btnParar.onclick = function () {
      mediaRecorder.stop();
      /* console.log(mediaRecorder.state); */
      console.log("Gravação Parada!");
      btnGravar.style.background = "";
      btnGravar.style.color = "";
      // mediaRecorder.requestData();

      btnParar.disabled = true;
      btnGravar.disabled = false;
    }

    mediaRecorder.onstop = function (e) {//Um EventHandlerchamado para manipular o stopevento, que ocorre quando a gravação de mídia termina, quando MediaStreamtermina - ou depois que o MediaRecorder.stop()método é chamado.
      console.log("Dados disponíveis após a chamada de MediaRecorder.stop ().");

      const clipName = prompt('Digite um nome para o seu clipe?', 'Novo vídeo');

      const clipContainer = document.createElement('article');
      const clipLabel = document.createElement('p');
      const video = document.createElement('video');
      const deleteButton = document.createElement('button');

      clipContainer.classList.add('clip');
      video.setAttribute('controls', '');
      video.setAttribute('width', '320');
      video.setAttribute('height', '240');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete';

      if (clipName === null) {
        clipLabel.textContent = 'Meu clipe sem nome';
      } else {
        clipLabel.textContent = clipName;
      }

      clipContainer.appendChild(video);
      clipContainer.appendChild(clipLabel);
      clipContainer.appendChild(deleteButton);
      videoClip.appendChild(clipContainer);

      video.controls = true;//Adicionando controle ao player.
      /* const blob = new Blob(chunks, { 'type': 'video/webm' }); */
      const blob = new Blob(chunks, { 'type': 'video/mp4' });
      chunks = [];
      const videoURL = window.URL.createObjectURL(blob);
      video.src = videoURL;
      console.log("recorder parado!");

      deleteButton.onclick = function (e) {//Remove o video adicionado anteriormente
        let evtTgt = e.target;
        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
      }

      clipLabel.onclick = function () {
        const existingName = clipLabel.textContent;
        const newClipName = prompt('Digite um novo nome para o seu clipe?');
        if (newClipName === null) {
          clipLabel.textContent = existingName;
        } else {
          clipLabel.textContent = newClipName;
        }
      }
    }

    mediaRecorder.ondataavailable = function (e) {// Dados disponíveis!
      chunks.push(e.data);//Chamado para manipular o dataavailableevento, que é acionado periodicamente sempre que timeslicemilissegundos de mídia são gravados (ou quando toda a mídia foi gravada, se timeslicenão tiver sido especificada). O evento, do tipo BlobEvent, contém a mídia gravada em sua datapropriedade. Em seguida, você pode coletar e agir com base nos dados de mídia gravados usando esse manipulador de eventos.
    }
  }

  let onError = function (err) {
    console.log('Ocorreu o seguinte erro: ' + err);
  }

  navigator.mediaDevices.getDisplayMedia(constraints).then(onSuccess, onError);

} else {
  console.log('getUserMedia não suportado no seu navegador!');
}