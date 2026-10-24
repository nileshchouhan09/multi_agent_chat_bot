
import { useEffect } from 'react'
import Home from './pages/Home'
import getCurrentUser from './features/getCurrentUser'
import { useDispatch } from 'react-redux'
import { setUserData } from './redux/userSlice'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const getUser = async()=>{
      const data = await getCurrentUser()
      dispatch(setUserData(data))
    }
    getUser()
  },[])
  
  return (
    <div className='text-3xl font-bold underline'>
      
    <Home/>
    </div>
  )
}

export default App
