function Post(){
    function blindEvent(){
       $(".post_edit").click(function(){
            var params={
                id:$(".id").val(),
                title:$(".title").val(),
                content:tinymce.get("content").getContent(),
                author:$(".author").val()
            };
            var base_url=location.protocol+"//"+document.domain+":"+location.port;
            $.ajax({
                url:base_url+"/admin/post/edit",
                type:"PUT",
                data:params,
                dataType:"json",
                success:function(res){
                    if(res&&res.status_code==200){
                        location.reload();
                    }
                }
            });
       });
       $('.post_delete').click(function(){
           var id=$(this).attr("post_id");
           var base_url=location.protocol+"//"+document.domain+":"+location.port;
           $.ajax({
               url:base_url+"/admin/post/delete",
               type:"DELETE",
               data:{id:id},
               dataType:"json",
               success:function(res){
                   if(res&&res.status_code==200){
                       location.reload();
                   }
               }
           });
       });
    }
    blindEvent();
}

$(document).ready(function(){
    new Post();
})