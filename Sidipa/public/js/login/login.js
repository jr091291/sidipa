/**
 * Created by Ricardo on 30/04/2016.
 */
$(document).ready(function () {
    var select = document.getElementById('select');
    var index = document.getElementById('index');
    var role = document.getElementById('role');

    /*
    * Evento Role Persona
    */
    select.onchange = function (e) {
        var i =  e.target.selectedIndex;
        role.value = e.target[i].value;
        index.value = i ;
        if(role.value ==='docente'){
            $('#cod_simulacion_est').parent().addClass('hide');
            $('#cod_simulacion_doc').parent().removeClass('hide');
        }
        else{
            $('#cod_simulacion_est').parent().removeClass('hide');
            $('#cod_simulacion_doc').parent().addClass('hide');
        }
    }

    /*
    * Change cod simulacion docente
    */
    $('#cod_simulacion_doc')[0].onchange = function(){
        $('#simulacion').val(this[this.selectedIndex].value);
    }

    /*
    * AJAX docente
    */
    $('#identificacion')[0].onblur = function(event){
        if( role.value ==='docente') {
            var url = location.origin + '/simulacion/'+ event.target.value;
            $.getJSON(url,function(response){
                if(response.length){
                    var html = '';
                    response.forEach(function(simulacion){
                        html += "<option value="+simulacion.id_simulacion+">"+simulacion.nombre+"</option>";
                    });
                    $('#cod_simulacion_doc').html(html);
                    $("button[type='submit']").removeClass('disabled');
                }
                else{
                    generateAlert('warning','Usuario Invalido: ','Por Favor Verifique Su Identificacion',true);
                    $('#cod_simulacion_doc').html("<option value='null' >Verifique Que Su Identificacion Sea Correcta</option>");
                    $("button[type='submit']").addClass('disabled');
                }
                $('#cod_simulacion_doc')[0].onchange();
            });

        }
    }


    /*
     * AJAX estudiante
     */
    $('#cod_simulacion_est')[0].onblur = function(event){
        $("#simulacion").val(event.target.value)
        if (role.value === 'estudiante') {
            var url = location.origin + '/simulacion/show/' + event.target.value;
            $.getJSON(url, function (response) {
                if (response.error) { 
                    generateAlert('warning', 'Verifique Su Informacion:', 'El Codigo De Simulacion No Existe', true);
                    $("button[type='submit']").addClass('disabled');
                }
                else if (response.simulacion.length) {
                    generateAlert('success', 'Codigo Valido: ', 'Codigo De Simulacion Verificado',true);
                    $("button[type='submit']").removeClass('disabled')
                }
                else if (response.simulacion.length === 0) {
                    generateAlert('warning', 'Simulacion Inactiva:', 'El Docente No Se Encuentra En Linea', true);
                    $("button[type='submit']").addClass('disabled');
                }
            });
        }
    }


    /*
     * Animate Formulario
     */

    if(!$('#alerts').html()){
        $('#back').animateCss('fadeIn');
        setTimeout(function () {
            $('#form').removeClass('hide');
            $('#form').animateCss('zoomIn');
            setTimeout(function () {
                $('#form').animateCss('pulse')
            }, 1050);
        }, 700);
    }
    else {
        $('#form').removeClass('hide');
    }
});