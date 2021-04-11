import {useState,useContext, useEffect} from 'react'
import Card from './Card'
import CurrentUserContext from '../contexts/CurrentUserContext'

function Main(props) {
    const {cards,onEditAvatar,onEditProfile,onAddPlace,onCardClick,onCardDelete,onCardLike,onUnloadedAvatar,onUnLoadedImage} = props;

    const user = useContext(CurrentUserContext)
    const [originalAvatar,setOriginalAvatar] = useState()
    const [isLoaded,setIsLoaded] = useState(false)
    const [isCardsLoaded,setIsCardsLoaded] = useState(0)
    const isReady =  user && isLoaded && true

    useEffect(() => {
        if(isLoaded) return setOriginalAvatar(user.avatar);
        if(originalAvatar) onUnloadedAvatar({avatar: originalAvatar})
    },[isLoaded])

    function handleCardLoading() {
        setIsCardsLoaded(isCardsLoaded + 1)
    }

    function showCards() {
        if(cards.length < 7) return isCardsLoaded === cards.length 
        return isCardsLoaded >= 7
    }

    return (
        <main>
            <section className={`profile ${isReady || 'hiddden'}`} >
                <div className="profile__wrapper" onClick={onEditAvatar}>
                    {isLoaded || <div className="profile__image profile__image_spinner" />}
                    <img 
                        src={user?.avatar} 
                        draggable="false"  
                        alt="profile" 
                        className={`profile__image ${isLoaded || 'profile__image_hidden'}`} 
                        onLoad={() => setIsLoaded(true)}
                        onError={() => setIsLoaded(false)}
                    />
                </div>
                <div className="profile__info">
                    <h1 className="profile__name">{user?.name}</h1>
                    <p className="profile__text">{user?.about}</p>
                    <button 
                        className="profile__edit-button" 
                        aria-label="edit-button" 
                        type="button" 
                        onClick={onEditProfile}
                    />
                </div>
                <button className="profile__add-button" aria-label="close-button" type="button" onClick={onAddPlace} />
            </section>
            <section className={`cards ${showCards() || 'hiddden'}`}>
                {cards.map((card, i) => ( 
                    <Card 
                        key={card._id} 
                        card={card} 
                        onCardClick={onCardClick} 
                        onCardDelete={onCardDelete} 
                        onCardLike={onCardLike}
                        loading={i < 7 ? handleCardLoading : null}
                        onUnLoadedImage={onUnLoadedImage}
                    />
                ))}
            </section>
        </main>
    )
}

export default Main