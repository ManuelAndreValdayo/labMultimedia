
$(document).ready(function(){
  fncCargandoVM(false);
});
var dropZone = document.getElementById('dropZone');

dropZone.addEventListener('dragover', (event) => {
  event.preventDefault(); // Prevenir comportamiento por defecto
  dropZone.classList.add('dragover'); // Añadir clase para estilos
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover'); // Quitar clase
});

dropZone.addEventListener('drop', (event) => {
  event.preventDefault(); // Prevenir comportamiento por defecto
  dropZone.classList.remove('dragover'); // Quitar clase
  var file = event.dataTransfer.files[0]; // Obtener archivo arrastrado
  handleFile(file);
});


/********************************************************
* Función: fncSeleccionarArchivo()                      * 
* Argumentos:                                           *
* Descripción:                                          *
*                                                       *
*********************************************************/
function fncSeleccionarArchivo(){
  const fileInput = document.getElementById('fileInput');
  fileInput.click();
}

/********************************************************
* Función: fncCargarArchivo()                           * 
* Argumentos: event                                     *
* Descripción:                                          *
*                                                       *
*********************************************************/
function fncCargarArchivo(event){
  handleFile(event.target.files[0]);
}

/********************************************************
* Función: handleFile()                                 * 
* Argumentos:                                           *
* Descripción:                                          *
*                                                       *
*********************************************************/
function handleFile(file){
  const removeFileButton = document.getElementById('removeFile');
  const output = document.getElementById('output');

  if (file && file.type === 'text/plain') {
      removeFileButton.style.display = "block";
      var reader = new FileReader();
      reader.onload = (e) => {
        $("#contenidoCompresor").slideDown();
        output.textContent = `Contenido del archivo:\n${e.target.result}`;
        window.fileContent = e.target.result;
      };
      reader.readAsText(file);
  } else {
      alert('Por favor, sube un archivo .txt');
  }
}

/********************************************************
* Función: fncEliminarArchivo()                         * 
* Argumentos:                                           *
* Descripción:                                          *
*                                                       *
*********************************************************/
function fncEliminarArchivo(){
  $("#nombreArchivoComprimido").val("");
  window.fileContent = '';
  $("#contenidoCompresor").slideUp();
}

/********************************************************
* Función: fncComprimirZip()                            * 
* Argumentos:                                           *
* Descripción:                                          *
*                                                       *
*********************************************************/
function fncComprimirZip(){
  if (!window.fileContent) {
      alert('Por favor, carga un archivo primero.');
      return;
  }
  var nombreArchivo = 'archivo';
  if($("#nombreArchivoComprimido").val() !== ""){
    nombreArchivo = $("#nombreArchivoComprimido").val();
  }
  var zip = new JSZip();
  zip.file(nombreArchivo+'.txt', window.fileContent);

  zip.generateAsync({ type: 'blob' }).then((blob) => {
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'archivo.zip';
  a.click();
  });
}

/********************************************************
* Función: fncComprimirTar()                            * 
* Argumentos:                                           *
* Descripción:                                          *
*                                                       *
*********************************************************/
function fncComprimirTar(){
  if (!window.fileContent) {
      alert('Por favor, carga un archivo primero.');
      return;
  }
  var nombreArchivo = 'archivo';
  if($("#nombreArchivoComprimido").val() !== ""){
    nombreArchivo = $("#nombreArchivoComprimido").val();
  }
  var filename = nombreArchivo+'.txt'; // Nombre del archivo en el TAR
  var content = new TextEncoder().encode(window.fileContent); // Contenido del archivo
  var fileSize = content.length;

  // Crear cabecera TAR
  var tarHeader = new Uint8Array(512); // Cabecera siempre es de 512 bytes
  tarHeader.set([...filename.padEnd(100).split('').map((char) => char.charCodeAt(0))], 0); // Nombre
  tarHeader.set([...fileSize.toString(8).padStart(11, '0')].map((char) => char.charCodeAt(0)), 124); // Tamaño octal
  tarHeader[156] = 0x30; // Tipo de archivo regular (ASCII "0")
  tarHeader.set([...Array(8).fill(0)], 148); // Relleno para checksum

  // Calcular checksum
  var checksum = 0;
  for (var i = 0; i < 512; i++) checksum += tarHeader[i];
  tarHeader.set([...checksum.toString(8).padStart(6, '0')].map((char) => char.charCodeAt(0)), 148);

  // Crear bloque TAR compvaro
  var padding = 512 - (fileSize % 512); // Relleno para alineación de 512 bytes
  var tarFile = new Uint8Array(512 + fileSize + padding);
  tarFile.set(tarHeader, 0); // Agregar cabecera
  tarFile.set(content, 512); // Agregar contenido
  if (padding > 0) tarFile.set(new Uint8Array(padding), 512 + fileSize); // Agregar relleno

  // Comprimir con gzip
  var gzBlob = pako.gzip(tarFile);

  // Crear archivo .tar.gz para descargar
  var blob = new Blob([gzBlob], { type: 'application/gzip' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'archivo.tar.gz';
  a.click();
}