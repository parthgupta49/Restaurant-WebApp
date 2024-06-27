    const userProfile = document.getElementById('user-profile');
    const userName = document.getElementsByClassName('user-name');
    const login_btn = document.getElementById('login-btn');
    const userNaamfirst = document.getElementById('user-name-first');

    const userNaamimage = document.getElementById('user-name-image')

// Function to check if the user is authenticated
function checkAuthentication() {
    // Retrieve the token from local storage
    console.log("insideCheckAuthentication fucntion inside the AuthenticatorAssertionResponse.js common file")
    let token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
    if(token){
      token = token.split('=')[1];
    console.log(token)
  
    // Send the token to the server for validation
    fetch('http://localhost:4000/api/v1/auth/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token }),
    })
    .then(response => {
      console.log(response)
        if (!response.ok) {
            // Handle authentication failure
            handleAuthenticationFailure();
            throw new Error('Authentication failed');
        }
        // Authentication successful, parse response JSON
        return response.json();
    })
    .then(data => {

      console.log(data)
        // Check if the token is valid
        if (data) {
            // Token is valid, update UI with user details
            return updateUserProfile(data);
        } else {
          console.log("this is the else part")
            // Token is invalid, handle authentication failure
            return handleAuthenticationFailure();
        }
    })
    .catch(error => {
        console.error('Authentication error:', error);
    });



    }
    else{
      console.log('no token exists');
      handleAuthenticationFailure();
    }
    // return handleAuthenticationFailure()
  }
  
  // Function to handle authentication failure
  function handleAuthenticationFailure() {
    // Redirect the user to the login page or show login button
    // Implement your logic here
    // alert("Session expired\nPlease log in ")
    console.log("Authentication Failure inside common auth file")

    login_btn.style.display = 'block';

  }
  
  // Function to update the user profile with user details
  function updateUserProfile(user) {
    console.log(user)
    
    const username = user.username.split(" ")[0];
  
    login_btn.style.display = 'none';
    userProfile.style.display = 'flex'
    userNaamimage.src = user.image;
    for (let i = 0; i < userName.length; i++) {
      //collection[i].style.backgroundColor = "red";
      userName[i].textContent = `
              ${username}
          `;
    }

    // userNaamfirst.textContent = username.charAt(0).toUpperCase();
  }
  
  // Call the function to check authentication status when the page loads
  window.addEventListener('load', checkAuthentication);


  document.querySelector('.logoutButton').addEventListener('click', function() {
    // Remove the token cookie
    console.log('logout button clicked')
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // Redirect user to login page or any other page
    window.location.href = './index.html';
  });




























  // Praneesh Changes =>
        
  async function f1()
  {
    let returnable;
    let token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
    if(token){
      token = token.split('=')[1];
    }
  console.log(token)
    await fetch('http://localhost:4000/api/v1/auth/auth', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token }),
    })
    .then(response => {
      if (!response.ok) {
          // Handle authentication failure
          //handleAuthenticationFailure();
          console.log("!response : auth failure");
          throw new Error('Authentication failed');
      }
      // Authentication successful, parse response JSON
      return response.json();
    })
    .then(data => {
      // Check if the token is valid
      if (data.success) {
          // Token is valid, update UI with user details
          //return updateUserProfile(data);
          console.log("data.success");
          console.log("returnable in data.success : "+data);
          returnable = data;
      } else {
          // Token is invalid, handle authentication failure
          //return handleAuthenticationFailure();
          console.log("data : auth failure");
      }
    })
    .catch(error => {
      console.error('Authentication error:', error);
    });

    console.log("returnable in f1 :"+returnable);
    return returnable;
  }

      //function that saves by not letting visitors visit adimin page
      async function dashboard__function__()
      {
        let userdata = await f1();
        console.log(userdata.accountType);
        let result = await fetch('http://localhost:4000/dashboard/',{
          method : 'POST',
          headers : {
            'Content-Type': 'application/json',
          },
          body : JSON.stringify({
            accountType : userdata.accountType
          })
        });

        let var1 = await result.json();
        console.log(var1);
        window.location.href = var1.redirectTo;
      }

      let dashboard2 = document.getElementById('dashboard');
      dashboard2.addEventListener('click',dashboard__function__)
  