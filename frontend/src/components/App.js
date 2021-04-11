import {useState,useEffect} from 'react'
import {Route, Redirect, useHistory} from 'react-router-dom'
import {checkToken, authorize, register} from '../utils/auth'
import logo from '../images/Vectorlogo.svg'
import Header from './Header'
import Main from './Main'
import Footer from './Footer'
import EditAvatarPopup from './EditAvatarPopup'
import EditProfilePopup from './EditProfilePopup'
import DeletePlacePopup from './DeletePlacePopup'
import AddPlacePopup from './AddPlacePopup'
import ImagePopup from './ImagePopup'
import Login from './Login'
import Register from './Register'
import InfoTooltip from './InfoTooltip'
import ProtectedRoute from './ProtectedRoute'
import Api from '../utils/api'
import CurrentUserContext from '../contexts/CurrentUserContext'

function App() {
    const [currentUser,setCurrentUser] = useState({});
    const [cards,setCards] = useState([]);
    const [avatarPopup,setAvatarPopup] = useState(false);
    const [profilePopup,setProfilePopup] = useState(false);
    const [cardPopup,setCardPopup] = useState(false);
    const [deletePopup,setDeletePopup] = useState(false);
    const [imagePopup,setImagePopup] = useState(false);
    const [selectedCard,setSelectedCard] = useState({});
    const [loggedIn,setLoggedIn] = useState(true);
    const [registered,setRegistered] = useState(false); 
    const [isOpenToolTip,setIsOpenToolTip] = useState(false);
    const [email, setEmail] = useState('');
    const [token,setToken] = useState('')

    const history = useHistory()

    const api = new Api({
        baseUrl:'https://boiling-scrubland-25608.herokuapp.com',
        options: {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
    });

    useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        if(jwt) {
            return checkToken(jwt)
                    .then(({data}) => {
                        if(data) {
                            setToken(jwt)
                            setLoggedIn(true)
                            setEmail(data.email)
                            return
                        };
                        setLoggedIn(false)
                    })
                    .catch(err => console.log(err))
        }
        setLoggedIn(false)
    },[])

    useEffect(() => {
        token &&
        Promise.all([api.getUser(),api.queryCards({})])
               .then(data => {
                   const [user,initialCards] = data;
                   setCurrentUser(user.data)
                   setCards(initialCards.reverse())
               })
               .catch(err => console.log(err))
    },[token])

    function toggleToolTip() {
        setIsOpenToolTip(!isOpenToolTip)
    }
    function handleRegister(password,email) {
        return register(password,email)
            .then(res => {
                if(res.data)  {
                    setLoggedIn(true)
                    history.push('/signin')
                    handleAuth(password,email)
                    setRegistered(true)
                    toggleToolTip()
                    return
                };
                setRegistered(false)
                toggleToolTip()
            })
            .catch(err => console.log(err))
    }
    function handleAuth(password,email) {
        authorize(password, email)
            .then(({token}) => {
                if(token) {
                    localStorage.setItem('jwt', token)
                    setToken(token)
                    setLoggedIn(true)
                    setEmail(email)
                    return
                }
                setRegistered(false)
                toggleToolTip()
            })
            .catch(err => console.log(err))
    }
    function handleLogin() {
        setLoggedIn(!loggedIn)
    }
    function handleEditAvatarClick() {
        setAvatarPopup(true)
    }
    function handleEditProfileClick() {
        setProfilePopup(true)
    }
    function handleAddPlaceClick() {
        setCardPopup(true)
    }
    function handleCardClick(card) {
        setImagePopup(true)
        setSelectedCard(card)
    }
    function handleCardDelete(card) {
        setDeletePopup(true);
        setSelectedCard(card);
    }
    function handleImagePopupClick() {
        let index = cards.indexOf(selectedCard) + 1;
        if(index === cards.length) index = 0; 
        setSelectedCard(cards[index])
    }
    function handleUserAvatarUpdate(field) {
        api.updateProfile({ avatar: 'avatar', body: field })
            .then(user => setCurrentUser(user))
            .catch(err => console.log(err))
            .finally(() => closeAllPopups())
    }
    function handleUserInfoUpdate(field) {
        api.updateProfile({body: field})
            .then(user => setCurrentUser(user))
            .catch(err => console.log(err))
            .finally(() => closeAllPopups())
    }
    function handleAddPlaceSubmit(field) {
        api.queryCards({ method: 'POST', body: field })
            .then(place => {
            setCards([place,...cards]);
            })
            .catch(err => console.log(err))
            .finally(() => closeAllPopups())
    }
    function handleDeleteCardSubmit(card = selectedCard) {
        const newCards = cards.filter(item => item._id !== card._id);
            api.queryCards({query: card._id, method: 'DELETE'})
               .then(() => setCards(newCards))
               .catch(err => {
                  console.log(err);
                  setCards(cards);
                })
               .finally(() => closeAllPopups())
    }
    function handleLikeClick(card) {
        const method = card.likes.some(data => data._id === currentUser._id) ? 'DELETE' : 'PUT';
        // const newLike = method === 'DELETE' ? card.likes.filter(item => item._id !== currentUser._id) : [...card.likes, {_id: currentUser._id}];
        // const newCards = cards.map(item => card._id === item._id ? {...item,likes: newLike} : item);
        // setCards(newCards);
        api.queryCards({ query: `${card._id}/likes`, method })
            .then(data => {
                const newCards = cards.map(c => c._id === data._id ? data : c)
                setCards(newCards)
            })
            .catch(err => {
                console.log(err);
                setCards(cards)
            })
    }
    function handleUnloadedImage(card) {
        handleDeleteCardSubmit(card);
    }
    function closeAllPopups() {
            setAvatarPopup(false);
            setProfilePopup(false);
            setCardPopup(false);
            setDeletePopup(false);
            setImagePopup(false);
    }
    function handleOverlayAndCrossClick(e) {
        if(e.target.classList.contains('popup') || e.target.classList.contains('popup__close')) closeAllPopups();
    }

  return (
    <div className="page">
        <CurrentUserContext.Provider value={currentUser}>
            <Route path='/signin'>
                { loggedIn ? 
                    <Redirect to='/' /> : 
                    <Login 
                        logo={logo} 
                        handleAuth={handleAuth} /> }
            </Route>
            <Route path='/signup'>
                { loggedIn ? 
                    <Redirect to='/' /> : 
                    <Register
                        logo={logo}
                        handleRegister={handleRegister} /> }
            </Route>
            <ProtectedRoute 
                path="/" 
                loggedIn={loggedIn}
                >
                <Header 
                    logo={logo}
                    email={email}
                    handleLog={handleLogin} />
                <Main 
                    cards={cards}
                    onEditAvatar={handleEditAvatarClick}  
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                    onCardDelete={handleCardDelete}
                    onCardLike={handleLikeClick}
                    onUnLoadedImage={handleUnloadedImage}
                    onUnloadedAvatar={handleUserAvatarUpdate}
                />
                <Footer />
                <EditAvatarPopup 
                    isOpen={avatarPopup} 
                    onClose={handleOverlayAndCrossClick} 
                    submit={handleUserAvatarUpdate} 
                />
                <EditProfilePopup 
                    isOpen={profilePopup} 
                    onClose={handleOverlayAndCrossClick} 
                    submit={handleUserInfoUpdate} 
                />
                <AddPlacePopup 
                    isOpen={cardPopup} 
                    onClose={handleOverlayAndCrossClick} 
                    submit={handleAddPlaceSubmit} 
                />
                <DeletePlacePopup 
                    isOpen={deletePopup} 
                    onClose={handleOverlayAndCrossClick} 
                    submit={handleDeleteCardSubmit} 
                />
                <ImagePopup 
                    isOpen={imagePopup}
                    card={selectedCard}
                    onClose={handleOverlayAndCrossClick}
                    onClick={handleImagePopupClick}
                />
            </ProtectedRoute>   
            <Route path='/'>
                { loggedIn ? <Redirect to='/' /> : <Redirect to='/signin' /> }
            </Route> 
            <InfoTooltip 
                isOpen={isOpenToolTip} 
                registered={registered} 
                toggle={toggleToolTip}
                />
        </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
