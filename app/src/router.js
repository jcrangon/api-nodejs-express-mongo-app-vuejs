import { createWebHistory, createRouter } from "vue-router";
import {api, utils} from './api/api'

 // les composants cibles du routage

 import HomePage from './pages/HomePage'
 import CreatePage from './pages/CreatePage'
 import SinglePage from './pages/SinglePage'
 import UpdatePage from './pages/UpdatePage'
 import LoginPage from './pages/LoginPage'
 import RegisterPage from './pages/RegisterPage'
 import LogoutPage from './pages/LogoutPage'
 import ProfilePage from './pages/ProfilePage'
 import NotFoundPage from './pages/NotFoundPage'

// console.log('utils: ', utils)
// console.log('api: ', api)

 // les routes de l'application

 const routes = [

    // home

   { 
    path: '/', 
    name: 'home', 
    component: HomePage, 
    props: {api: api, utils: utils},
  },

    // CreatePage

   {

     path: '/post/create', 
     name: 'create-post', 
     component: CreatePage, 
     props: {api: api, utils: utils},

   },

   {

    // SinglePage

     path: '/post/single/:id', 
     name: 'single-post', 
     component: SinglePage, 
     props: {api: api, utils: utils},

   },

    // UpdatePage

   {

     path: '/post/update/:id', 
     name: 'update-post', 
     component: UpdatePage, 
     props: {api: api, utils: utils},

   },

    // Login page

   {

    path: '/login', 
    name: 'login', 
    component: LoginPage, 
    props: {api: api, utils: utils},

  },

  // Registration Page

  {

    path: '/register', 
    name: 'register', 
    component: RegisterPage, 
    props: {api: api, utils: utils},

  },

  // Logout Page

  {

    path: '/logout', 
    name: 'logout', 
    component: LogoutPage, 
    props: {api: api, utils: utils},

  },

  // Profile Page

  {

    path: '/user/profile', 
    name: 'profile', 
    component: ProfilePage, 
    props: {api: api, utils: utils},

  },

  // 404 page
  {

    path: "/:catchAll(.*)",
    name: '404',
    component: NotFoundPage,
    props: {api: api, utils: utils},
  },


 ]


 // le routeur

 const router = createRouter({

  history: createWebHistory(),

  routes,

});


 // export du routeur

 export default router