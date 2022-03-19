class ToDoList{
    task_edit;
    constructor(){
        this.button_add_task = $("#add_task");
        this.task_form = $("#task_form");
        this.button_save_task = $("#save_task");
        this.task_form_name = $("#task_form_name");
        this.task_form_content = $("#task_form_content");
        this.tasks = $("#tasks");
    }

    add(task){
        const col_1 = $("<th></th>").append(
            $("<input/>",{class:"form-check-input done", type : "checkbox"})
        )
        const col_2 = $("<th></th>").append(
            $("<input>",{class:"form-check-input failure", type : "checkbox"})
        )
        const col_3 = $("<th></th>",{class:"title_task"}).text(task.name);
        const col_4 =  $("<th></th>",{class:"content_task"}).text(task.content);
        const col_5 = $("<th></th>").append(
            $("<button>",{class:"btn btn-primary edit"}).text("Edit"),
            $("<button>",{class:"btn btn-danger delete"}).text("Delete"),
        )
        this.tasks.append($("<tr>",{class: "task", id:task.id}).append(col_1,col_2,col_3,col_4,col_5));
    }

    openTaskForm(){
        this.task_form.show();
        this.button_add_task.hide();
    }

    closeTaskForm(){
        this.task_form.hide();
        this.button_add_task.show();
    }

    update(id){
        $.post("/user/tasks/update",{id: id},(data)=>{
            if(data.status_code == 200){
                content.innerText = this.task_form_content.val();
                name.innerText = this.task_form_name.val();
                
            }
        })
    }


    modify(){
        this.tasks.click((e)=>{
            if(e.target.classList.contains("delete")){
                const task = e.target.parentElement.parentElement;
                $.post("/user/tasks/delete",{id:task.id},(data)=>{
                    if(data.status_code == 200){
                        task.remove();
                    }
                })
            }

            if(e.target.classList.contains("edit")){
                this.task_edit =  e.target.parentElement.parentElement;
                const content = this.task_edit.childNodes[7];
                const name = this.task_edit.childNodes[5];
                this.task_form_name.val(name.innerText);
                this.task_form_content.val(content.innerText);
                this.openTaskForm();
            }
        })

        this.button_save_task.click(()=>{
            const data = {
                name: this.task_form_name.val(),
                content: this.task_form_content.val()
            }

            if(this.task_edit){
                data.id = this.task_edit.id;
                $.post("/user/tasks/update",data,(data)=>{
                    if(data.status_code == 200){
                        this.task_edit.childNodes[7].innerText = this.task_form_content.val();
                        this.task_edit.childNodes[5].innerText = this.task_form_name.val();
                        this.task_edit = undefined;
                        this.closeTaskForm();
                    }
                })

            }else{
                $.post("/user/tasks/add",data,(data)=>{
                    if(data.status_code == 200){
                        this.add(data.task);
                        this.button_add_task.show();
                        this.closeTaskForm();
                    }
                })
            }
        })
    }

    init(){
        this.button_add_task.click(()=>{
            this.openTaskForm();
        });

        this.modify();
    }
}
$(document).ready(function(){
   const todo = new ToDoList();
   todo.init();
});

