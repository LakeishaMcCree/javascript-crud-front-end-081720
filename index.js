document.addEventListener("DOMContentLoaded", function(){
  loadPosts()
  loadFormlistener()
  eventDelegation()
  buttonEvent()
  clickEvent()
  mouseOverEvent()
})

const formTitle = document.getElementById("title")
const formAuthor = document.getElementById("author")
const formContent = document.getElementById("content")

function loadPosts(){
  fetch("http://localhost:3000/posts")
  .then(resp => resp.json())
  .then(data =>addPoststoPage(data))
}

function addPoststoPage(posts){
  posts.forEach(function(post){
    // need to create the post in here, attach it to the page
    attachPost(postHtml(post))
  })
}


function loadFormlistener(){
  // identify the form element
  const postForm = document.getElementById("blog-form")
  // add the event listener to the form for the form submit
  postForm.addEventListener("submit", function(event){
      event.preventDefault()
      // grab text from each field
      const postResults = getInfo(event)
      // fetch our results to the back end
      fetch("http://localhost:3000/posts", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postResults)
      })
      .then(resp => resp.json())
      .then(data => {
        // create the html to display the new post
        const htmlPost = postHtml(data)
        // add the new post to the DOM
        attachPost(htmlPost)
        clearForm()
      })
  })  
}


function getInfo(event){
  return {
      title: formTitle.value,
      author: formAuthor.value,
      content: formContent.value
  }
}

function postHtml(post){
  return `
  <div class="card">
      <div class="card-content">
          <span class="card-title">${post.title}</span>
          <span class="card-author"><p>${post.author}</p></span>
          <span class="card-content"><p>${post.content}</p></span>
          <span class="card-likes"><p class="likes">${post.likes}</p></span>
          <button class="add-like">Like me!</button>
          <button class="edit">Edit me!</button>
          <button class="delete">Delete me!</button>
      </div>
  </div>
  `
}

const attachPost = function(post){
  document.querySelector(".post-lists").innerHTML += post
}

function eventDelegation(){
  const postList = document.querySelector(".post-lists")
  postList.addEventListener("click", function(e){
    if (e.target.className == "add-like"){
      let likes = parseInt(e.target.parentElement.querySelector(".likes").innerText)
      let new_likes = likes+1
      e.target.parentElement.querySelector(".likes").innerText = new_likes
    } else if (e.target.className == "edit"){
        const [title, author, content] = e.target.parentElement.querySelectorAll("span")
        formTitle.value = title.innerText
        formAuthor.value = author.innerText
        formContent.value = content.innerText
        


      debugger
    } else if (e.target.className == "delete"){
      console.log("you clicked delete")
    }
  })
}


const clearForm = () => {
  formTitle.value = ""
  formAuthor.value = ""
  formContent.value = ""
}

function buttonEvent(){
  const allPosts = document.querySelector(".post-lists")
  const colors = ["orange", "brown", "gold", "red", "green", "black"]
  let index = 0
  const maxIndex = colors.length
  allPosts.addEventListener("click", function(e){
      if (e.target.className === "colorButton"){
          e.target.parentElement.parentElement.style.backgroundColor = colors[index++]
          if(index == maxIndex){
              index = 0;
          }
      }
  })
}

const christmasColors = ["red", "lightgreen", "white",  "silver", "blue", "gold"]
let index = 0
const maxIndex = christmasColors.length

const changeColor = title => {
  title.style.color = christmasColors[index++]
  if(index == maxIndex){
      index = 0;
  }
}

function clickEvent(){
  const title = document.querySelector(".post-lists h3")
  title.addEventListener("click", function(){
      changeColor(title)
  })
}

function mouseOverEvent(){
  const head = document.querySelector("h1")
  head.addEventListener("mouseover", ()=> changeColor(head))
}
