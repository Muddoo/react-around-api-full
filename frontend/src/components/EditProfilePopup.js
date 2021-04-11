import { useState, useContext, useEffect } from 'react'
import PopupWithForm from './PopupWithForm'
import CurrentUserContext from '../contexts/CurrentUserContext'

function EditProfilePopup(props) {
    const {isOpen,onClose,submit} = props;
    const user = useContext(CurrentUserContext);
    const [fields,setFields] = useState({});
    const [errors,setErrors] = useState({});

    useEffect(() => {
        setFields({
            name: user?.name,
            about: user?.about
        })
    },[user])

    function handleChange(e) {
      setFields({...fields, [e.target.name]: e.target.value.trim() && e.target.value});
      setErrors({...errors, [e.target.name]: e.target.validationMessage});
    }

    function setButtonState() {
        const isField = Object.values(fields).every(field => field !== '');
        const isError = Object.values(errors).some(error => error !== '');
        return isError || !isField
    }

    function handleSubmit(e) {
        e.preventDefault();
        e.target.querySelector('.popup__submit').textContent = 'Saving...';
        submit(fields);
    }

    return (
        <PopupWithForm 
            title='Edit profile' 
            name='profile-info' 
            isOpen={isOpen}
            onClose={onClose}
            inputs={[['text','Name','name',2,40],['text','About me','about',2,200]]}
            submit={handleSubmit}
            submitText='Save'
            submitButtonState={setButtonState()}
            field={fields}
            error={errors}
            onChange={handleChange}
        />
    )
}

export default EditProfilePopup