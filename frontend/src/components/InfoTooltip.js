function InfoTooltip(props) {
    const { registered, isOpen, toggle } = props

    return (
        <div 
            className={`tip ${isOpen && 'tip_visible'}`}
            onClick={e => e.target === e.currentTarget && toggle()}
            >
            <div className='tip__wrapper'>
                <div className={registered ? 'tip__icon' : 'tip__icon tip__icon_error' } />
                <p className='tip__text'>
                    { registered ? 
                        'Success! You have now been registered.' :
                        'Oops, something went wrong! Please try again.' }
                </p>
                <div 
                    className="tip__close"
                    onClick={toggle} 
                    />
            </div>
        </div>
    )
}

export default InfoTooltip