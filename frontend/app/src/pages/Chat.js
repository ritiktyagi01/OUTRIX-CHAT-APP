import React from 'react';
import Header from './Header';
import Users from './Users';
import Chating from './Chating';
import './Chat.css'

const Chat = () => {
  return (
    <div>
      <Header/>
      <div className='boxes'>
      <Users/>
      
      </div>
    </div>
  )
}

export default Chat