function createToaster(config){
  return function(str){ 
    let div=document.createElement('div');
    div.className=`inline-block   
    ${config.theme === "dark" ? "bg-white text-red-700 border-l-4 border-red-700" : "bg-amber-500 text-white border-l-4 border-white"} 
     p-4 rounded shadow-lg font-bold text-lg
     pointer-events-none transition-opacity duration-300`;

    div.textContent= str;
    document.querySelector('.parent').appendChild(div);
    // document.body.appendChild(div);

    if (config.positionY !== "top" || config.positionX !== "left") {
       document.querySelector('.parent').className += 
       `${config.positionX === "right" ? "right-5" : "left-10"} 
       ${config.positionY === "bottom" ? "bottom-5" : "top-10"} `;  
    }

    ///For removing notification
   setTimeout(()=>{
      document.querySelector('.parent').removeChild(div);
    },config.duration*1000);

    notificationContainer=document.getElementById('notificationContainer');
    if (notificationContainer) {
      const history=div.cloneNode(true);
      notificationContainer.prepend(history);
      setTimeout(() => {
        history.remove();
      }, config.duration * 1000);
    }
    
  };
}
//Calling createToaster in a objeect which has all the configuration
//and later call that object as function to show notification or execute it
let error=createToaster({
  positionX:"right",
  positionY:"bottom",
  theme:"dark",
  duration:3,
});
let success=createToaster({
  positionX:"right",
  positionY:"bottom",
  theme:"light",
  duration:3,
});
document.getElementById("notif").onclick= () =>{
  document.getElementById("notificationContainer").classList.remove("hidden");
  document.getElementById("notificationContainer").classList.add("flex");
}


