import React, { useState } from 'react';
// import { useForm } from "react-hook-form";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from '../firebase.config';
firebase.initializeApp(firebaseConfig);


const Login = () => {
    const [newUser, setNewUser]=useState(false)
    // const { register, handleSubmit, formState: { errors } } = useForm();
    // const onSubmit = data => console.log(data);  
    const [user, setUser]=useState({
        isSignedIn: false,
        newUser: false,
        name: '',
        email:'',
        password: '',
        photo:''
    })
    
    const provider = new firebase.auth.GoogleAuthProvider();
    const handleSignIn =()=>{
        firebase.auth()
        .signInWithPopup(provider)
        .then((res) => {
            const {displayName, photoURL, email} = res.user;
            const signedInUser ={
                isSignedIn: true,
                name: displayName,
                email:email,
                photo: photoURL,
            }
            console.log(res.user)
            setUser(signedInUser)
        }).catch((err) => {
            console.log(err);
            console.log(err.message);
        });
    }        

    const handleSingOut = ()=>{
        firebase.auth().signOut()
        .then(res =>{
            const signedInUser ={
                isSignedIn: false,
                name: '',
                email:'',
                error: '',
                photo:'',
                success:false,
            }
            setUser(signedInUser);
        }).catch(err =>{
            console.log(err)
        })
    }

    
    

    const handleChange = (e) => {
        let isFieldValid = true;
        console.log(isFieldValid)
        
        if(e.target.name === 'email'){
            isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
           
        } if(e.target.name === 'password'){
             const isPasswordValid =e.target.value.length> 6;
             const passwordNumber =  /^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$/.test(e.target.value);
             isFieldValid = isPasswordValid && passwordNumber;
        }if(isFieldValid){
            const newUserInfo = {...user};
            newUserInfo[e.target.name]= e.target.value;
            setUser(newUserInfo)
        }
        
    }
    const handlefrom =(e)=>{       
        if(newUser && user.email && user.password){            
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
            .then((res) => {
                const newUserInfo ={...user};
                newUserInfo.error ='';
                newUserInfo.success =true;
                setUser(newUserInfo);  
                updateUserName(user.name)                          
            })
            .catch((error) => {
                const newUserInfo ={...user};
                newUserInfo.error = error.message
                newUserInfo.success =false;
                setUser(newUserInfo);
            });
            console.log("submitet")
        }
        if(!newUser && user.email && user.password){
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
            .then((res) => {
                const newUserInfo ={...user};
                newUserInfo.error ='';
                newUserInfo.success =true;
                setUser(newUserInfo);   
                console.log('sign in user info', res.user)
            })
            .catch((error) => {
                const newUserInfo ={...user};
                newUserInfo.error = error.message
                newUserInfo.success =false;
                setUser(newUserInfo);
            });
        }
        e.preventDefault();
    }
    const updateUserName =name=>{
        const user = firebase.auth().currentUser;
        user.updateProfile({
            displayName: name,            
            }).then((res) => {
            console.log('user name updated successfully')
            }).catch((error) => {
                console.log(error)
            });  
    }
    

    return (
        <div>
            <h1>LogIn</h1>
            <input type="checkbox" onChange={()=>setNewUser(!newUser)} name="newUser" value="" id=""/>
            <label htmlfor="newUser">New User Sign Up</label>
            <form onSubmit={handlefrom}>
                {newUser && <input type="text" onChange={handleChange} name="name" placeholder="Your Name"/>}<br/>
                <input type="email" onChange={handleChange} name="email" placeholder="Email" /><br/>
                <input type="password" onChange={handleChange} name="password" placeholder="Password"/><br/>
                <input type="submit" value={newUser ? 'Sign Up':'Sign In'}/>  
            </form>  
            <p style={{color:'red'}}>{user.error}</p>   
            {user.success && <p style={{color:'green'}}>User {newUser ?'created':'Logged In'} successfully</p>   }     








            <h1>LogIn</h1>
            {/* <form onSubmit={handleSubmit(onSubmit)}>               
                <input type="text" name="name" {...register("name", { required: true })} placeholder="Name" />  <br/>
                <input type="email"  name="email" {...register("email", { required: true })} placeholder="Enter email" />   <br/> 
                <input type="password"  name="password" {...register("password", { required: true })} placeholder="Password" /> <br/>                                  
                {errors.exampleRequired && <span>This field is required</span>}                
                <input type="submit" />
            </form> */}
            <div>
                {user.isSignedIn ? <button onClick={handleSingOut}>Sign Out</button> :
                <button onClick={handleSignIn}>Sign In</button>}
            </div>
            {user.isSignedIn && <div>
                <p>Welcome, {user.name}</p>
                <p>Your email: {user.email}</p>
                </div>}
                
        </div>
    );
};

export default Login;