
$(function () {
    //$("#register-form")

    $(document).scroll(function () {
        var $nav = $(".navbar-fixed-top");
        $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
      });
    
      $("#fakeLoader").hide();
      $("#fakeLoader").fakeLoader({
        bgColor:"#06afdad7",
      });
      $('.nav-link, nav-item').click(function () {
        var sectionTo = $(this).attr('href');
        if(sectionTo != null){
          $('html, body').animate({
            scrollTop: $(sectionTo).offset().top
          }, 1000);
        }
      });


    $("form").submit(function () {
        switch (this.id) {
            case "mail-form" :                
                return false;
                break;
            case "login-form":
                var $lg_email = $('#login_email').val();
                var $lg_password = $('#login_password').val();
                signUser($lg_email,$lg_password);
                return false;
                break;
            case "lost-form":
                var $ls_email = $('#lost_email').val();
                if ($ls_email == "ERROR") {
                    msgChange($('#div-lost-msg'), $('#icon-lost-msg'), $('#text-lost-msg'), "error", "glyphicon-remove", "Send error");
                } else {
                    msgChange($('#div-lost-msg'), $('#icon-lost-msg'), $('#text-lost-msg'), "success", "glyphicon-ok", "Send OK");
                }
                return false;
                break;
            case "register-form":
                var rg_email = $('#register_email');
                var register_password = $('#register_password');
                var register_password2 = $('#register_password2');
                var label_register = $('#label_register_password');
                var label_register2 = $('#label_register_password2');
                var txt = register_password.val();
                var txt2 = register_password2.val();
                var mail = rg_email.val();

                if (rg_email.hasClass('invalid')) {
                    // error
                    return false;
                }
                if (register_password.hasClass('invalid') || register_password2.hasClass('invalid')) {
                    // error
                    return false;
                }
                if (txt.length < 6) {
                    // error
                    return false;
                }
                if (txt != txt2) {
                    // error
                    return false;
                }
                      
                createUser(mail,txt);
                return false;
                break;
            default:
                return false;
        }
    });
});

var $formLogin = $('#login-form');
var $formLost = $('#lost-form');
var $formRegister = $('#register-form');
var $divForms = $('#div-forms');
var $modalAnimateTime = 300;
var $msgAnimateTime = 150;
var $msgShowTime = 2000;

function modalAnimate($oldForm, $newForm) {
    var $oldH = $oldForm.height();
    var $newH = $newForm.height();
    $divForms.css("height", $oldH);
    $oldForm.fadeToggle($modalAnimateTime, function () {
        $divForms.animate({
            height: $newH
        }, $modalAnimateTime, function () {
            $newForm.fadeToggle($modalAnimateTime);
        });
    });
}

function msgFade($msgId, $msgText) {
    $msgId.fadeOut($msgAnimateTime, function () {
        $(this).html($msgText).fadeIn($msgAnimateTime);
    });
}

function clearMsgChange($divTag, $iconTag, $divClass, $iconClass) {
    $divTag.empty();    
    $divTag.removeClass($divClass);
    $textTag.removeAttr('class').attr('class', '');
}

function msgChange($divTag, $textTag, $divClass, $msgText) {
    $textTag.removeAttr('class').attr('class', '');
    $textTag.addClass($divClass);
    $textTag.fadeOut($msgAnimateTime, function () {
        $(this).html($msgText).fadeIn($msgAnimateTime);
    });
}

function clearInput($input, $label) {
    $label.attr({ 'data-error': '', 'data-success': '' });
    $input.removeClass('valid').removeClass('invalid');
}

$('#register_password').keyup(function () {
    var register_password = $('#register_password');
    var register_password2 = $('#register_password2');
    var label_register = $('#label_register_password');
    var label_register2 = $('#label_register_password2');
    var txt = register_password.val();
    var txt2 = register_password2.val();

    // check if txt is empty
    if (txt.length === 0) {
        register_password.removeClass('valid').removeClass("invalid");
        label_register.removeAttr('data-error');
        register_password2.removeClass('valid').removeClass("invalid");
        label_register2.removeAttr('data-error');
        register_password2.val('');
        return;
    }
    if (txt.length < 6) {
        label_register.attr({ 'data-error': 'votre mot de passe doit contenir plus de 6 caractères.', 'data-success': '' });
        register_password.addClass("invalid").removeClass('valid');
        if (txt2.length > 0) {
            label_register2.attr({ 'data-error': "votre mot de passe n'est pas valide.", 'data-success': '' });
            register_password2.addClass("invalid").removeClass('valid');
        }
        return;
    }else{
        label_register.attr({ 'data-success': 'right' });
        label_register.removeAttr('data-error');
        register_password.addClass('valid').removeClass('invalid');
    }
});

$('#register_password2').keyup(function () {
    var register_password = $('#register_password');
    var register_password2 = $('#register_password2');
    var label_register2 = $('#label_register_password2');
    var txt = register_password.val();
    var txt2 = register_password2.val();

    // check if text is empty
    if (txt2.length == 0) {
        clearInput(register_password2, label_register2);
        return;
    }

    //check if first password is valid
    if (register_password.hasClass('invalid')) {

        return;
    }

    // check if passwords are the same
    if (register_password.hasClass('valid') && txt != txt2) {
        label_register2.attr({ 'data-error': "votre mot de passe n'est pas identique." });
        label_register2.removeAttr('data-success');
        register_password2.addClass("invalid").removeClass('valid');
        return;
    } else {
        label_register2.attr({ 'data-success': 'right' });
        label_register2.removeAttr('data-error');
        register_password2.addClass('valid').removeClass('invalid');
    }
});

$('#login_lost_btn').click(function () {
    modalAnimate($formLogin, $formLost);
});
$('#lost_login_btn').click(function () {
    modalAnimate($formLost, $formLogin);
});
