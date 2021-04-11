import {useRef, useEffect} from 'react'
import PopupWithForm from './PopupWithForm'

function DeletePlacePopup(props) {
    const {isOpen,onClose,submit} = props;
    const activeButton = useRef();

    useEffect(() => isOpen && activeButton.current.focus(),[isOpen])

    function handleSubmit(e) {
        e.preventDefault();
        e.target.querySelector('.popup__submit').textContent = 'Saving...';
        submit();
    }
    return (
        <PopupWithForm 
            title='Are you sure?' 
            name='delete' 
            isOpen={isOpen}
            onClose={onClose}
            submitText='Yes'
            submit={handleSubmit}
            refButton={activeButton}
        />
    )
}

export default DeletePlacePopup