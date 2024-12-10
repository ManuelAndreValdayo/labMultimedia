$(document).ready(function(){
      fncCargandoVM(false);
      var loadedImage = null;
      var loadedImage2 = null;

  });
/********************************************************
* Función: fncSeleccionarImagen()                       * 
* Argumentos: event                                     *
* Descripción:                                          *
*                                                       *
*********************************************************/
function fncSeleccionarImagen(){
  const imageInput = document.getElementById('imageInput');
  imageInput.click();
}
/********************************************************
* Función: handleDragOver()                             * 
* Argumentos: event                                     *
* Descripción:                                          *
*                                                       *
*********************************************************/
function handleDragOver(event) {
  event.preventDefault();
}

/********************************************************
* Función: handleDrop()                                 * 
* Argumentos: event                                     *
* Descripción:                                          *
*                                                       *
*********************************************************/
function handleDrop(event) {
  event.preventDefault();
  if (event.dataTransfer.files.length > 0) {
      imageInput.files = event.dataTransfer.files;
      console.log(imageInput.files);
      handleImage(event.dataTransfer.files[0]);
  }
}
/********************************************************
* Función: handleImage()                                * 
* Argumentos:                                           *
* Descripción:                                          *
*                                                       *
*********************************************************/
function handleImage(file) {
  const imageResult = document.getElementById('imageResult');
  const compressImageButton = document.getElementById('compressImage');
  const removeImageButton = document.getElementById('removeImg');
  console.log(removeImageButton);
  const imageDropzone = document.getElementById('image-dropzone');

  if (!file.type.startsWith('image/')) {
  alert('Por favor, selecciona un archivo de imagen válido.');
  return;
  }

  var reader = new FileReader();
  reader.onload = (event) => {
      loadedImage = new Image();
      loadedImage2 = new Image();
      loadedImage.src = event.target.result;
      loadedImage2.src = event.target.result;

      loadedImage.onload = () => {
          imageResult.appendChild(loadedImage);
          imageResult.style.display = 'flex';
          // imageResult.appendChild(removeImageButton);
          compressImageButton.style.display = 'inline-block'; // Habilitar el botón de compresión
          removeImageButton.style.display = 'block';
          imageDropzone.style.display = 'none';
      };
  };

  reader.readAsDataURL(file);
}
/********************************************************
* Función: fncCargarImagen()                            * 
* Argumentos:                                           *
* Descripción:                                          *
*                                                       *
*********************************************************/
function fncCargarImagen(){
  const imageInput = document.getElementById('imageInput');
  if (imageInput.files.length > 0) {
    handleImage(imageInput.files[0]);
  }
}

/********************************************************
* Función: fncComprimirImagen()                         * 
* Argumentos:                                           *
* Descripción:                                          *
*                                                       *
*********************************************************/
function fncComprimirImagen(){
  const compressImageButton = document.getElementById('compressImage');
  const divCompresorImagen = document.getElementById('botonCompresorImg');
  console.log(loadedImage);
  console.log(loadedImage2);
  if (!loadedImage) return;
  
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  var maxWidth = 1000; // Ancho máximo
  console.log(loadedImage2.width);
  var scale = maxWidth / loadedImage2.width;

  canvas.width = Math.min(loadedImage2.width, maxWidth);
  canvas.height = loadedImage2.height * scale;
  
  ctx.drawImage(loadedImage2, 0, 0,canvas.width, canvas.height);

  // Generar la imagen comprimida
  var compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // Calidad 70%

  // Crear un enlace para descargar
  var link = document.createElement('a');
  link.href = compressedDataUrl;
  link.download = 'imagen-comprimida.jpg';
  link.textContent = 'Descargar imagen comprimida';
  link.style.display = 'block';
  link.style.marginTop = '20px';
  divCompresorImagen.innerHTML = '';
  divCompresorImagen.style.display = "block";
  compressImageButton.style.display = "none";
  divCompresorImagen.appendChild(link);
}
/********************************************************
* Función: fncEliminarImagen()                          * 
* Argumentos:                                           *
* Descripción:                                          *
*                                                       *
*********************************************************/
function fncEliminarImagen(){
  const imageDropzone = document.getElementById('image-dropzone');
  const compressImageButton = document.getElementById('compressImage');
  const imageResult = document.getElementById('imageResult');
  const divCompresorImagen = document.getElementById('botonCompresorImg');
  const removeImageButton = document.getElementById('removeImg');
  removeImageButton.style.display = 'none';

  imageResult.innerHTML = ''; // Limpiar la vista previa
  imageResult.appendChild(removeImageButton);
  compressImageButton.style.display = 'none'; // Habilitar el botón de compresión
  imageDropzone.style.display = 'flex';
  imageResult.style.display = 'none';
  divCompresorImagen.style.display = 'none';
}