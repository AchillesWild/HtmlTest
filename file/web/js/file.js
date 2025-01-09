    function closePopup() {
        $('.overlay').css('display','none');
        $('.img_popup').css('display','none');
    }

    function previewImgFromBase64(url){
        $.ajax({
            url: url,
            method: 'GET',
            success: function(obj) {
                var imgBase64 = obj.data.compressImgUrl;
                if (imgBase64 == null || imgBase64 == '') {
                    alert("图片不存在!");
                    return;
                }
                $('#listPreviewImage').attr('src',imgBase64);
                $('.overlay').css('display','block');
                $('.img_popup').css('display','block');
            }
        });
    }

    function downloadImgFromBase64(url){
        $.ajax({
            url: url,
            method: 'GET',
            success: function(obj) {
                if (obj.code != 1){
                    return;
                }
                var imgBase64 = obj.data.imgUrl;
                if (imgBase64 == null || imgBase64 == '') {
                    alert("图片不存在!");
                    return;
                }
                downloadImage(imgBase64, 'download.jpg');
            }
        });
    }

    function downloadImage(base64Data, fileName) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(base64ToBlob(base64Data));
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function base64ToBlob(base64Data) {
        const byteString = atob(base64Data.split(",")[1]);
        const mimeString = base64Data.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

      return new Blob([ab], { type: mimeString });
    }

    function exportExcelFile(url, name){
        $.ajax({
            url: configHost + "/excel/export/switch",
            method: 'GET',
            success: function(obj) {
                if(!obj.data){
                    openAlert(MODEL_IS_CLOSED);
                    return;
                }
                $.ajax({
                    url: url,
                    method: 'GET',
                    xhrFields: {
                        responseType: 'arraybuffer'
                    },
                    success: function(response) {
                          var blob = new Blob([response], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                          var link = document.createElement('a');
                          link.href = window.URL.createObjectURL(blob);
                          link.download = name;
                          document.body.appendChild(link);
                          link.click();
                          link.remove();
                    },
                    error: function(jqXHR) {
                        const contentType = jqXHR.getResponseHeader("Content-Type");
                        if (contentType && contentType.includes("application/json")) {
                            const reader = new FileReader();
                            const blob = new Blob([jqXHR.response]);
                            reader.onload = function(event) {
                                try {
                                    const errorResponse = JSON.parse(event.target.result);
                                    alert(errorResponse.message || '导出失败');
                                } catch (e) {
                                    openAlert(REQUESTS_TOO_FREQUENT_LIMIT.MSG);
                                }
                            };
                            reader.readAsText(blob);
                        } else {
                            openAlert('导出失败: ' + jqXHR.statusText);
                        }
                    }
                });
            }
        });
    }