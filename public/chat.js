const token = localStorage.getItem('token');
const name = localStorage.getItem('name');
const userId = localStorage.getItem('userId');

const authAxios = axios.create({
    baseURL: "http://localhost:3000",
    headers: { Authorization: token },
  });

  //top-display 

  document.getElementById("login-name").innerHTML = `${name}`;
  const currentGroup = document.getElementById("current-group-name");
  if(localStorage.getItem("groupName") != null) {
    currentGroup.innerHTML = `${localStorage.getItem("groupName")}`
  } else {
    currentGroup.innerHTML = "Select a Group";
  }

  function logout() {
    localStorage.clear();
    window.location.href="./login.html";
  }
  
    async function createGroup(event) {
      //event.preventDefault();
      try {
          const name = document.getElementById("create-group-input").value;
          const res = await authAxios.post('/create-group', {name, isAdmin:true});
          console.log('>>GrouP ID', res);
          const groupId = res.data.group.id;
          localStorage.setItem('groupId', groupId);
  
      }catch (err) {
          console.log(err);
      }
    }

  authAxios
  .get("/get-groups")
  .then((res) => {
    //getting groups
    const groupListDiv = document.getElementById("group-list");
    groupListDiv.innerHTML = "";
    res.data.groups.forEach((group) => {
      groupListDiv.innerHTML += `
          <li id="${group.id}" style="padding:5px 0;">
          <span>${group.name}</span>
          <button id="show-users">Show Users</button>
          <button id="change-group-btn" class="group-btn">Enter Chat</button>
          <button id="delete-group-btn" class="group-btn">Delete Group</button>
          </li>
          `;
    });
  })
  .catch((err) => console.log(err));

  //get groups
  //chats
  
    //chats
    let localMsg = JSON.parse(localStorage.getItem("localMsg"));
    //console.log(typeof(localMsg))
    let lastId;
    if ( localMsg.length == 0) {
      lastId = 0;
    }
    if (localMsg.length > 0) {
      lastId = localMsg[localMsg.length - 1].id;
    }
    const groupId = localStorage.getItem("groupId");
  
    if (localStorage.getItem("groupId") != null) {
      console.log('***********', lastId)
      //  setInterval(() => {
      authAxios
        .get(`/get-chats?id=${lastId}&gId=${groupId}`)
        .then((response) => {
          console.log('*******RESP', response)
        
          let retrivedMsg = localMsg.concat(response.data.chat);
          console.log('all retrrrrrrrrived msg',retrivedMsg)

          //deleting old messages from local storage
          while (retrivedMsg.length > 10) {
            for (let i = 0; i < retrivedMsg.length - 10; i++)
              retrivedMsg.shift();
          }
          localStorage.setItem("localMsg", JSON.stringify(retrivedMsg));
  
          const div = document.getElementById("group-chat-receive-box");
          div.innerHTML = ""
          retrivedMsg.forEach((chat) => {
            div.innerHTML += `<div id="${chat.id}>"><span style="color:green;"><b>${chat.name}:</b></span><span>${chat.message}</span></div>`;
          });
        })
        .catch((err) => console.log(err.response));
      // }, 4000)
    }


    function sendGroupMsg(event,imageurl) {
      event.preventDefault();
  
      if (localStorage.getItem("groupId") == null) {
        alert("Select a group first");
        document.getElementById("group-chat-input").value = "";
      } else {
        const input = document.getElementById("group-chat-input").value;
        const obj = {
          message: input || imageurl,
          name: name,
          groupId: localStorage.getItem("groupId"),
        };
        console.log(obj);
        authAxios
          .post("/post-chat", obj)
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
        document.getElementById("group-chat-input").value = "";
        document.getElementById("group-chat-receive-box").innerHTML += `
                  <div><span style="color:green;"><b>${name}:</b></span><span>${obj.message}</span></div>`;
      }
    }
  
    document
    .getElementById("group-list-wrapper")
    .addEventListener("click", (e) => {      //for changing/deleting group

      if (e.target.id === "change-group-btn") {
        const gId= e.target.parentNode.id;
        const gName= e.target.parentNode.children[0].innerText;
        console.log(gId,gName)
        localStorage.setItem("groupId", gId);
        localStorage.setItem("groupName", gName);
        localStorage.setItem("localMsg", "[]");
        window.location.reload();
      }

      if (e.target.id === "delete-group-btn") {
        const gId= e.target.parentNode.id;
        console.log(gId)
        if (confirm("Are you sure?")) {
          authAxios
            .delete(`/delete-group/${gId}`)
            .then((res) => {
              console.log(res.data);
              localStorage.removeItem("groupId");
              alert(`Group with id-${gId} is deleted successfully`);
              window.location.reload();
            })
            .catch((err) => 
              alert("you are not admin"))
              // console.log(err.response.data,"this is not admin error"));
        }
      }

      if (e.target.id === "show-users") {
        const gId= e.target.parentNode.id;
        authAxios
          .get(`/get-users/?gId=${gId}`)
          .then((res) => {
            // console.log(res.data);
            document.getElementById("users-inside-group").innerHTML = "";
            console.log(res,"res")
            res.data.userData.forEach((user) => {
              document.getElementById("users-inside-group").innerHTML += `
                        <li id="${user.groups[0].id}">
                            <span>${user.name}</span>
                            <span>${user.email}</span>
                            <span>Admin:${user.groups[0].usergroup.isAdmin}</span>
                            <button id="remove-user-btn" class="user-btn">Remove</button>
                            <button id="make-admin-btn">Make Admin</button>
                        </li> `;
            });
          })
          .catch((err) => console.log(err));
      }

      if (e.target.id === "remove-user-btn") {
        const obj = {
          email: e.target.parentNode.children[1].innerText,
          groupId: e.target.parentNode.id,
        };
        console.log(obj);
        if (confirm("Are you sure?")) {
          authAxios
            .post("/remove-user", obj)
            .then((res) => {
              console.log(res.data);
              alert(`user with ${obj.email} has been removed from the group`);
              window.location.reload();
            })
            .catch((err) => {
              console.log(err.response);
              alert(` you are not an admin of this group`);
            });
        }
      }

      if (e.target.id === "make-admin-btn") {
        const obj= {
            email: e.target.parentNode.children[1].innerText,
            groupId: e.target.parentNode.id
        }
        // console.log(obj)
        authAxios
          .post("/make-admin", obj)
          .then((res) => {
            alert(`${obj.email} is an admin now`)
            window.location.reload();
          })
          .catch((err) => 
          alert('you are not an admin'));
      }
    });

    //USERS FUNCTIONALITY
    //POSTING USERS
    
    document.getElementById("user-list").addEventListener("click", (e) => {
      //for adding/removing users
      const email = e.target.parentNode.children[1].innerText;
      // console.log(email)
      const isAdmin = e.target.parentNode.children[3].checked;
      //console.log(isAdmin)
  
      if (localStorage.getItem("groupId") == null) {
        return alert("Please select a group first");
      }
      const obj = {
        email: email,
        groupId: localStorage.getItem("groupId"),
        isAdmin: isAdmin,
      };
      // console.log(obj);
      if (e.target.id === "add-user-btn") {
        authAxios
          .post("/add-user", obj)
          .then((res) => {
            console.log(res.data);
            alert(`user ${email} added to the group`);
            window.location.reload();
          })
          .catch((err) => {
            console.log(err);
            if (err.response.status == 400){
              alert(`you are not an admin`)
            } 
            else{
              alert(`user ${email} is already a member`);
            }
          });
      }
    });
 
    authAxios
    .get("/get-users")
    .then((res) => {
      // getting users
      // console.log(res.data);
      const userListDiv = document.getElementById("user-list");
      userListDiv.innerHTML = "";
      res.data.user.forEach((user) => {
        userListDiv.innerHTML += `
            <li id='user-${user.id}' class="user-list-inside" style="padding:5px 0;" user-list-li>
            <span>${user.name}</span>
            <span>${user.email}</span>
            <label for="accept">Admin</label>
            <input type="checkbox" id="accept">
            <button id="add-user-btn" class="user-btn">Add</button>
            </li> `;
      });
    })
    .catch((err) => console.log(err.response));

    function sendMedia() {
      axios.post('http://localhost:3000/upload')
      .then(res => {
        console.log(res,"this is upload res")
        sendGroupMsg(event,res.data.fileURL)
        
      })
      .catch((err) => {
        console.log(err);
      });
    }