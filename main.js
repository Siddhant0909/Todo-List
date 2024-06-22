import './style.css'

const todoInputForm=document.querySelector("#todo-input-form");
const todoInput=document.querySelector("#todo-input");
const todoContainer=document.querySelector("#todo-container");
const template=document.querySelector('template')

let todoList=JSON.parse(localStorage.getItem('todos'))||[];

todoInputForm.addEventListener('submit',addTodo)

//ADDING NEW TODO
function addTodo(event){
  event.preventDefault();
  if(!todoInput.value){
    alert('Please add a task')
    return;
  } 
  const todo={
    id:Date.now(),
    task:todoInput.value,
    completed:false
  }
  todoList.push(todo)

  todoInput.value=''

  saveToLocal()
  displayTodo(todoList)
  console.log(todoList);
}



// DISPLAY TODO

function displayTodo(todoList,message){
  if(todoList.length===0){
    todoContainer.innerHTML=`<h1 style="text-align:center">${message}</h1>`
  }
  else{
    todoContainer.innerHTML=''
  }
  todoList.map((todo)=>{
    
    const todoElemClone=document.importNode(template.content,true)
    
    todoElemClone.firstElementChild.setAttribute('id',todo.id)
    
    const newTask=todoElemClone.querySelector('.task-name');
    newTask.value=todo.task



    newTask.addEventListener('click',(e)=>{
        if(!todo.completed){
          todo.completed=true
        }
        else{
          todo.completed=false
        }
        saveToLocal()
        displayTodo(todoList,"Add some Todos")
    },)


    
    
    const editBtn=todoElemClone.querySelector('.edit')
    editBtn.addEventListener('click',()=>{
      if(todo.completed)return;
      if(editBtn.innerText.toLowerCase()==='edit'){
        newTask.removeAttribute('readonly','readonly')
        newTask.focus()
        editBtn.innerText='Save'
        newTask.style.color="#C084FC"
      }
      else{
        newTask.setAttribute('readonly','readonly')
        editBtn.innerHTML='Edit'
        todo.task=newTask.value;
        newTask.style.color="#ffffff"
        saveToLocal();
      }
    })

    if(todo.completed){
      newTask.style.textDecoration='line-through';
      newTask.style.color="#aaa9a9"
      editBtn.style.color="#aaa9a9"
      
    }

    const rmvBtn=todoElemClone.querySelector('.delete');
    rmvBtn.addEventListener('click',()=>{
      todoList.splice(todo,1)
      saveToLocal();
      displayTodo(todoList,"Add some Todos")
    })




    todoContainer.appendChild(todoElemClone)
  })
  
}

displayTodo(todoList,"Add some Todos")

// FILTER TODO
const showFilter=document.querySelectorAll('li');

let isSelected=null;
showFilter.forEach((filter)=>{
  filter.addEventListener('click',(e)=>{
    if(e.target.innerText==='All'){
      displayTodo(todoList,"Add some Todos")
    }
    else if(e.target.innerText==='Pending'){
      const pending=todoList.filter((todo)=>todo.completed===false)
      displayTodo(pending,"No pending Tasks")
    }
    else {
      const done=todoList.filter((todo)=>todo.completed)
      displayTodo(done,"No completed Tasks")
    }

    isSelected?.classList.remove('underline')
    isSelected?.classList.remove('text-red-500')
    isSelected=e.target;
    isSelected.classList.add('underline')
    isSelected.classList.add('text-red-500')
  })
})



//SAVING TO LOCAL STORAGE
function saveToLocal(){
  localStorage.setItem('todos',JSON.stringify(todoList))
}
