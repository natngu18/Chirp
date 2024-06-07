import { useLocation } from 'react-router-dom'

function usePathname() {
    const location = useLocation()
    return location.pathname
}

export default usePathname