//open modal/zooming function for each card fetch from api
function openModal(user, image) {
  const modal = document.getElementById("modal");
  const content = document.getElementById("modalContent");

  content.innerHTML = `
  <div class="flex">
    <div class="text-center">
      <img src="${image.urls.regular}" class="w-full h-96 object-cover rounded-lg mb-4"/>

      <div class="flex items-center justify-center gap-3 mb-3">
        <img src="${user.picture.large}" class="w-10 h-10 rounded-full"/>
        <h2 class="text-xl font-semibold">
          ${user.name.first} ${user.name.last}
        </h2>
      </div>
    </div>

    <div class="flex-1 p-6">
    <p class="text-gray-500">Location -> ${user.location.city}, ${user.location.country}</p>
      <p class="text-blue-500">${user.email}</p>
      <p class=" text-gray-500 mt-2 border-t border-gray-300 pt-2"> hey what's up! i hope you are enjoying my content! but if you have any questions, feel free to ask! in comment section</p>

    </div>
  </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}
function openMod(id) {
  const m = document.getElementById(id);
  m.classList.remove('hidden');
  m.classList.add('flex');
}
function showPage(page) {
  document.getElementById('homepage').classList.toggle('hidden', page !== 'home');
  document.getElementById('feedpage').classList.toggle('hidden', page !== 'feed');
  if (page === 'feed' && document.querySelector('.users').children.length === 0) loadData();
}
document.getElementById('navHome').addEventListener('click',()=>showPage('home'));
document.getElementById('navFeed').addEventListener('click',()=>showPage('feed'));
document.getElementById('heroExplore').addEventListener('click',() => showPage('feed'));
document.getElementById('heroRegister').addEventListener('click',() => openMod("registermodel"));
//fetching data from api for cards
async function loadData() {
  // 1. Get users
  const userRes = await fetch("https://randomuser.me/api/?results=9");
  const userData = await userRes.json();

  // 2. Get images from Unsplash
  const imgRes = await fetch(
    "https://api.unsplash.com/photos/random?count=9&client_id=YOUR_SECRET_KEY"
  );
  const imgData = await imgRes.json();

  const container = document.querySelector(".users");
  container.innerHTML = "";

  // 3. Combine both
  userData.results.forEach((user, index) => {
    const image = imgData[index];

    const card = document.createElement("div");
    card.className = "bg-white backdrop-blur-lg rounded-xl shadow-lg p-4 border-2 border-gray-300 transition-transform duration-200 ease-in-out hover:translate-y-1 hover:scale-105 cursor-pointer";
    card.onclick = () => openModal(user, image);

    card.innerHTML = `
    <div class="flex items-center gap-3 mb-3">
     <img src="${user.picture.large}" class="w-8 h-8 rounded-full border-4 border-gray-400"/>
     <h2 class="font-semibold text-lg align-left mb-2">
        ${user.name.first} ${user.name.last}
      </h2>
    </div>
      <img src="${image.urls.small}" class="w-full h-80 object-cover rounded-lg mb-3"/>
      
      <p class="text-sm text-gray-500 mb-2">${user.location.city}, ${user.location.country}</p>
      <p class="text-sm text-blue-500">${user.email}</p>
      <h5 class=" text-gray-900 mt-2">Enjoy your life!</h5>
      <p class="text-gray-500 hidden display-none">${user.description}</p>

    `;

    container.appendChild(card);
    
  });
}

loadData();

//create post form modal on click to create post button
const createPostBtn = document.querySelector(".CP");
createPostBtn.addEventListener("click", () => {
  const modal2 = document.getElementById("modal2");
  const contofCP = document.getElementById("contofCP");
  //apend form info to container to make it card like the other posts


   modal2.classList.remove("hidden");
  modal2.classList.add("flex");
});
// basic structure for close modal function for all
function closeModal(modalname) {
  const modal = document.getElementById(modalname);
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

//append form data ,form card and append into the main container
    const form = document.getElementById("form");
    const username= document.getElementById("username");
    const profileImage = document.getElementById("profileImage");
    const myloc= document.getElementById("myloc");
    const content= document.getElementById("content");
    const image= document.getElementById("image");

let userManager={
    myusers:[],
    accounts:[],
    currentuser:null,
    signup:function(username,email,password,profileImage){
      if (this.accounts.some(acc=>acc.username === username)) {
        error("Username already exists. Please choose a different username.");
        return;
      }
      this.accounts.push({username,email,password,profileImage});
      console.log(this.currentuser);
      success("Account created");
      
    },
    login: function(username,password){
      const user=this.accounts.find(acc=>acc.username === username && acc.password === password);
      if(!user){
        error("Invalid credentials");
        return;
      }
      this.currentuser = user;
      console.log(this.currentuser);
      success("Login successful");
      
    },
    init: function(){
        form.addEventListener('submit',this.sumbitForm.bind(this));  
     },
     sumbitForm: function(e) {
        e.preventDefault();
        if(this.currentuser===null){
          form.reset();
          document.getElementById("modal2").classList.add("hidden"); 
          error("Please login to create a post.");
          return;
        }
        this.addUser();  
     },

    addUser: function(){
         if(myloc.value.trim() === "" || content.value.trim() === "" || image.value.trim() === ""){
        error("Please fill all required fields.");
        return; // stops here, nothing pushed
       }
        this.myusers.push({
        username: this.currentuser.username,
        profileImage: this.currentuser.profileImage,
        myloc: myloc.value,
        email: this.currentuser.email,
        content: content.value,
        image: image.value,
        //empty field validation for form
        });
        
        form.reset(); 
        document.querySelector(".uform").innerHTML ="";
        document.getElementById("modal2").classList.add("hidden"); 
        this.renderUi();
        
        
        
    },
    renderUi: function(){
        this.myusers.forEach(function(user){

        const container = document.querySelector(".uform");
        // container.innerHTML = "";

        const card = document.createElement("div");
        card.className = "bg-white backdrop-blur-lg rounded-xl shadow-lg p-4 border-2 border-gray-300 transition-transform duration-200 ease-in-out hover:translate-y-1 hover:scale-105 cursor-pointer";
        card.onclick = () => open(user);
        
        card.innerHTML = `
        <div class="flex items-center gap-3 mb-3">
        <img src=${user.profileImage} class="w-8 h-8 rounded-full border-4 border-gray-400"/>
        <h2 class="font-semibold text-lg align-left mb-2">
            ${user.username} 
          </h2>
        </div>
          <img src=${user.image} class="w-full h-80 object-cover rounded-lg mb-3"/>
          
          <p class="text-sm text-gray-500 mb-2">${user.myloc}</p>
          <p class="text-sm text-blue-500">${user.email}</p>
          <h5 class=" text-gray-900 mt-2">Enjoy your life!</h5>
          <p class="text-gray-500 hidden display-none">${user.content}</p>
          `;
      document.querySelector(".uform").appendChild(card);
      
      card.addEventListener('dblclick', () =>{
      const index = Array.from(card.parentNode.children).indexOf(card);
          userManager.removeUser(card,index);
        });
    });
 },
    
 removeUser: function (card,index) {
  card.remove();                 // UI remove
  //show remove user in console
  console.log("User removed:", this.myusers[index]);
  this.myusers.splice(index, 1);   // DATA remove  ,splice(startIndex,noOfElementf)
  console.log(this.myusers);  //remaining users-correct
},
}
userManager.init();
console.log(userManager.accounts);



//openmodal/zomming for form appended users from form
function open(user) {
  const modal = document.getElementById("modal");
  const content = document.getElementById("modalContent");

  content.innerHTML = `
  <div class="flex">
    <div class="text-center">
      <img src="${user.image}" class="w-full h-96 object-cover rounded-lg mb-4"/>

      <div class="flex items-center justify-center gap-3 mb-3">
        <img src="${user.profileImage}" class="w-10 h-10 rounded-full"/>
        <h2 class="text-xl font-semibold">
          ${user.username} 
        </h2>
      </div>
    </div>

    <div class="flex-1 p-6">
    <p class="text-gray-500">Location -> ${user.myloc}</p>
      <p class="text-blue-500">${user.email}</p>
      <p class=" text-gray-500 mt-2 border-t border-gray-300 pt-2"> ${user.content}</p>

    </div>
  </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

document.getElementById("openRigester").onclick= () =>{
  document.getElementById("registermodel").classList.remove("hidden");
  document.getElementById("registermodel").classList.add("flex");
}

document.getElementById("openLogin").onclick= () =>{
  document.getElementById("loginmodel").classList.remove("hidden");
  document.getElementById("loginmodel").classList.add("flex");
}

//ensure that onsubmit of both refister and login form their values goes or sended to  usermanager for furthur use and also close the modal after submit and show alert for successfull registration and login
document.getElementById("regform").addEventListener("submit",(e)=>{
  e.preventDefault();
  const regmodal = document.getElementById("registermodel");
  const username = document.getElementById("regusername").value;
  const email = document.getElementById("regemail").value;
  const password = document.getElementById("regpassword").value;
  const profileImage = document.getElementById("profilepic").value;
  //if fields are empty then show alert and return
  if(username.trim() === "" || email.trim() === "" || password.trim() === "" || profileImage.trim() === ""){
    error("Please fill all required fields.");
    return;
  }

  userManager.signup(username,email,password,profileImage);

  regmodal.classList.add("hidden");
  regmodal.classList.remove("flex");
  if(userManager.currentuser){
    setTimeout(()=>{
    success("Registration successful! You can now create posts.");
    },2000);
  }
    document.getElementById("regform").reset();
   
  
});

document.getElementById("loginform").addEventListener("submit",function(e){
  e.preventDefault();
  const logmodal = document.getElementById("loginmodel");
  const username = document.getElementById("logusername").value;
  const password = document.getElementById("logpassword").value;
  
  userManager.login(username,password);

  logmodal.classList.add("hidden");
  logmodal.classList.remove("flex");
  if(userManager.currentuser){
    setTimeout(()=>{
      success("Login successful! You can now create posts.");
    },2000);
  }
  document.getElementById("loginform").reset();
  

});

document.getElementById("acc").addEventListener("click", () => {
  const accmodal = document.getElementById("accountmodel");
  const content = document.getElementById("accountcontent");
  
 if (!userManager.currentuser) {
    error("Please login to view account details.");
    return;
  }
  const posts = userManager.myusers.filter(
  post => post.username === userManager.currentuser.username
);


  content.innerHTML = `
  <div class="flex flex-col items-center gap-4">
    <img src="${userManager.currentuser.profileImage }" 
         class="w-32 h-32 rounded-full border-4 border-gray-400"/>

    <h2 class="text-2xl font-semibold">
      ${userManager.currentuser.username}
    </h2>

    <p class="text-gray-500 text-lg mt-2 border-2 border-gray-300 p-4 rounded-lg">
      ${userManager.currentuser.email}
    </p>
  </div>
   <div class="po mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-4">
    <h3 class="col-span-full text-lg font-semibold">Posts:</h3>

    ${posts.map((post, index) => ` 
          <div class=" account-post bg-white rounded-xl shadow-lg p-4 border-2 border-gray-300 cursor-pointer hover:scale-105 transition" data-index="${index}">
            <img src="${post.image}" class="w-full h-40 object-cover rounded-lg mb-2"/>
            <p class="text-sm text-gray-500 mb-1">${post.myloc}</p>
            <p class="text-sm text-blue-500 mb-2">${post.email}</p>
            <h5 class="text-gray-900 mb-1 hidden display-none">${post.content}</h5>
          </div>
        `).join("")}
        
    
  </div>
`;

accmodal.classList.remove("hidden");
accmodal.classList.add("flex");
//card.getAttribute("data-index");
content.addEventListener("click", (e) => {

  const card = e.target.closest(".account-post");

  if (!card) return;

  const index = Number(card.dataset.index);

  const selectedPost = posts[index];

  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modalContent");

  modalContent.innerHTML = `
    <div class="flex">

      <div class="text-center">
        <img src="${selectedPost.image}" 
             class="w-full h-96 object-cover rounded-lg mb-4"/>

        <div class="flex items-center justify-center gap-3 mb-3">

          <img src="${selectedPost.profileImage}" 
               class="w-10 h-10 rounded-full"/>

          <h2 class="text-xl font-semibold">
            ${selectedPost.username}
          </h2>

        </div>
      </div>

      <div class="flex-1 p-6">

        <p class="text-gray-500">
          Location -> ${selectedPost.myloc}
        </p>

        <p class="text-blue-500">
          ${selectedPost.email}
        </p>

        <p class="text-gray-500 mt-2 border-t border-gray-300 pt-2">
          ${selectedPost.content}
        </p>

      </div>

    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");

 });
       
});
showPage('home');