document.addEventListener("DOMContentLoaded", function(){
  loadPosts()
  loadFormlistener()
  buttonEvent()
  clickEvent()
  mouseOverEvent()
})

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
      title: event.target.querySelector("#title").value,
      author: event.target.querySelector("#author").value,
      content: event.target.querySelector("#content").value
  }
}

function postHtml(post){
  return `
  <div class="card">
      <div class="card-content">
          <span class="card-title">${post.title}</span>
          <p>${post.author}</p>
          <p>${post.content}</p>
          <button class="colorButton">Change Background</button>
      </div>
  </div>
  `
}

const attachPost = function(post){
  document.querySelector(".post-lists").innerHTML += post
}

const clearForm = () => {
  document.getElementById("title").value = ""
  document.getElementById("author").value = ""
  document.getElementById("content").value = ""
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
