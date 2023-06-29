async function login(event) {
    event.preventDefault();

    const email = event.target.emailId.value;
    const password = event.target.password.value;

    const obj = {
        email,
        password
    }
    
    console.log(obj.email);

    try {
        const res = await axios.post('http://localhost:3000/user/login',obj)
        console.log(res)
        localStorage.setItem('token',res.data.token)
        localStorage.setItem('name',res.data.name)
        localStorage.setItem('userId',res.data.userId)
        localStorage.setItem('localMsg','[]')

        if(res.status === 201){
            window.location.href = './chat.html'
        }

        if(res.status === 203){
            // document.body.innerHTML = 'user doesnt exist please signup first'
            alert('user doesnt exist please signup first')
        }

        if(res.status === 207){
            // document.body.innerHTML = 'user doesnt exist please signup first'
            alert('please enter correct password')
        }
        
    } catch (error) {
        console.log(error)
    }
}