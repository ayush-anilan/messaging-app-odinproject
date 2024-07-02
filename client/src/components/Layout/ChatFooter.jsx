import React from 'react'

const ChatFooter = () => {
    return (
        <div className='flex justify-center items-center border h-full '>
            <form action="">
                <input type="text" placeholder='Write message' className='w-[1300px] h-14 rounded-md p-5' />
                <button className=' h-14 w-44 rounded-md text-white bg-green-500'>SEND</button>
            </form>
        </div>
    )
}

export default ChatFooter