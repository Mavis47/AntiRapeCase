import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './Authentication/layout'
import Login from './Authentication/login'
import Signup from './Authentication/Signup'
import Layout_two from './Redirects/layout';
import PrivateRoute from './PrivateRoute/privateRoute';
import Dashboard from './Dashboard/dashboard';
import Friends from './Dashboard/friends';
import Query from './Dashboard/query'
import Post from './Dashboard/post'
import Alert from './Dashboard/alert'
import Message from './Dashboard/message'

function App() {

  return (
    <>
      <Routes>
          <Route path="/" element={<Layout/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/layout" element={<Layout_two/>} />
          <Route path="/" element={<PrivateRoute/>}>
              <Route path="/dashboard" element={<Dashboard/>} />
              <Route path="/friends" element={<Friends/>}/>
              <Route path="/query" element={<Query/>}/>
              <Route path="/post" element={<Post/>}/>
              <Route path="/alert" element={<Alert/>}/>
              <Route path="/message" element={<Message/>}/>
          </Route>
      </Routes>
    </>
  )
}

export default App
