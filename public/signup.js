async function signUp(event) {
    event.preventDefault();

    const name = event.target.name.value;
    const email = event.target.email.value;
    const phone = event.target.phone.value;
    const password = event.target.password.value;

    const obj = {
        name,
        email,
        phone,
        password
    }

    console.log(obj.email);

    try {
        const res = await axios.post('http://localhost:3000/user/signup',obj)
        if(res.status === 201){
            alert('User created succesfully')
            window.location.href = './login.html'
        }  else if(res.status === 207){
            alert(res.data.message);
        }
        
    } catch (error) {
        console.log(error, "error came")
    }
}