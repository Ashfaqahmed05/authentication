import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import {getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,    } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js'
  import { getFirestore, getDocs, doc,
    collection, addDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";  



const firebaseConfig = {
  apiKey: "AIzaSyB_hpk0_1C7sbYO5Nfkb-7fzZU0Z4nSljg",
  authDomain: "blog-app-487c3.firebaseapp.com",
  projectId: "blog-app-487c3",
  storageBucket: "blog-app-487c3.appspot.com",
  messagingSenderId: "648084995478",
  appId: "1:648084995478:web:3c248fa1cbc27902deb1b7",
  measurementId: "G-6QYGRSJ2CX"
};  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);

const todosCollectionRef = collection(db, 'todos')




const registerForm = document.getElementById('register-form')
const loginForm = document.getElementById('login-form')
let logout = document.getElementById('logout')
let blog = document.getElementById('blog')
let desc = document.getElementById('desc')
let level = document.getElementsByName('level')
let addInfo = document.getElementById('addinfo')
let todosContainer = document.getElementById('todosContainer')



onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    
    console.log('logged in')
    // window.location.assign('home.html')
    
    // ...
  } else {
    // User is signed out
    // window.location.assign('index.html')
    // ...
  }  
});  

registerForm?.addEventListener('submit', e => {
  e.preventDefault()
  console.log(e)
  const userInfo = {
    fullname: e.target[0].value,
    email: e.target[1].value,
    password: e.target[2].value
  }  
  createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password)
  .then(userCredential => {
    // Signed up
    const user = userCredential.user
    console.log('user->', user)
    alert('Congtulations, Your account registered your Uid ' + user.uid)
    window.location.assign('index.html')
    // ...
  })  
  .catch(error => {
    const errorCode = error.code
    const errorMessage = error.message
    console.log('errorMessage->', errorMessage)
    alert('Please try again' + errorMessage)

    // ..
  })  
})  
loginForm?.addEventListener('submit', e => {
  console.log('login form',e)
  e.preventDefault()
  const userInfo = {
    email: e.target[0].value,
    password: e.target[1].value
  }  
  signInWithEmailAndPassword(auth, userInfo.email, userInfo.password)
    .then(userCredential => {
      // Signed up
      const user = userCredential.user
      console.log('user logged in->', user)
      alert('Congratulations, Your Account logged in')
      window.location.assign('home.html')
      // ...
      
    })  
    .catch(error => {
      const errorCode = error.code
      const errorMessage = error.message
      console.log('errorMessage user not logged in->', errorMessage)
    alert('Sorry' + errorMessage)  
      // ..
    })  
})    

logout?.addEventListener('click', () => {
  signOut(auth).then(() => {
      // Sign-out successful.
      console.log('signedout')
      window.location.assign('index.html')
  }).catch((error) => {  
      // An error happened.
      console.log('signedout', error)

  });    
}) 




addInfo?.addEventListener('click', async () => {
    if (!blog.value) return alert('Please add todo')
  try {
      const docAdded = await addDoc(todosCollectionRef, {
          todo: blog.value,
          // description: desc.value,
          // Level : level.value
      });
      blog.value = ''
      desc.value = ''
      level.value = ''
      console.log("Document written with ID: ", docAdded);
      getTodos()
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  })
  
  async function getTodos() {
    todosContainer.innerHTML = null
  const querySnapshot = await getDocs(todosCollectionRef);
  querySnapshot.forEach((todoDoc) => {
      const todoObj = todoDoc.data()
      const div = document.createElement('div')
      div.className = 'todo-div'
      const span = document.createElement('span')
      span.innerText = todoObj.todo
      div.className = 'todo-div'
      // const check = document.createElement('span')
      // span.innerText = todoObj.des
      const button = document.createElement('button')
      button.innerText = 'Delete'
      button.id = todoDoc.id
      button.addEventListener('click', async function () {
        console.log(this)
        console.log(todoObj)
        
        const docRef = doc(db, 'todos', this.id)
        console.log(docRef)
          await deleteDoc(docRef)
          getTodos()
        })
        
        
        div.appendChild(span)
      div.appendChild(button)
      todosContainer.appendChild(div)

  });
}
