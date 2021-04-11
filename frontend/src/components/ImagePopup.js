function ImagePopup(props) {
    const {isOpen, card, onClose, onClick} = props;

    return (
        <figure className={`popup popup_figure ${isOpen ? 'visible' : null}`} onClick={onClose}>
            <div className="popup__container">
                <img 
                    src={card && card.link} 
                    draggable="false" 
                    alt="popup" 
                    className="popup__image" 
                    onClick={onClick}
                />
                <p className="popup__caption">{card.name}</p>
                <button className="popup__close popup__close_fig" aria-label="close-button" type="button" title="close"/>
            </div>
        </figure>
    )
}

export default ImagePopup