$(document).ready(function () {
    $('#email_template').summernote({
        height: 350
    });
});
const SendMails = () => {
    let formData = new FormData();
    //const to = $('#to').val();
    const from = "baladandaya@gmail.com";
    const cc = $('#to').val();
    const subject = $('#Sub').val();
    const body = $('#email_template').summernote('code');
    const attachmentlist = $('#email_attachments').get(0).dropzone;
    const files = attachmentlist.files;
    for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }

    const emailobject = {
        emailcc: cc,
        emailFrom: from,
        subject: subject,
        body: body
    }
    formData.append('emailobject', JSON.stringify(emailobject));
    $.ajax({
        url: '/mail/sendMails',
        type: 'POST',
        datatype: 'json',
        processData: false,
        contentType: false,
        data: formData,
        success: (response) => {
            console.log(response);
        },

    })
}