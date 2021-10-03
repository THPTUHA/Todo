
var check_status=false;
var edit_staus=false;
var id_task="";
var base_url=location.protocol+"//"+document.domain+":"+location.port;
var len=$(".task").length;

function done(id_task,check){
    $.ajax({
        url:base_url+"/user/edit/done",
        type:"PUT",
        data:{id_task:id_task,done:check},
        dataType:"json",
        success:function(res){
        }
    });
}

function failure(id_task,check){
    $.ajax({
        url:base_url+"/user/edit/failure",
        type:"PUT",
        data:{id_task:id_task,failure:check},
        dataType:"json",
        success:function(res){
        }
    });
}

function deleteTask(id_task){
    $.ajax({
        url:base_url+"/user/delete",
        type:"DELETE",
        data:{id_task:id_task},
        dataType:"json",
        success:function(res){
        }
    });
}

function action(){
    $(".tbody").sortable({
        stop:function(){
          var tmp=[];
          var index=0;
           $(".task").each(function(){
              tmp.push({pos:index++,id_task:$(this).attr("id_task")});
           })
           $.ajax({
                url:base_url+"/user/sortTasks",
                type:"PUT",
                data:{mp:tmp},
                dataType:"json",
                success:function(res){
                }
           })
        }
    });
    $(".delete").each(function(){
        $(this).click(function(){
            $(this).parent().parent().remove();
        })
    });

    $(".edit").each(function(){
            $(this).click(function(){
                if(!check_status){
                    id_task=$(this).attr("id_task");
                    var parent=$(this).parent().parent();
                    $(".title").val(parent.children(".title_task").text());
                    $(".content").val(parent.children(".content_task").text());
                    $(".add_form").attr("style",""); 
                    parent.remove();
                    check_status=true;edit_staus=true;
                }
            })
    });

    $(".delete").click(function(){
        var id_task=$(this).attr("id_task");
        deleteTask(id_task);
    });

    $(".done").click(function(){
        var check=1-$(this).attr("check");
        var id_task=$(this).attr("id_task");
        done(id_task,check);
    });

    $(".failure").click(function(){
        var check=1-$(this).attr("check");
        var id_task=$(this).attr("id_task");
        failure(id_task,check);
    });

}


function Add(){
    $(".add_task").click(function(){
        check_status=true;
       $(".add_form").attr("style",""); 
    });

    $(".save_form").click(function(){
        $(".add_form").attr("style","display:none;"); 
        var boxDone=$("<th></th>").append($("<input>").attr("type","checkbox").addClass("form-check-input"));
        var boxFailure=$("<th></th>").append($("<input>").attr("type","checkbox").addClass("form-check-input"));
        if(!boxDone.attr("check"))boxDone.attr("check",0);
        if(!boxFailure.attr("check"))boxFailure.attr("check",0);
        var newContent=$(".content").val();
        var newTitle=$(".title").val();
        var title=$("<th></th>").text(newTitle).addClass("title_task");  $(".title").val("");
        var content=$("<th></th>").text(newContent).addClass("content_task");$(".content").val("");
        var edit=$("<button>Edit</button>").addClass("btn btn-primary edit");
        var del=$("<button>Delete</button>").addClass("btn btn-danger delete");
        var action=$("<th></th>").append(edit,del);
        var task=$("<tr></tr>").addClass("task").append(boxDone,boxFailure,title,content,action);
        $(".tbody").append(task);
        $(".delete").each(function(){
            $(this).click(function(){
                $(this).parent().parent().remove();
            })
        });
        if(edit_staus){
            $.ajax({
                url:base_url+"/user/edit/task",
                type:"PUT",
                data:{id_task:id_task,title:newTitle,content:newContent},
                dataType:"json",
                success:function(res){
                }
            });
            edit_staus=false;check_status=false;
        }else{ 
            len++;
            $.ajax({
                url:base_url+"/user/add/task",
                type:"POST",
                data:{title:newTitle,content:newContent,position:len},
                dataType:"json",
                success:function(res){
                    boxDone.attr("id_task",res.id_task);
                    boxFailure.attr("id_task",res.id_task);
                    del.attr("id_task",res.id_task);
                    task.attr("id_task",res.id_task);
                    check_status=false;
                }
            });
            boxDone.click(function(){
                var check=1-$(this).attr("check");
                var id_task=$(this).attr("id_task");
                done(id_task,check);
            });
            boxFailure.click(function(){
                var check=1-$(this).attr("check");
                var id_task=$(this).attr("id_task");
                failure(id_task,check);
            });

            del.click(function(){
                var id_task=$(this).attr("id_task");
                 deleteTask(id_task)
            });

            $(".tbody").sortable({
                stop:function(){
                  var tmp=[];
                  var index=0;
                   $(".task").each(function(){
                      tmp.push({pos:index++,id_task:$(this).attr("id_task")});
                   })
                   $.ajax({
                        url:base_url+"/user/sortTasks",
                        type:"PUT",
                        data:{mp:tmp},
                        dataType:"json",
                        success:function(res){
                        }
                   })
                }
            });
        }
    });
    action();
}

$(document).ready(function(){
    new Add();
});