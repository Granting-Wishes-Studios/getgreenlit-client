import { useEffect, useState, useContext } from 'react'
import { AllSpacesCardsList } from '../../../../Components/Dashboard/SpacesComponents/AllSpacesPageComponets/AllSpacesCardsList'
import { CreateSpaceHeader } from '../../../../Components/Dashboard/SpacesComponents/AllSpacesPageComponets/CreateSpaceHeader'
import { getSpaces } from '../../../../networking/spaces'
import { AppContext } from '../../../../context/AppContext';

type SpaceMetadata = {
  id: string
  userId: string,
  featuredImg: string
  avatarImg: string
  name: string
  isMember: boolean,
  joining: boolean,
  hovering: boolean,
  cnt: string

}

const SpacesData: SpaceMetadata[] = []

export const AllSpaces = () => {
  const [setShowAlert] = useState<any>(false)
  const { isAuthenticated,  user, loadSpace, isCreated } = useContext(AppContext);
  const [spacesCards, setSpacesCards] = useState(SpacesData)
  
  useEffect(() => {
    setSpacesCards([])
     getSpaces(user).then( res => {
      const spaces: SpaceMetadata[] = []
      res.forEach(async (space, ind) => {
      const spaceMeta: SpaceMetadata = {
        id: space.id,
        userId: space.userId,
        name: space.title,
        featuredImg: space.featuredImgUrl,
        avatarImg: space.logoImgUrl,
        isMember: space.isMember,
        joining: false,
        hovering: false,
        cnt: 'ind'+ind
      }
      spaces.push(spaceMeta)
      SpacesData.push(spaceMeta)
    })

    if(!isAuthenticated){
      setSpacesCards(prev => [...prev].map(
        obj => obj.isMember == true ? Object.assign(obj, { isMember: false }) : obj))
    }
      setSpacesCards(spaces)

      
  }).catch((err) => {
            console.error('Error:', err);
        });
  }, [isAuthenticated, isCreated]);

  const handleSearchImpl = (val: string) => {
    if (val.length) {
      let filtered = SpacesData.filter((d) => d.name.toUpperCase().includes(val.toUpperCase()))
      if (filtered) {
        setSpacesCards(filtered)
      } else {
        setSpacesCards(SpacesData)
      }
    } else {
      setSpacesCards(SpacesData)
    }
  }
  return (
    <div>
      <CreateSpaceHeader setShowAlert={setShowAlert}></CreateSpaceHeader>
      <AllSpacesCardsList spaces={spacesCards} handleSearch={handleSearchImpl}></AllSpacesCardsList>
    </div>
  )
}

export type { SpaceMetadata }