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
const postForm = document.getElementById("blog-form")
const baseURL = "http://localhost:3000/posts"

function loadPosts(){
  fetch("http://localhost:3000/posts")
  .then(resp => resp.json())
  .then(data =>addPoststoPage(data))
}

function addPoststoPage(posts){
  document.querySelector(".post-lists").innerHTML = ""
  posts.forEach(function(post){
    // need to create the post in here, attach it to the page
    attachPost(postHtml(post))
  })
}


function loadFormlistener(){
  // identify the form element
  // add the event listener to the form for the form submit
  postForm.addEventListener("submit", function(event){
      event.preventDefault()
      // grab text from each field
      const postResults = getInfo(event)
      let options
      let url
      if (postForm.dataset.action === "create"){
        options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postResults)
        }
        url = baseURL
      } else if (postForm.dataset.action === "update"){
        options = {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postResults)
        }
        url = `${baseURL}/${postForm.dataset.id}`
      }
      // fetch our results to the back end
      fetch(url, options)
      .then(resp => resp.json())
      .then(data => {
        if (!data.errors){
          loadPosts()
          clearForm()
        } else {
          throw new Error( `${data.errors}`)
        }
      })
      .catch(alert)
  })  
}

async function deletePost(id){
  const resp = await fetch(`${baseURL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const data = await resp.json()
  loadPosts()
}

// function deletePost(id){
//   fetch(`${baseURL}/${id}`, {
//     method: 'DELETE',
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })
//   .then(resp => resp.json())
    // .then(data => {
    //   loadPosts()
    // })
//   
// }






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
      <div class="card-content" id="${post.id}">
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
        postForm.dataset.id = e.target.parentElement.id
        document.getElementsByClassName("btn")[0].value = "Edit Post"
        postForm.dataset.action = "update"

    } else if (e.target.className == "delete"){
      debugger
      console.log("you clicked delete")
      const postID = e.target.parentElement.id
      deletePost(postID)
    }
  })
}


const clearForm = () => {
  postForm.dataset.action = "create"
  delete postForm.dataset.id
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
