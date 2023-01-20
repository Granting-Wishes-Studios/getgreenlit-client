import { useEffect,useContext } from 'react'
import MainSidebar from './MainSidebar/MainSidebar'
import "./MainLayout.css"
import { MainNavbar } from './MainNavbar/MainNavbar'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import { AppContext } from '../../../../context/AppContext';


export const MainLayout = (props: any) => {
  
  const { user, navHeadData } = useContext(AppContext)

    useEffect(() => {
      window.addEventListener("resize", () => {props.setShowMainSidebar(false)})
    }, [props])
  return (
    <div className={`mainLayout fixed w-full h-full`}>
      <div className="h-full w-full flex flex-row">
      <Toaster />
        <div>
          <MainSidebar
            show={props.showMainSidebar}
            setShow={props.setShowMainSidebar}
            setNestedSidebarShow={props.setNestedSidebarShow}
          />
        </div>
        <div className="w-full h-full children">
              <MainNavbar addr={ user.address ? user.address.substring(0, 6)+'...'+user.address.substring((user.address.length - 4)) : ""} setShow={props.setShowMainSidebar} navHeading={{title:navHeadData.title, img:navHeadData.img}}></MainNavbar>
          <div className="h-full overflow-y-auto pb-14">
           <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
