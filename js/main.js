
const Main = {

  tasks: [],

  init: function() {
    this.cacheSelectors()
    this.bindEvents()
    this.getStoraged()
    this.buildTasks()
  },

  cacheSelectors: function () {
    this.$checkButtons = document.querySelectorAll('.check') //$ é uma boa prática para indicar que a variável é um elemento html
    this.$inputTask = document.querySelector('#inputTask')
    this.$list = document.querySelector('#list')
    this.$removeButtons = document.querySelectorAll('.remove')
  },

  bindEvents: function () {
    const self = this

    this.$checkButtons.forEach(function (button){
      button.onclick = self.Events.checkButton_click
    })

    this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this)

    this.$removeButtons.forEach(function (button){
      button.onclick = self.Events.removeButton_click.bind(self)
      })
  },

  getStoraged: function(){
    const tasks = localStorage.getItem('tasks')
    this.tasks = JSON.parse(tasks)
  },

  buildTasks: function () {
    let html = ''

    this.tasks.forEach(item => {
      html += `
         <li>
            <div class="check"></div>
              <label class="task">
                ${item.task}
              </label>
              <button class="remove" data-task="${item.task}"></button>
         </li>  
      `
    })

    this.$list.innerHTML = html

    this.cacheSelectors()
    this.bindEvents()
  },
  
  Events: {
    checkButton_click: function (e){
      const li = e.target.parentElement
      const isDone = li.classList.contains('done')

      if (!isDone){ //boa prática sempre começar verificando a negação + usar o return para o if não passar para a pŕoxima linha
        return li.classList.add('done')
      }
      li.classList.remove('done')
    },

    inputTask_keypress: function(e) {
      const key = e.key
      const value = e.target.value

      if (key === 'Enter') {
        this.$list.innerHTML += `
          <li>
            <div class="check"></div>
              <label class="task">
                ${value}
              </label>
              <button class="remove" data-task="${value}"></button>
          </li>  
        `
        e.target.value = ''
        
        this.cacheSelectors() //preciso adicionar os eventos novamente, pois o innerHTML mexeu na árvore do DOM, retirando os eventos dos itens anteriores.
        this.bindEvents()
        
        const savedTasks = localStorage.getItem('tasks')
        const savedTasksObj = JSON.parse(savedTasks)
        
        const obj = [
          {task: value},
          ...savedTasksObj, //spread operator "..."
        ]
        
        localStorage.setItem('tasks', JSON.stringify(obj))
      }
    },

    removeButton_click: function (e) {
      const li = e.target.parentElement
      const value = e.target.dataset['task']

      const newTasksState = this.tasks.filter(item => item.task !== value)
      
      localStorage.setItem('tasks', JSON.stringify(newTasksState))

      li.classList.add('removed')

      setTimeout(function (){
        li.classList.add('hidden')
      },200)
    }
  }

}

Main.init()

