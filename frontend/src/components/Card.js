import {useContext} from 'react'
import CurrentUserContext from '../contexts/CurrentUserContext'
function Card(props) {
    const {card,onCardClick,onCardDelete,onCardLike,loading,onUnLoadedImage} = props;


    const user = useContext(CurrentUserContext);

    const isOwner = user._id === card.owner;
    const isLiked = card.likes.some(data => data._id === user._id);

    return (
        <div className="card">
            <img 
                src={card.link} 
                draggable="false" 
                alt={card.name} 
                className="card__image" 
                onClick={() => onCardClick(card)}
                // onLoad={loading}
                // onError={() => onUnLoadedImage(card)}
            />
            <div className="card__details">
                <h2 className="card__text">{card.name}</h2>
                <button 
                    className={`card__icon-heart ${isLiked && 'card__icon-heart_black animate'}`}
                    type="button" 
                    aria-label="heart-button" 
                    title="like"
                    onClick={() => onCardLike(card)}
                />
                <span className="card__likes">{card.likes.length}</span>
            </div>
            <button 
                className="card__icon-delete" 
                type="button" 
                aria-label="trash-button" 
                title="delete"
                onClick={() => onCardDelete(card)}
                hidden={!isOwner}
            />
        </div>
    )
}

export default Card