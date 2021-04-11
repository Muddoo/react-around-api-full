import { useState } from 'react'

function Header(props) {
    const [isOpen,setIsOpen] = useState(false)

    function handleClick() {
        setIsOpen(!isOpen)
    }
    function logout() {
        localStorage.removeItem('jwt');
        props.handleLog()
    }

    return (
        <header className={`header ${isOpen && 'header_open'}`}>
            <img draggable="false" src={props.logo} alt="logo" className="logo" />
            <div className={`header__wrapper ${isOpen && 'header__wrapper_open'}`}>
                <p className='header__email'>{ props.email }</p>
                <button
                    className='header__log'
                    onClick={logout}>Log out</button>
            </div>
            <button 
                className={`header__icon ${isOpen && 'header__icon_cross'}`}
                onClick={handleClick} />
        </header>
    )
}

export default Header