$(document).ready(function(){



    //js list input moveable
    $("#linkedin_last_etape .ui-sortable").sortable({
        handle : ".handle"
    });
    $("#linkedin_last_etape .btn_add").click(function(){
        var lastNode= $(this).closest('.ui-sortable').find(".dd-item").last();
        lastNode.clone(true).insertAfter(lastNode).find('input').val('');
    });

    //question form
    $("#qustion_form").submit(function(e) {
        e.preventDefault();
        var objInput = $(this).find("input");
        var arrInputValue = [];
        $.each(objInput,function(i,o) {
            var inputValue = $.trim(o.value);
            if(inputValue){
                arrInputValue.push(inputValue);
            }
        });
        var questionAnswered = arrInputValue.length;
        var totalQuestions   = objInput.length;
        var questionReste = 10 - questionAnswered;
        if(questionAnswered < 10) {
            showHideModals(['#ltTen'],[]);
            $('#ltTen').find(".resteQustions").html(questionReste);
        }else if (questionAnswered >= 10 && questionAnswered <= 15) {
            showHideModals(['#btTen'],[]);
            $("#btTen").find('.reponduQustions').html(questionAnswered);
        }else if(questionAnswered > 15) {
            showHideModals(['#submitForm1'],[]);
        }
    });
    $('#btn_ajouter_realisation').click(function(){
        showHideModals([],['#btTen']);
        $("#qustion_form input:text").filter(function() {
            return this.value == "";
        }).first().focus();
    });
    // bt 10 and 15
    $("#btn_suivant").click(function(e) {
        showHideModals(['#submitForm1'],['#btTen']);
    });
    // bt 10 and 15 or plus 15
    $('#btn_etape_suivante').click(function(e){
        showHideModals(['#submitForm2'],['#submitForm1']);
    });
    $("#submitForm1 input:radio").click(function(){
        $("#hideInput").hide();
    });
    $("#submitForm1 .radio_container:last input:radio").click(function(){
        $("#hideInput").show().focus();
    });
    var cards = $("#submitForm1 .radio_container");
    for(var i = 0; i < cards.length; i++){
        var target = Math.floor(Math.random() * cards.length -1) + 1;
        var target2 = Math.floor(Math.random() * cards.length -1) +1;
        cards.eq(target).before(cards.eq(target2));
    }
    $("#hideInput").closest("#submitForm1 .radio_container").insertAfter($("#submitForm1 .radio_container:last"))
    $("#btn_precedent").click(function(){
        showHideModals(['#submitForm1'],['#submitForm2']);
    });
    $("#btn_submit").click(function(){
        alert("subnitted form")
    });

    //showHideModals(['submitForm1'], ['submitForm2', 'btTen']);
    function showHideModals(toShow, toHide) {
        $.each(toShow,function(index,objShow){
            $(objShow).modal('show')
        });
        $.each(toHide,function(index,objHide){
            $(objHide).modal('hide')
        })
    }









    //js list moveable
    $("#nestable .dd-icon").click(function(){
        $(this).closest('.dd-item').remove();
    });
    $("#linkedin-list #nestable").sortable({
        handle : ".fa-bars"
    });







    //select_form option  popup
    var current          = null;
    var modal            = $('#modal_poste_detail');
    var modal_title      = $("#modal_poste_detail .title");
    var modal_entreprise = $("#modal_poste_detail .entreprise");
    var modal_debut_date = $("#modal_poste_detail #debut");
    var modal_fin_date   = $("#modal_poste_detail #fin");

    $('#linkedin-options .select_poste').change(function(){
        current = $(this).attr('id');
        if($(this).val() == "poste")
        {
            modalShowHide([modal],[]);
            initModal([modal_title,modal_entreprise,modal_debut_date,modal_fin_date]);
        }
    });
    $("#modal_poste_detail .modal_save").click(function(){
        var title = $.trim(modal_title.val());
        var entreprise  = $.trim(modal_entreprise.val());
        if(!title)
        {
            addRequire(modal_title);
            modal_title.blur(function(){
                if($(this).val() != "")
                {
                    removeRequire($(this));
                }
            })
            return false;
        }
        else if(!entreprise)
        {
            addRequire(modal_entreprise);
            modal_entreprise.blur(function(){
                if($(this).val() != "")
                {
                    removeRequire($(this));
                }
            })
            return false;
        }
        modalShowHide([],[modal]);
        var option = $("<option value='" + title + "'>" + title +" CHEZ "+ entreprise + "</option>");
        $('#linkedin-options .select_poste').append(option[0]);
        $('#'+current).find("option:last").attr("selected", "selected");
    });
    modal.on('hidden.bs.modal', function () {
        $('#'+current).val("");
    });









    //variables
    var $realisation              = $('#linkedin-options .modal-realisation');
    var realisationDetail         = $('.realisation-detail');
    var currentModal              = null;
    var nextModal                 = null;
    var realisationData           = {};
    var modalShowType             = "";
    var modaldata                 = [];
    var realisationDataColletions = [];

    //click save to show first modal
    $("#linkedin-options .save").click(function(){
        $realisation.first().modal("show");
        $('.not_do_realisation').find(".modal-body .checkbox_container").not(':first').remove();
        //initialize realisations modal modalIndex
        if(!$.isEmptyObject(realisationData)){
            realisationDataColletions.push(realisationData)
        }
        modalShowType      = "";
        realisationData    = {};
        modaldata.length   = 0;
        modalInputIndex    = 0;
    });
    //click btn_non on modal, show next modal hide current modal
    $("#linkedin-options .modal-realisation .btn_non").click(function(){
        currentModal = $(this).closest(".modal-realisation");
        nextModal   = currentModal.next(".modal-realisation");   //record current title and push in notRealisationModalTitle
        modalClickOuiNon(currentModal,"non");
        modalShowHide([nextModal],[currentModal]);
        //return res at end of last madal
        lastModal(nextModal);
    });
    //click btn_oui on modal, show realisation details
    $("#linkedin-options .modal-realisation .btn_oui").click(function(){
        currentModal = $(this).closest(".modal-realisation");
        var currentModalId   = currentModal.data('modalid');
        modalClickOuiNon(currentModal,"oui");
        var current_realisation_detail = $('#'+currentModalId);
        //initialize input
        inputIntialize(current_realisation_detail);
        modalShowHide([current_realisation_detail],[currentModal]);

    });

    //click btn_add on modal_realisation-detail
    $("#linkedin-options .realisation-detail .btn_add_champ").click(function(){
        var currentChamps = $(this).closest('.champs');
        var inputChamps   = currentChamps.find(".input_champs");
        var nodeChamps = $("<p><input type='text' /></p>");
        nodeChamps.appendTo(inputChamps);
    });
    //click btn_save on modal
    var modalInputIndex = 0;
    $(".realisation-detail .btn_save").click(function(){
        var obj = $(this);
        var currentModalDetailId= obj.closest('.realisation-detail').attr("id");
        var res = checkChamps(obj);
        if(!res)
        {
            alert('chaque champs au moins un soit rempli');
            return false;
        }
        if(modalShowType == "showNextRealisationInput"){
            inputIntialize($(modaldata[modalInputIndex+1]));
            modalShowHide([$(modaldata[modalInputIndex+1])],[$(modaldata[modalInputIndex])]);
            modalInputIndex++;

        }else{
            hideModalInput(currentModal);
        }
    })

    //realisationMoinsCinq modal clic contituer
    var realisationChecked = null;
    $(".not_do_realisation .btn_continuer").click(function(){
        realisationChecked = $(".not_do_realisation .realisation_check:checked");
        var checkedNum = realisationChecked.length;
        var oui_count = countOui();
        var curentTotal = oui_count + checkedNum;
        var total = 5;
        var resteRealisation = total - curentTotal;
        var checkedTitle = [];
        if(resteRealisation >0)
        {
            alert("vous devez selectionner au moins "+total+" realisations, il vous reste "+resteRealisation);
            return false;
        }
        //notRealisation
        $(".not_do_realisation").modal('hide');
        $.each(realisationChecked,function(index,obj){

            var modalId = $(obj).attr("id");
            modaldata.push("#"+modalId);
        });
        inputIntialize($(modaldata[0]));
        $(modaldata[0]).modal("show");

        //show realisationInput
        modalShowType = "showNextRealisationInput";

    })
    function initModal(modalObj){
        $.each(modalObj,function(index,obj){
            obj.val("");
            obj.removeClass('input_required_linkedin-options');
            if(obj == modal_debut_date || obj == modal_fin_date ){
                obj.datepicker();
            }
        })
    };
    function modalShowHide(objShow,objHide){
        $.each(objShow,function(index,obj){
            $(obj).modal('show')
        });
        $.each(objHide,function(index,obj){
            $(obj).modal('hide')
        })
    }
    function addRequire(handle) {
        handle.addClass('input_required_linkedin-options');
    }
    function removeRequire(handle) {
        handle.removeClass('input_required_linkedin-options');
    }
    function realisationMoinsCinq() {
        var modalBody = $('.not_do_realisation').find(".modal-body");
        var checkbox = modalBody.find(".checkbox_container").first();
        //var checkboxNode = $(checkbox).removeClass("hide");
        var realisationNullData = [];
        $.each(realisationData,function(index,obj){
            if(obj.oui_click=="non"){
                realisationNullData.push(obj);
            }
        });
        $.each(realisationNullData,function(index,obj){
            checkbox.find(".title_present").html(obj.rtitle);
            checkbox.find(".realisation_check").attr("id",obj.rid);
            checkbox.clone().removeClass('hide').appendTo(modalBody);
        });

        $(".not_do_realisation").modal('show');
    }
    function lastModal(nextModal){
        if(nextModal.length == 0){
            var oui_count = countOui();
            if(oui_count >= 5){
                alert("etape suivante");
            }else{
                realisationMoinsCinq()
            }
        }
    }
    function hideModalInput(currentModal){
        var nextModal= currentModal.next(".modal-realisation");
        modalShowHide([nextModal],[realisationDetail]);
        //return res at end of last madal
        lastModal(nextModal);
    }
    //click oui ou non on the modal to record donné
    function modalClickOuiNon(currentModal,click){
        var currentModalId   = currentModal.data('modalid');
        var currentModalTitle = $.trim(currentModal.find('.modal-title').html());
        realisationData[currentModalId] = {
            oui_click: click,
            rtitle   : currentModalTitle,
            rid      : currentModalId,
            data     : []
        };
    }
    // check all the champs
    function checkChamps(obj){
        // juge at least a champs is filled
        var res = true;
        var currentModalDetailId = obj.closest('.realisation-detail').attr('id');
        var champs = obj.closest(".modal-content").find(".champs");
        $.each(champs,function(index,object){
            var champsInput = $(object).find("input");
            var arr = [];
            var inputObj = {};
            $.each(champsInput,function(inputIndex,inputObject){
                var inputValue = $.trim(inputObject.value)
                if(inputValue)
                {
                    arr.push(inputObject.value);
                    inputObj[inputIndex] = inputObject.value;
                }
            });
            realisationData[currentModalDetailId].data.push(inputObj);
            if(arr.length == 0)
            {
                res = false;
                return false;
            }
        });
        return res;
    }
    function inputIntialize(obj){
        var champsInputObj = obj.find('.champs');
        $.each(champsInputObj,function(index,obj){
            $(obj).find('.input_champs input').val("");
            $(obj).find('.input_champs p:gt(2)').remove();
        })
    }
    function countOui(){
        var ouiArr = [];
        $.each(realisationData,function(index,obj){
            if(obj.oui_click == "oui"){
                ouiArr.push(obj)
            }
        });
        return ouiArr.length;
    }





    //linkedin_new_experience
    //enter page
    //init chosen
    chosen($("#linkedin_new_experience"));

    //move move_bar
    $("#sort-table").sortable({
        handle:".move_bar i"
    });
    //click btn_add
    $("#linkedin_new_experience .btn_add").click(function(){
        // find first .hide div, put at the first child
        var firstNode = $("#linkedin_new_experience .hide").first();
        //put it at the first
        firstNode.removeClass("hide")
                 .attr({
                     style: 'display:none'
                 })
                 .fadeIn('slow')
                 .prependTo(".tables_container");
        //initializ the frist child open table position icons
        firstNode.find(".table_row").show();
        //add chosen
        chosen(firstNode);
        //if all the page add(all div are shown), hide button
        if(!$(".table_content").hasClass('hide')){
            $(this).addClass("hide");
        }
    });
    //click button option juge if data to Today
    $("#linkedin_new_experience .show_today").click( function(){
        var current_table = $(this).closest(".table_content");
        //diabled all the brothers show_today button
        current_table.siblings().find(".show_today").attr("checked",false);
        if($(this).is(':checked') ) {
            showHideData(current_table,[".today"],[".to_date"]);
            showHideData(current_table.siblings(),[".to_date"],[".today"]);
        }else{
            showHideData(current_table,[".to_date"],[".today"]);
        }
    });
    //click trash icon
    $("#linkedin_new_experience  .trash i").click(function(){
        $("#linkedin_new_experience .btn_add").removeClass("hide");
        var current_table = $(this).closest(".table_content");
        var icons  = current_table.find(".new_experience_icon");
        //initilize table and icons
        showHideData(current_table,[".to_date"],[".today"]);
        current_table.find(".table_row").show();
        //initilize input checkbox ..
        initTable(current_table,["input",".show_today",".section_fonction",".month_year",".end_month_year",".fa-chevron-down"]);
    });

    function showHideData(handle,showObj,hideObj){
        $.each(showObj,function(i,obj){
            handle.find(obj).show();
        });
        $.each(hideObj,function(i,obj){
            handle.find(obj).hide();
        })
    }
    //data = ["input",".section_fonction"]
    function initTable(handle,data){
        $.each(data,function(i,obj){
            if(obj==".show_today")
            {
                handle.find(obj).attr("checked",false);
            }
            else if (obj==".fa-chevron-down") {
                handle.find(obj).removeClass("fa-chevron-down").addClass("fa-chevron-up");
            }
            handle.find(obj).val("");
        });
        handle.addClass("hide");
    }
    //select function
    function chosen(handle){
        //firstNode.find(".section_fonction").select2();
        handle.find(".section_fonction").select2();
    }



});