
/********************************************************
* Función: fncCargarCompresorTexto()                    * 
* Argumentos:                                           *
* Descripción:                                          *
*                                                       *
*********************************************************/
function fncCargarCompresorTexto(){
    fncCargandoVM(true);
    $('#content').load('compresor-texto.html', function (response, status, xhr) {
        if (status == "error") {
          $('#content').html("<p>Error cargando el contenido: " + xhr.statusText + "</p>");
        }
      });
      
}
/********************************************************
* Función: fncCargarCompresorVideos()                   * 
* Argumentos:                                           *
* Descripción:                                          *
*                                                       *
*********************************************************/
function fncCargarCompresorVideos(){
    fncCargandoVM(true);
    $('#content').load('compresor-video.html', function (response, status, xhr) {
        if (status == "error") {
          $('#content').html("<p>Error cargando el contenido: " + xhr.statusText + "</p>");
        }
      });
      
}
/********************************************************
* Función: fncCargandoVM()                              * 
* Argumentos: activo:boolean                            *
* Descripción:                                          *
*                                                       *
*********************************************************/
function fncCargandoVM(activo){
    if(activo){
        $("#ovm").css("display","block");
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;
      
          if (progress === 20) {
            clearInterval(interval);
          }
        }, 600);
    }else{
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;
      
          if (progress === 20) {
            clearInterval(interval);
            $("#ovm").css("display","none");
          }
        }, 600);
    }

}
