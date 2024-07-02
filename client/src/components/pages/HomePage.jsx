import React from 'react'
import ChatHeader from '../Layout/ChatHeader'
import Chatbar from '../Layout/Chatbar'
import ChatBody from '../Layout/ChatBody'
import ChatFooter from '../Layout/ChatFooter'


const HomePage = ({ socket }) => {
    return (
        <div className='bg-[#8722be] h-screen'>
            <ChatHeader />
            <div className='flex h-4/5'>
                <div className='w-1/4 border'>
                    <Chatbar />
                </div>
                <div className='w-3/4 border'>
                    <div className='h-5/6 border'>
                        <ChatBody />
                    </div>
                    <div className='h-1/6 border'>
                        <ChatFooter />
                    </div>
                </div>
            </div>
            <div className='border h-[90px]'>
                <p>Footer</p>
            </div>
        </div>
    )
}

export default HomePage